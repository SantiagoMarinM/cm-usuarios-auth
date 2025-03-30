# Servicio de Autenticación por Token para Clientes

Este módulo provee funcionalidades para la **generación**, **validación** asociados a clientes autenticados. Los tokens están firmados digitalmente y tienen una expiración configurable.

## 📦 Endpoints

### 1. `GET /`
#### 🔐 Generar Token

Este endpoint genera un **token JWT firmado** para un cliente autorizado.

#### 📥 Requiere headers:
- `x-client-id`: Identificador del cliente.
- `x-request-id`: Identificador de la petición actual (se incluirá dentro del token).

#### 📤 Respuesta:
```json
{
  "response": {
    "isError": false,
    "autorizado": true,
    "token": "JWT_GENERADO"
  }
}
```

#### ❌ Errores posibles:
- Cliente inactivo.
- Cliente no encontrado.
- Error al firmar el token.

---

### 2. `GET /validar-token`
#### 🔒 Validar Token

Este endpoint valida que un token JWT enviado en los headers sea:
- Correcto
- No expirado
- Asociado a un cliente válido y activo

#### 📥 Requiere headers:
- `x-client-id`: Identificador del cliente.
- `authorization`: Token JWT en formato `Bearer <token>`

#### 📤 Respuesta:
```json
{
  "response": {
    "isError": false,
    "autorizado": true,
    "message": "Token válido"
  }
}
```

#### ❌ Errores posibles:
- Token inválido o expirado.
- Cliente inactivo.
- Cliente no encontrado.

---

### 3. `DELETE /redis`
#### 🧹 Eliminar usuarios activos de Redis (temporal/cache)

Este endpoint elimina el los usuarios activos en Redis. Útil para limpiar datos temporales.

---

## ⚙️ Lógica de Validación de Cliente

Tanto para generar como para validar el token, el sistema verifica si el cliente:

1. **Existe** (buscando primero en Redis, luego en la base de datos).
2. **Está activo** (`activo === true`).

Si el cliente es válido:
- Se guarda en Redis para futuras validaciones rápidas.
- Se incluye su información en el token (al generarlo).

---

## 🔐 Estructura del Token

El token generado incluye:
```json
{
  "id_cliente": "x-client-id",
  "id_peticion": "x-request-id",
  "activo": true
}
```
Y se firma con una **llave secreta configurable** (`ENV.LLAVE_SECRETA`), con expiración de `1h` (o configurable por cliente).

---

## 🧱 Dependencias Técnicas

- **Redis**: Cache para validación rápida de clientes.
- **JWT** (`jsonwebtoken`): Para firmar y verificar tokens.
- **Inversify**: Inyección de dependencias.
- **pg-promise / repositorio personalizado**: Acceso a base de datos.

---

## 📁 Organización del Módulo

- `GET /` → `GenerarTokenUseCase`
- `GET /validar-token` → `ValidarTokenUseCase`
- Validación de cliente compartida: `ValidarIdClienteUseCase`

---

## ✅ Requisitos para clientes

Para poder generar y validar tokens, un cliente debe:
- Existir en Redis o base de datos.
- Tener el campo `activo = true`.

---

## 🧪 Ejemplo de uso (curl)

### Generar token:
```bash
curl -X GET http://localhost:3000/ \
  -H "x-client-id: cliente123" \
  -H "x-request-id: peticion456"
```

### Validar token:
```bash
curl -X GET http://localhost:3000/validar-token \
  -H "x-client-id: cliente123" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🛠️ Autor y mantenimiento

Desarrollado como parte de examen de seniority para la empresa Coordinadora Mercantil.
Se recomienda utilizar yarn como gestor de paquetes y versiones de Node por encima de 18
