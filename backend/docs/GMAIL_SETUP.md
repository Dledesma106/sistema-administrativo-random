# Configuración de Gmail con OAuth2 para Cuentas Personales

## Requisitos Previos

1. **Cuenta de Google Cloud Platform**
2. **Proyecto habilitado con Gmail API**
3. **Credenciales OAuth2 configuradas**
4. **Cuenta de administración general (Gmail personal)**

## Pasos de Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Gmail API** en la sección de APIs y servicios

### 2. Configurar Credenciales OAuth2

1. Ve a **APIs y servicios > Credenciales**
2. Haz clic en **"Crear credenciales" > "ID de cliente de OAuth 2.0"**
3. Selecciona **"Aplicación web"**
4. Configura las URLs autorizadas:
   - **Orígenes de JavaScript autorizados**: `http://localhost:3000`
   - **URI de redirección autorizados**: `http://localhost:3000/api/gmail/callback`

### 3. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
GOOGLE_ACCESS_TOKEN=tu_access_token_aqui
GOOGLE_REFRESH_TOKEN=tu_refresh_token_aqui
```

### 4. Scopes de Gmail

Los siguientes scopes están configurados en el servicio:

- `https://www.googleapis.com/auth/gmail.readonly` - Lectura de emails
- `https://www.googleapis.com/auth/gmail.modify` - Modificación de emails (para futuras funcionalidades)

## Flujo de Configuración Inicial

### 1. Obtener URL de Autorización

```graphql
query {
  getGmailAuthUrl {
    success
    data {
      authUrl
    }
  }
}
```

### 2. Autorizar la Cuenta de Administración

1. Abre la URL obtenida en el navegador
2. Inicia sesión con la cuenta de administración general (ej: `admin.empresa@gmail.com`)
3. Otorga los permisos solicitados
4. Google te redirigirá con un código de autorización

### 3. Procesar el Código de Autorización

```graphql
mutation {
  handleGmailAuthCallback(code: "codigo_de_autorizacion") {
    success
    message
  }
}
```

### 4. Configurar Variables de Entorno

Después de procesar el callback, verás en la consola del servidor:
- Access Token
- Refresh Token
- Expiry Date

Copia estos valores a las variables de entorno:
```env
GOOGLE_ACCESS_TOKEN=el_access_token_de_la_consola
GOOGLE_REFRESH_TOKEN=el_refresh_token_de_la_consola
```

## Ventajas del Enfoque OAuth2

1. **Compatible con Gmail Personal**: Funciona con cuentas `@gmail.com`
2. **Sin Dominio Requerido**: No necesitas Google Workspace
3. **Configuración Única**: Una sola autorización para toda la aplicación
4. **Seguridad**: Los tokens están en el servidor

## Operaciones Disponibles

### Verificar Configuración

```graphql
query {
  isGmailConfigured {
    success
    data {
      isConfigured
    }
  }
}
```

### Buscar Threads de Presupuestos

```graphql
query {
  searchBudgetThreads(query: "cliente específico") {
    success
    threads {
      id
      snippet
      messages {
        id
        snippet
        payload
      }
    }
  }
}
```

### Buscar Threads por Cliente

```graphql
query {
  searchThreadsByClient(clientEmail: "cliente@gmail.com") {
    success
    threads {
      id
      snippet
      messages {
        id
        snippet
      }
    }
  }
}
```

### Obtener Threads Recientes

```graphql
query {
  getRecentGmailThreads {
    success
    threads {
      id
      snippet
      messages {
        id
        snippet
      }
    }
  }
}
```

### Obtener Thread Específico

```graphql
query {
  getGmailThread(threadId: "thread_id_here") {
    success
    thread {
      id
      snippet
      messages {
        id
        snippet
        payload
      }
    }
  }
}
```

### Obtener Información Básica de Thread

```graphql
query {
  getGmailThreadInfo(threadId: "thread_id_here") {
    success
    thread {
      id
      snippet
      messages {
        id
        snippet
      }
    }
  }
}
```

### Búsqueda Personalizada

