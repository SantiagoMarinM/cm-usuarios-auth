/* eslint-disable */

import { fastify, FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync, FastifyError } from 'fastify';
import { IModule } from '@common/modules/IModule';
import { HTTPMETODO } from '@common/modules/Ruta';
import { randomBytes } from 'crypto';
import { ENV } from '@modules/shared';
import { DefaultErrorModel } from './DefaultError';
import { IServer } from '../IServer';
import CustomError from '@infrastructure/app/util/CustomError';
import fastifyCors from '@fastify/cors';
import { decodeBase64, isValidBase64 } from '@common/utils/base64';
import { getNestedValue } from '@common/utils';
import rateLimit from '@fastify/rate-limit';
import * as fs from 'fs';
import * as path from 'path';

export class FastifyServer implements IServer {
    port: number = +ENV.PORT;
    app: FastifyInstance;

    constructor() {
        this.app = fastify({
            logger: false,
            return503OnClosing: false,
            bodyLimit: 100 * 1024 * 1024,
            genReqId: (_) => randomBytes(20).toString('hex'),
        });

        this.printRoutes();
        this.errorHandler();
        this.printIncomming();
        this.addRateLimit();
        this.registerDocs(); // 👈 Redoc aquí
    }

    private registerDocs = (): void => {
        this.app.get('/docs/json', async (_req, reply) => {
            try {
                const specPath = path.resolve(__dirname, 'openapi.json');
                const json = fs.readFileSync(specPath, 'utf-8');
                reply.type('application/json').send(JSON.parse(json));
            } catch (error) {
                console.error('Fallo cargando openapi.json:', error.message);
                reply.code(500).send({ error: 'Error cargando documentación OpenAPI' });
            }
        });
          

        this.app.get('/docs', async (_req, reply) => {
            reply
                .code(200)
                .type('text/html')
                .header(
                    'Content-Security-Policy',
                    "default-src 'self' https://cdn.redoc.ly blob:; " +
                        "script-src 'self' https://cdn.redoc.ly 'unsafe-inline' blob:; " +
                        "style-src 'self' https://cdn.redoc.ly 'unsafe-inline';",
                ).send(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Redoc</title>
                    <meta charset="utf-8" />
                    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
                  </head>
                  <body>
                    <div id="redoc-container"></div>
                    <script>
                      Redoc.init('/docs/json', {}, document.getElementById('redoc-container'));
                    </script>
                  </body>
                </html>
              `);
        });
    };

    private addRateLimit = () => {
        this.app.register(rateLimit, {
            max: 8000,
            timeWindow: 60000,
            hook: 'preHandler',
            errorResponseBuilder: function (_request: any) {
                return {
                    code: 500,
                    error: 'RATE LIMIT ERROR',
                    message: 'Demasiadas peticiones, inténtelo más tarde',
                    date: Date.now(),
                };
            },
        });
    };

    private printIncomming = async () => {
        this.app.addHook('onSend', async (_request, _reply, payloadResponse) => {
            const incommingData = this.buildDataLog(_request);
            console.log(
                JSON.stringify({
                    statusCode: _reply.statusCode,
                    RESPONSE: _request.url,
                    incommingData,
                    payloadResponse,
                }),
            );
        });
    };

    private printRoutes = async (): Promise<void> => {
        this.app.addHook('onRoute', (r) => {
            if (r.method !== 'HEAD' && !r.url.includes('api/docs/static')) {
                console.log(r.method, r.url);
            }
        });
        this.app.register(fastifyCors, {
            allowedHeaders: ['Origin', 'Authorization', 'Accept', 'X-Requested-With', 'Content-Type'],
            methods: ['GET', 'PUT', 'POST'],
            origin: (origin: string | undefined, cb: Function) => {
                if (ENV.ALLOWED_ORIGIN === '*') {
                    return cb(null, true);
                }
                const isAllowedOrigin = ENV.ALLOWED_ORIGIN.split(',').includes(origin ?? '');
                if (isAllowedOrigin) {
                    return cb(null, true);
                }
                return cb(new Error('Not allowed by CORS'), false);
            },
        });
    };

    private errorHandler = () => {
        this.app.setErrorHandler((error, _request, reply) => {
            if (error?.validation?.length) {
                error.statusCode = 400;
            }
            const errorResponse =
                error instanceof CustomError ? this.buildResponseError(error) : this.buildDefaultError(error);
            const statusCode = error?.statusCode && +error.statusCode > 0 ? error.statusCode : 500;
            reply.status(statusCode).send(errorResponse);
        });
    };

    buildResponseError(error: CustomError): DefaultErrorModel {
        return {
            statusCode: error.statusCode,
            message: error?.message,
            stack: error?.stack,
            defaultMessage: 'Error handler log',
            isError: error.isCustomError,
            cause: '',
            code: error.statusCode,
            details: error,
        };
    }

    buildDefaultError(error: FastifyError): DefaultErrorModel {
        return {
            message: error?.message ?? 'Error sin mensaje',
            isError: true,
            cause: 'Error sin causa',
            stack: error?.stack ?? 'Error sin stack',
            code: error?.code !== null && error?.code !== undefined ? +error.code : 500,
            statusCode: error?.statusCode ?? 500,
            defaultMessage: 'Error handler log',
            details: error,
        };
    }

    buildDataLog(request: FastifyRequest) {
        try {
            const body = getNestedValue(request, 'body.message.data', request.body);
            return typeof body === 'string' && isValidBase64(body) ? decodeBase64(body) : body;
        } catch (error) {
            console.log('ERROR DECODIFICANDO DATA DE BASE64');
            return request.body;
        }
    }

    addModule = async (module: IModule): Promise<void> => {
        const prefix = `/${ENV.DOMAIN}/${ENV.SERVICE_NAME}`;
        const pluggin: FastifyPluginAsync = async (router) => {
            const rutas = module.getRutas();
            for (const indexRuta in rutas) {
                const ruta = rutas[indexRuta];
                const url = ruta.url;
                const schema = ruta?.schema ?? {};
                switch (ruta.metodo) {
                    case HTTPMETODO.POST:
                        router.post(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const { logger } = req as any;
                            const headers = req.headers;
                            const data = {
                                ...(req.body as Record<string, unknown>),
                                ...(req.params as Record<string, unknown>),
                            };
                            const request = { data, logger, headers };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PUT:
                        router.put(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.PATCH:
                        router.patch(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                },
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.DELETE:
                        router.delete(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const headers = req.headers;
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                    ...(req.query as Record<string, unknown>),
                                },
                                headers,
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                    case HTTPMETODO.GET:
                    default:
                        router.get(url, schema, async (req: FastifyRequest<any>, reply: FastifyReply) => {
                            const headers = req.headers;
                            const request = {
                                data: {
                                    ...(req.body as Record<string, unknown>),
                                    ...(req.params as Record<string, unknown>),
                                    ...(req.query as Record<string, unknown>),
                                },
                                headers,
                            };
                            const result = await ruta.evento(request);
                            reply.header('Content-Type', 'application/json');
                            reply.status(result.status).send(JSON.stringify(result.response));
                        });
                        break;
                }
            }
        };
        this.app.register(pluggin, {
            prefix: prefix + module.ruta,
        });
    };

    start = async (): Promise<void> => {
        try {
            await this.app.listen({ port: this.port });
            console.log(`Application running on port ${this.port}`);
        } catch (err) {
            console.log(JSON.stringify(err));
            process.exit(1);
        }
    };
}
