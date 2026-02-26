# Configuración de AFIP - Facturación Electrónica

Este documento describe las variables de entorno necesarias para configurar la integración con AFIP (Administración Federal de Ingresos Públicos) para facturación electrónica.

## Variables de Entorno Requeridas

### Variables Críticas (Obligatorias)

```bash
# CUIT del emisor (formato: XX-XXXXXXXX-X o sin guiones)
# Ejemplo: 20-12345678-9
AFIP_CUIT=20-12345678-9

# Modo de operación: 'true' para producción, 'false' para homologación/testing
# IMPORTANTE: En producción usar certificados válidos y CUIT real
AFIP_PRODUCTION=false

# Contenido del certificado .crt de AFIP (formato PEM)
# Se puede obtener desde el sitio de AFIP después de generar el certificado
# Incluir todo el contenido del archivo .crt incluyendo las líneas:
# -----BEGIN CERTIFICATE-----
# ...
# -----END CERTIFICATE-----
AFIP_CERT_CONTENT="-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----"

# Contenido de la clave privada .key de AFIP (formato PEM)
# Se genera junto con el certificado en AFIP
# Incluir todo el contenido del archivo .key incluyendo las líneas:
# -----BEGIN PRIVATE KEY-----
# ...
# -----END PRIVATE KEY-----
AFIP_KEY_CONTENT="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
```

### Variables Opcionales (Recomendadas)

```bash
# Punto de venta por defecto (4 dígitos)
# Se puede sobrescribir por factura, pero este será el valor por defecto
AFIP_DEFAULT_PTO_VTA=1

# Razón social de la empresa emisora (para PDFs)
# Ejemplo: "Mi Empresa S.A."
AFIP_NAME="Mi Empresa S.A."

# Domicilio fiscal completo de la empresa emisora (para PDFs)
# Ejemplo: "Av. Corrientes 1234, CABA, CP 1043"
AFIP_ADDRESS="Av. Corrientes 1234, CABA, CP 1043"

# Ingresos Brutos de la empresa emisora (para PDFs)
# Ejemplo: "20-12345678-9" o "12345678-9"
AFIP_GROSS_INCOME="20-12345678-9"

# Condición IVA del emisor (para PDFs)
# Valores posibles: ResponsableInscripto, Monotributo, Exento, ConsumidorFinal, NoResponsable
AFIP_IVA_CONDITION=ResponsableInscripto
```

## Configuración Inicial

### 1. Obtener Certificados de AFIP

1. Ingresar a [AFIP - Servicios Web](https://www.afip.gob.ar/fe/ayuda/documentos/ws-aa-datos-basicos.pdf)
2. Generar el certificado y clave privada
3. Descargar los archivos `.crt` y `.key`
4. Copiar el contenido completo de cada archivo a las variables `AFIP_CERT_CONTENT` y `AFIP_KEY_CONTENT`

### 2. Configurar CUIT

- El CUIT debe ser el de la empresa que emite las facturas
- Puede incluirse con o sin guiones (el sistema lo normaliza automáticamente)
- Formato esperado: `XX-XXXXXXXX-X` o `XXXXXXXXXXX`

### 3. Modo Homologación vs Producción

- **Homologación (`AFIP_PRODUCTION=false`)**: Para pruebas y desarrollo
- **Producción (`AFIP_PRODUCTION=true`)**: Para uso real con clientes

⚠️ **IMPORTANTE**: En producción, asegurarse de usar certificados válidos y el CUIT real de la empresa.

## Uso en el Código

El servicio `getAfipCompanyConfig()` centraliza el acceso a estas configuraciones:

```typescript
import { getAfipCompanyConfig } from '@/backend/services/afip/config';

const config = getAfipCompanyConfig();
console.log(config.cuit); // CUIT sin formato
console.log(config.cuitFormatted); // CUIT con formato XX-XXXXXXXX-X
console.log(config.production); // true/false
```

## Validaciones

El sistema valida automáticamente:

- ✅ Presencia de `AFIP_CUIT` (obligatorio)
- ✅ Presencia de certificados en modo producción
- ✅ Formato del CUIT
- ✅ Valores válidos para condición IVA

## Compatibilidad con Vercel (Serverless)

El sistema está diseñado para funcionar en entornos serverless como Vercel:

### ✅ Funcionalidades Compatibles

- **Escritura en `/tmp`**: Vercel permite escribir archivos temporales en `/tmp`
- **Archivos efímeros**: Los certificados se escriben bajo demanda cuando se necesita la instancia de AFIP
- **Recreación automática**: Si la función serverless se reinicia, los archivos se recrean automáticamente

### ⚠️ Limitaciones de Vercel Free Tier

- **`/tmp` es efímero**: Se limpia entre invocaciones de funciones serverless
- **Límite de 512MB**: El directorio `/tmp` tiene un límite de tamaño
- **Sin persistencia**: Los archivos no persisten entre reinicios de la función

### 🔧 Cómo Funciona

1. **Lazy Loading**: La instancia de AFIP se crea solo cuando se necesita (no al inicio del módulo)
2. **Verificación de archivos**: Antes de usar la instancia, se verifica que los archivos existan
3. **Recreación automática**: Si los archivos desaparecen (p.ej., función reiniciada), se recrean automáticamente
4. **Reutilización**: Si la función está "caliente" y los archivos existen, se reutiliza la instancia

### 📝 Notas Importantes

- Los certificados se escriben desde las variables de entorno cada vez que se necesita la instancia
- Esto asegura que funcionen incluso si la función serverless se reinicia
- El overhead de escribir archivos es mínimo comparado con las llamadas a la API de AFIP

## Troubleshooting

### Error: "AFIP_CUIT no está configurado"

- Verificar que la variable de entorno esté definida
- Verificar que el archivo `.env` esté siendo cargado correctamente
- En Vercel, verificar que las variables de entorno estén configuradas en el dashboard

### Error: "AFIP_CERT_CONTENT no está configurado"

- Solo ocurre en modo producción
- Verificar que el contenido del certificado esté completo (incluyendo líneas BEGIN/END)
- En Vercel, asegurarse de que las variables de entorno estén configuradas correctamente

### Error: "No se pueden escribir archivos en /tmp"

- En Vercel, esto no debería ocurrir ya que `/tmp` es escribible
- Verificar que no se haya alcanzado el límite de 512MB en `/tmp`
- Verificar permisos del sistema (aunque en Vercel esto está gestionado automáticamente)

### Las facturas no se emiten correctamente

- Verificar que los certificados sean válidos y no estén vencidos
- Verificar que el CUIT coincida con el del certificado
- En modo homologación, usar el ambiente de testing de AFIP
