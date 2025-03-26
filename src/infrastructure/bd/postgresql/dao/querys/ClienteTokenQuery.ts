export const insertCliente = `INSERT INTO clientes (alias, nombre, disparador_pubsub, disparador_rest, fecha_hora_registro, activo, apikey, clave)
                 VALUES ('REP', $1, true, true, now(), $2, $3, $4)
                 RETURNING id`;

export const selectValidarCliente = `SELECT activo, tiempo_expiracion FROM santiago.clientes_autorizados WHERE codigo_empleado = $1`;
