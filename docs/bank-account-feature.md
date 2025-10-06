# Feature: Cuentas Bancarias

## Descripción
Esta feature permite gestionar las cuentas bancarias propias y de los clientes para el manejo de movimientos bancarios y el cotejado con las facturas pagadas.

## Modelo de Datos

### Enum AccountType
- `CuentaCorriente`
- `CajaDeAhorro`
- `CuentaDeSueldo`
- `CuentaEnMonedaExtranjera`

### Modelo BankAccount
- `id`: ID único de la cuenta
- `bank`: Nombre del banco
- `accountNumber`: Número de cuenta
- `cbu`: CBU (opcional)
- `alias`: Alias de la cuenta (opcional)
- `accountType`: Tipo de cuenta (enum)
- `holder`: Nombre del titular
- `holderCUIT`: CUIT del titular
- `balance`: Saldo de la cuenta (default: 0)
- `billingProfileId`: ID del perfil de facturación (opcional, para cuentas de clientes)
- `createdAt`, `updatedAt`: Timestamps
- `deleted`, `deletedAt`: Soft delete

## Queries Disponibles

### `bankAccounts`
Obtiene todas las cuentas bancarias propias (sin perfil de facturación).
**Campos devueltos:**
- Número de cuenta
- Banco
- Tipo de cuenta
- Balance

### `bankAccount(id: String!)`
Obtiene una cuenta bancaria específica por ID.
**Campos devueltos:**
- Número de cuenta
- Banco
- Tipo de cuenta
- CBU
- Alias
- Titular
- CUIT titular

### `bankAccountsByBillingProfile(billingProfileId: String!)`
Obtiene las cuentas bancarias de un perfil de facturación específico.

## Mutations Disponibles

### `createBankAccount(input: BankAccountInput!)`
Crea una nueva cuenta bancaria.

**Parámetros:**
- `bank`: Nombre del banco (requerido)
- `accountNumber`: Número de cuenta (requerido)
- `cbu`: CBU (opcional)
- `alias`: Alias (opcional)
- `accountType`: Tipo de cuenta (requerido)
- `holder`: Nombre del titular (requerido)
- `holderCUIT`: CUIT del titular (requerido)
- `billingProfileId`: ID del perfil de facturación (opcional)

**Validaciones:**
- No puede existir otra cuenta con el mismo número en el mismo banco
- Si se especifica `billingProfileId`, la cuenta se asocia al cliente

### `updateBankAccount(id: String!, input: BankAccountUpdateInput!)`
Actualiza el alias de una cuenta bancaria.

**Parámetros:**
- `id`: ID de la cuenta
- `input.alias`: Nuevo alias (requerido)

### `deleteBankAccount(id: String!)`
Elimina una cuenta bancaria (soft delete).

## Autorización
Todas las operaciones requieren autenticación y permisos de:
- `IsAdministrativoTecnico` o
- `IsAdministrativoContable`

## Casos de Uso

### Cuentas Propias
- Las cuentas sin `billingProfileId` se consideran cuentas propias
- Se usan para gestionar los movimientos bancarios de la empresa

### Cuentas de Clientes
- Las cuentas con `billingProfileId` se asocian a clientes específicos
- Permiten el cotejado de pagos de facturas con movimientos bancarios

## Integración con Perfiles de Facturación
El modelo `BillingProfile` ahora incluye una relación con `BankAccount`, permitiendo que cada cliente tenga múltiples cuentas bancarias asociadas.

## Ejemplos de Uso

### Crear cuenta propia
```graphql
mutation {
  createBankAccount(input: {
    bank: "Banco Santander"
    accountNumber: "123456789"
    cbu: "0110123456789012345678"
    alias: "Cuenta Principal"
    accountType: CuentaCorriente
    holder: "Empresa S.A."
    holderCUIT: "30-12345678-9"
  }) {
    success
    message
    bankAccount {
      id
      bank
      accountNumber
      balance
    }
  }
}
```

### Crear cuenta de cliente
```graphql
mutation {
  createBankAccount(input: {
    bank: "Banco Nación"
    accountNumber: "987654321"
    accountType: CajaDeAhorro
    holder: "Cliente Ejemplo"
    holderCUIT: "20-98765432-1"
    billingProfileId: "profile_id_here"
  }) {
    success
    message
    bankAccount {
      id
      bank
      accountNumber
      holder
    }
  }
}
```

### Obtener cuentas propias
```graphql
query {
  bankAccounts {
    id
    bank
    accountNumber
    accountType
    balance
    alias
  }
}
``` 