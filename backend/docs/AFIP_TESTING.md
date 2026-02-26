# Guía de Pruebas AFIP - Ambiente de Homologación

Este documento describe cómo realizar pruebas con AFIP antes de pasar a producción usando el ambiente de homologación.

## Configuración para Homologación

### ⚠️ Importante: Certificados Siempre Requeridos

**El SDK `@afipsdk/afip.js` SIEMPRE requiere certificados**, incluso para pruebas. No es posible usar el CUIT genérico sin certificados de homologación.

### Variables de Entorno Necesarias

```bash
# CUIT de prueba (puede ser el genérico 20409378472 o tu CUIT de homologación)
# NOTA: Aunque uses el CUIT genérico, aún necesitas certificados de homologación
AFIP_CUIT=20409378472

# IMPORTANTE: Debe estar en false para homologación
AFIP_PRODUCTION=false

# Certificados de homologación (obtenidos desde AFIP)
# Estos son OBLIGATORIOS incluso para pruebas con CUIT genérico
AFIP_CERT_CONTENT="-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----"

AFIP_KEY_CONTENT="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----"
```

### ¿Por qué se necesitan certificados?

El SDK `@afipsdk/afip.js` utiliza los certificados para:

- Firmar digitalmente las peticiones SOAP a los servicios web de AFIP
- Autenticar la identidad del emisor
- Establecer la conexión segura con los servidores de AFIP

**Sin certificados, el SDK no puede comunicarse con AFIP**, incluso en homologación.

### Alternativas sin Certificados

Si necesitas hacer pruebas sin certificados, las opciones son:

1. **Usar un servicio intermediario** (como afipsdk.com) que maneja los certificados por ti
    - Requiere registro y posiblemente pago
    - No es el SDK directo de AFIP

2. **Obtener certificados de homologación** (recomendado)
    - Son gratuitos
    - Se obtienen desde el sitio de AFIP
    - Permiten pruebas completas del flujo real

## Pruebas Disponibles en Homologación

### ✅ 1. Emisión de Comprobantes (createVoucher)

**Qué probar:**

- Emisión de diferentes tipos de comprobantes (Factura A, B, C, etc.)
- Validación de datos requeridos
- Manejo de errores y observaciones
- Generación de CAE (aunque sea de prueba)

**Ejemplo de prueba:**

```typescript
// Probar emisión de Factura A
const result = await AfipService.createVoucher({
    ptoVta: 1,
    cbteTipo: AFIP_CBTE_TIPO.FACTURA_A,
    data: {
        Concepto: AFIP_CONCEPTO.SERVICIOS,
        DocTipo: AFIP_DOC_TIPO.CUIT,
        DocNro: 20123456789,
        CbteDesde: 1,
        CbteHasta: 1,
        CbteFch: '20250101',
        ImpTotal: 121.0,
        ImpNeto: 100.0,
        ImpIVA: 21.0,
        ImpOpEx: 0,
        ImpTotConc: 0,
        ImpTrib: 0,
        FchServDesde: '20250101',
        FchServHasta: '20250131',
        FchVtoPago: '20250215',
        Iva: [
            {
                Id: AFIP_ALICUOTA_IVA.VEINTIUNO,
                BaseImp: 100.0,
                Importe: 21.0,
            },
        ],
    },
});
```

**Qué verificar:**

- ✅ `result.CAE` existe y es un número válido
- ✅ `result.CAEFchVto` es una fecha válida
- ✅ `result.Resultado === 'A'` (Autorizado)
- ✅ No hay errores en `result.Errors`
- ⚠️ Las observaciones pueden aparecer pero no son críticas en homologación

### ✅ 2. Consulta de Último Comprobante (getLastVoucherNumber)

**Qué probar:**

- Obtener el último número de comprobante autorizado
- Verificar que el número sea correcto para continuar la numeración

**Ejemplo de prueba:**

```typescript
const lastNumber = await AfipService.getLastVoucherNumber({
    ptoVta: 1,
    cbteTipo: AFIP_CBTE_TIPO.FACTURA_A,
});
```

**Qué verificar:**

- ✅ Retorna un número válido (puede ser 0 si es el primer comprobante)
- ✅ El número es consistente con los comprobantes emitidos

### ✅ 3. Consulta de Información de Comprobante (getVoucherInfo)

**Qué probar:**

- Consultar un comprobante previamente emitido
- Verificar que los datos coincidan con lo emitido

**Ejemplo de prueba:**

```typescript
const voucherInfo = await AfipService.getVoucherInfo({
    ptoVta: 1,
    cbteTipo: AFIP_CBTE_TIPO.FACTURA_A,
    nroCbte: 1,
});
```

**Qué verificar:**

- ✅ Retorna información del comprobante
- ✅ Los datos coinciden con lo emitido (importes, fechas, etc.)
- ✅ `CodAutorizacion` coincide con el CAE emitido

### ✅ 4. Consulta de Puntos de Venta (getSalesPoints)

**Qué probar:**

- Obtener lista de puntos de venta habilitados
- Verificar estado (bloqueados, activos)

**Ejemplo de prueba:**

```typescript
const salesPoints = await AfipService.getSalesPoints();
```

**Qué verificar:**

- ✅ Retorna array de puntos de venta
- ✅ Cada punto tiene `Nro`, `EmisionTipo`, `Bloqueado`, `FchBaja`
- ✅ Los puntos bloqueados están marcados correctamente

### ✅ 5. Validación de CUIT (validateCUIT)