```graphql
query {
  searchGmailThreads(input: {
    query: "from:cliente@gmail.com subject:presupuesto"
    maxResults: 10
  }) {
    success
    threads {
      id
      snippet
      messages {
        id
        snippet
      }
    }
  }
}
```

## Mutations Disponibles

### Refrescar Tokens

```graphql
mutation {
  refreshGmailTokens {
    success
    message
  }
}
```

### Verificar Existencia de Thread

```graphql
mutation {
  verifyGmailThreadExists(threadId: "thread_id") {
    success
    data {
      exists
    }
    message
  }
}
```

## Integración con Presupuestos

Los presupuestos pueden incluir un `gmailThreadId` que permite vincular directamente con un thread de Gmail:

```graphql
mutation {
  createBudget(input: {
    subject: "Presupuesto Cliente XYZ"
    price: 1500.00
    billingProfileId: "profile_id"
    gmailThreadId: "gmail_thread_id"
  }) {
    success
    budget {
      id
      gmailThreadId
    }
  }
}
```

## Flujo de Trabajo Recomendado

### 1. Crear Presupuesto
1. Buscar threads de presupuestos: `searchBudgetThreads`
2. Seleccionar thread relevante
3. Crear presupuesto con `gmailThreadId`

### 2. Ver Detalle de Presupuesto
1. Obtener presupuesto con `gmailThreadId`
2. Si tiene `gmailThreadId`, usar `getGmailThread` para obtener emails actualizados
3. Mostrar conversación en tiempo real

### 3. Validación de Threads
1. Verificar existencia antes de vincular: `verifyGmailThreadExists`
2. Usar `getGmailThreadInfo` para obtener información básica sin cargar todo el contenido

## Consideraciones de Seguridad

1. **Tokens Seguros**: Los tokens están en variables de entorno del servidor
2. **Refresh Automático**: Los tokens se refrescan automáticamente cuando expiran
3. **Autorización**: Solo usuarios con rol `IsAdministrativoContable` pueden acceder
4. **Auditoría**: Todas las operaciones quedan registradas en Gmail

## Gestión de Tokens

### Renovar Tokens Expirados

Los tokens de acceso expiran cada hora. Para renovarlos:

```graphql
mutation {
  refreshGmailTokens {
    success
    message
  }
}
```

### Reconfigurar Tokens

Si necesitas cambiar la cuenta de administración:

1. Eliminar las variables `GOOGLE_ACCESS_TOKEN` y `GOOGLE_REFRESH_TOKEN`
2. Usar `getGmailAuthUrl` para obtener nueva URL
3. Autorizar con la nueva cuenta
4. Usar `handleGmailAuthCallback` con el nuevo código
5. Actualizar las variables de entorno con los nuevos tokens

## Troubleshooting

### Error: "Gmail no está configurado"

1. Verifica que las variables de entorno estén configuradas
2. Confirma que `GOOGLE_ACCESS_TOKEN` y `GOOGLE_REFRESH_TOKEN` tengan valores válidos
3. Usa `refreshGmailTokens` para renovar tokens expirados

### Error: "Access Denied"

1. Verifica que las credenciales OAuth2 estén correctamente configuradas
2. Confirma que los scopes estén habilitados en Google Cloud Console
3. Revisa que la cuenta de administración tenga permisos

### Error: "Tokens expirados"

1. Usa `refreshGmailTokens` para renovar automáticamente
2. Si falla el refresh, reconfigura los tokens siguiendo el flujo de autorización
3. Actualiza las variables de entorno con los nuevos tokens

### Error: "Thread not found"

1. Verifica que el `threadId` sea válido
2. Confirma que el thread exista en la cuenta de administración
3. Usa `verifyGmailThreadExists` para validar antes de usar

### Error: "API Quota Exceeded"

1. Google tiene límites de cuota para la Gmail API
2. Implementa cache en el frontend para reducir llamadas
3. Considera usar webhooks para actualizaciones en tiempo real
4. Optimiza las consultas para obtener solo los datos necesarios 