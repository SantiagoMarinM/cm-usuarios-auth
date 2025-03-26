import { Request } from '@common/http/Request';
import { injectable } from 'inversify';
import { Response } from '@common/http/Response';
import Result from '@common/http/Result';
import { HealtCheckUseCase } from '../usecase/HealtCheckUseCase';
import { GLOBAL_CONTAINER } from '@common/dependencies/DependencyContainer';

@injectable()
export class HealtCheckController {
    async healtCheck(_req: Request<string>): Promise<Response<string | null | string>> {
        return Result.ok<string>('ok');
    }

    async healtCheckDB(_req: Request<string>): Promise<Response<string | null | string>> {
        const healtCheckService = GLOBAL_CONTAINER.get(HealtCheckUseCase);
        await healtCheckService.healtCheckDB();

        return Result.ok<string>('ok');
    }
}