**Qué probar:**

- Validar CUITs de clientes
- Verificar datos del contribuyente

**Ejemplo de prueba:**

```typescript
const taxpayerData = await AfipService.validateCUIT('20-12345678-9');
```

**Qué verificar:**

- ✅ Retorna datos del contribuyente si existe
- ⚠️ En homologación, algunos CUITs pueden no estar disponibles
- ⚠️ Puede retornar `null` o error para CUITs de prueba

### ✅ 6. Generación de QR (generateBillQR)

**Qué probar:**

- Generar QR legal para comprobantes
- Verificar formato y URL de AFIP

**Ejemplo de prueba:**

```typescript
const qr = await AfipService.generateBillQR({
    ver: 1,
    fecha: '2025-01-01',
    cuit: 20123456789,
    ptoVta: 1,
    tipoCmp: 1,
    nroCmp: 1,
    importe: 121.0,
    moneda: 'PES',
    ctz: 1,
    tipoDocRec: 80,
    nroDocRec: 20123456789,
    tipoCodAut: 'E',
    codAut: 12345678901234,
});
```

**Qué verificar:**

- ✅ `qr.qrPng` es una imagen en base64 válida
- ✅ `qr.url` apunta a `https://www.afip.gob.ar/fe/qr/`
- ✅ El QR es escaneable y muestra los datos correctos

## Escenarios de Prueba Recomendados

### Escenario 1: Flujo Completo de Facturación

1. **Obtener último número de comprobante**

    ```typescript
    const lastNumber = await AfipService.getLastVoucherNumber({...});
    ```

2. **Emitir comprobante**

    ```typescript
    const result = await AfipService.createVoucher({
        CbteDesde: lastNumber + 1,
        CbteHasta: lastNumber + 1,
        ...
    });
    ```

3. **Generar QR**

    ```typescript
    const qr = await AfipService.generateBillQR({...});
    ```

4. **Consultar comprobante emitido**
    ```typescript
    const info = await AfipService.getVoucherInfo({
        nroCbte: lastNumber + 1,
        ...
    });
    ```

### Escenario 2: Manejo de Errores

**Probar con datos inválidos:**

- CUIT inválido
- Importes negativos
- Fechas inválidas
- Tipos de comprobante incorrectos
- Puntos de venta bloqueados

**Qué verificar:**

- ✅ Los errores se manejan correctamente
- ✅ Los mensajes de error son claros
- ✅ No se emiten comprobantes inválidos

### Escenario 3: Diferentes Tipos de Comprobante

Probar emisión de:

- Factura A (con IVA discriminado)
- Factura B (sin IVA discriminado)
- Factura C (sin IVA)
- Notas de Débito
- Notas de Crédito

**Qué verificar:**

- ✅ Cada tipo se emite correctamente
- ✅ Los campos requeridos son diferentes según el tipo
- ✅ El CAE se genera para todos los tipos

### Escenario 4: Diferentes Conceptos

Probar con:

- Concepto 1: Productos
- Concepto 2: Servicios
- Concepto 3: Productos y Servicios

**Qué verificar:**

- ✅ Las fechas de servicio se requieren para Concepto 2 y 3
- ✅ Los datos se validan correctamente según el concepto

## Limitaciones del Ambiente de Homologación

### ⚠️ Limitaciones Conocidas

1. **CUITs de Prueba:**
    - No todos los CUITs están disponibles en homologación
    - Algunas consultas pueden retornar `null` o errores

2. **Datos de Prueba:**
    - Los CAE emitidos son de prueba y no tienen validez fiscal
    - Los comprobantes no aparecen en sistemas reales

3. **Disponibilidad:**
    - El ambiente de homologación puede tener mantenimientos
    - Puede ser más lento que producción

4. **Certificados:**
    - Los certificados de homologación son diferentes a los de producción
    - Deben obtenerse desde el sitio de AFIP para homologación

## Checklist de Pruebas Pre-Producción

Antes de pasar a producción, verificar:

- [ ] ✅ Emisión de todos los tipos de comprobantes que se usarán
- [ ] ✅ Manejo correcto de errores y validaciones
- [ ] ✅ Generación de QR funciona correctamente
- [ ] ✅ Consultas de comprobantes funcionan
- [ ] ✅ Validación de CUITs funciona
- [ ] ✅ Puntos de venta se consultan correctamente
- [ ] ✅ Los certificados de producción están configurados
- [ ] ✅ `AFIP_PRODUCTION=true` está configurado
- [ ] ✅ El CUIT de producción es el correcto
- [ ] ✅ Los certificados de producción no están vencidos

## Troubleshooting

### Error: "Certificado inválido"

- Verificar que los certificados sean de homologación (no de producción)
- Verificar que el contenido esté completo (incluyendo BEGIN/END)

### Error: "CUIT no válido"

- En homologación, usar CUIT de prueba: `20409378472`
- Verificar que el CUIT coincida con el del certificado

### Error: "Punto de venta bloqueado"

- Verificar que el punto de venta esté habilitado en AFIP
- En homologación, usar punto de venta 1 generalmente funciona

### Error: "Número de comprobante ya utilizado"

- Obtener el último número antes de emitir
- Verificar que el número sea consecutivo

## Recursos Adicionales

- [Documentación oficial de AFIP](https://www.afip.gob.ar/fe/ayuda/)
- [Documentación de afipsdk](https://docs.afipsdk.com/)
- [Sitio de AFIP para obtener certificados](https://www.afip.gob.ar/fe/)
