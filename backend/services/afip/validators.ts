/**
 * Funciones de validación para datos de AFIP
 */

import { ComprobanteType, TipoDocumento } from '@prisma/client';

import { mapTipoDocumentoToAfip } from './mapper';
import { AFIP_DOC_TIPO } from './types';

// ============================================================================
// RESULTADO DE VALIDACIÓN
// ============================================================================
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// ============================================================================
// VALIDAR DÍGITO VERIFICADOR DE CUIT/CUIL
// ============================================================================
function validateCuitDigit(cuit: string): boolean {
    // Limpiar el CUIT de guiones y espacios
    const cleanedCuit = cuit.replace(/[-\s]/g, '');

    // El CUIT debe tener 11 dígitos
    if (!/^\d{11}$/.test(cleanedCuit)) {
        return false;
    }

    // Algoritmo de validación de CUIT/CUIL argentino
    // Los multiplicadores para cada posición
    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    // Calcular la suma de productos
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanedCuit[i], 10) * multipliers[i];
    }

    // Calcular el dígito verificador esperado
    const remainder = sum % 11;
    let expectedDigit: number;

    if (remainder === 0) {
        expectedDigit = 0;
    } else if (remainder === 1) {
        // Caso especial: el dígito verificador no puede ser 1
        // En este caso, el CUIT es inválido a menos que el prefijo sea 23 o 24
        // y se ajuste el dígito verificador
        expectedDigit = 9; // En algunos casos se usa 9
    } else {
        expectedDigit = 11 - remainder;
    }

    // Comparar con el dígito verificador real (última posición)
    const actualDigit = parseInt(cleanedCuit[10], 10);

    return expectedDigit === actualDigit;
}

// ============================================================================
// VALIDAR FORMATO DE DNI
// ============================================================================
function validateDNI(dni: string): boolean {
    // Limpiar el DNI de puntos y espacios
    const cleanedDNI = dni.replace(/[.\s]/g, '');

    // El DNI argentino tiene entre 7 y 8 dígitos
    if (!/^\d{7,8}$/.test(cleanedDNI)) {
        return false;
    }

    // Verificar que no sea un número obviamente inválido
    const numericValue = parseInt(cleanedDNI, 10);
    if (numericValue < 1000000 || numericValue > 99999999) {
        return false;
    }

    return true;
}

// ============================================================================
// VALIDAR TIPO Y NÚMERO DE DOCUMENTO
// ============================================================================
export function validateDocumento(
    tipoDocumento: TipoDocumento,
    numeroDocumento: string,
): ValidationResult {
    const errors: string[] = [];

    // Validar que el número no esté vacío
    if (!numeroDocumento || numeroDocumento.trim() === '') {
        errors.push('El número de documento es requerido');
        return {
            isValid: false,
            errors,
        };
    }

    const afipDocTipo = mapTipoDocumentoToAfip(tipoDocumento);

    switch (afipDocTipo) {
        case AFIP_DOC_TIPO.CUIT:
        case AFIP_DOC_TIPO.CUIL:
            // Validar formato básico
            const cleanedCuit = numeroDocumento.replace(/[-\s]/g, '');
            if (!/^\d{11}$/.test(cleanedCuit)) {
                errors.push(
                    `El ${tipoDocumento} debe tener 11 dígitos. Se encontraron ${cleanedCuit.length} dígitos.`,
                );
            } else if (!validateCuitDigit(numeroDocumento)) {
                errors.push(`El dígito verificador del ${tipoDocumento} es inválido`);
            }
            break;

        case AFIP_DOC_TIPO.DNI:
            if (!validateDNI(numeroDocumento)) {
                errors.push('El DNI debe tener entre 7 y 8 dígitos numéricos');
            }
            break;

        case AFIP_DOC_TIPO.CDI:
            // CDI (Clave de Identificación) debe tener 11 dígitos
            const cleanedCDI = numeroDocumento.replace(/[-\s]/g, '');
            if (!/^\d{11}$/.test(cleanedCDI)) {
                errors.push('El CDI debe tener 11 dígitos');
            }
            break;

        case AFIP_DOC_TIPO.PASAPORTE:
            // Pasaporte puede ser alfanumérico, mínimo 5 caracteres
            if (numeroDocumento.length < 5 || numeroDocumento.length > 20) {
                errors.push('El pasaporte debe tener entre 5 y 20 caracteres');
            }
            break;

        case AFIP_DOC_TIPO.SIN_IDENTIFICAR:
            // Consumidor final - no se requiere validación de número
            // El número debe ser 0
            break;

        default:
            // Para otros tipos, validar que tenga al menos algo
            if (numeroDocumento.length < 1) {
                errors.push('El número de documento debe tener al menos 1 caracter');
            }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// ============================================================================
// VALIDAR COHERENCIA ENTRE TIPO COMPROBANTE Y CONDICIÓN IVA
// ============================================================================

// Tipos de comprobante agrupados por letra
const COMPROBANTES_A = ['FacturaA', 'NotaDebitoA', 'NotaCreditoA'] as const;
const COMPROBANTES_B = ['FacturaB', 'NotaDebitoB', 'NotaCreditoB'] as const;
const COMPROBANTES_M = ['FacturaM', 'NotaDebitoM', 'NotaCreditoM'] as const;

export function validateComprobanteVsIVACondition(
    comprobanteType: ComprobanteType,
    ivaCondition: string,
): ValidationResult {
    const errors: string[] = [];

    // Comprobantes A: Solo para Responsables Inscriptos
    if ((COMPROBANTES_A as readonly string[]).includes(comprobanteType)) {
        if (ivaCondition !== 'ResponsableInscripto') {
            errors.push(
                'Los comprobantes tipo A solo pueden emitirse a receptores IVA Responsable Inscripto',
            );
        }
    }

    // Comprobantes B: Para Consumidores Finales, Exentos, Monotributo
    if ((COMPROBANTES_B as readonly string[]).includes(comprobanteType)) {
        const validConditions = [
            'ConsumidorFinal',
            'Exento',
            'Monotributo',
            'NoResponsable',
        ];
        if (!validConditions.includes(ivaCondition)) {
            errors.push(
                'Los comprobantes tipo B solo pueden emitirse a Consumidor Final, Exento, Monotributo o No Responsable',
            );
        }
    }

    // Comprobantes M: Similar a A pero para operaciones especiales
    if ((COMPROBANTES_M as readonly string[]).includes(comprobanteType)) {
        if (ivaCondition !== 'ResponsableInscripto') {
            errors.push(
                'Los comprobantes tipo M solo pueden emitirse a receptores IVA Responsable Inscripto',
            );
        }
    }

    // Comprobantes C: Emitidos por Monotributistas o Exentos
    // No hay restricción de receptor para comprobantes C

    // Comprobantes E: Para exportación
    // No se valida condición IVA ya que son para clientes del exterior

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// ============================================================================
// VALIDAR DATOS COMPLETOS DE FACTURA ANTES DE ENVIAR A AFIP
// ============================================================================
export interface BillValidationInput {
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    comprobanteType: ComprobanteType;
    ivaCondition: string;
    details: { quantity: number; unitPrice: number }[];
    concepto: 'productos' | 'servicios';
    serviceDate?: Date | null;
    startDate?: Date | null;
    endDate?: Date | null;
    dueDate?: Date | null;
    pointOfSale?: number | null;
}

export function validateBillForAfip(input: BillValidationInput): ValidationResult {
    const errors: string[] = [];

    // 1. Validar documento
    const docValidation = validateDocumento(input.tipoDocumento, input.numeroDocumento);
    if (!docValidation.isValid) {
        errors.push(...docValidation.errors);
    }

    // 2. Validar coherencia comprobante vs condición IVA
    const comprobanteValidation = validateComprobanteVsIVACondition(
        input.comprobanteType,
        input.ivaCondition,
    );
    if (!comprobanteValidation.isValid) {
        errors.push(...comprobanteValidation.errors);
    }

    // 3. Validar que haya al menos un detalle
    if (!input.details || input.details.length === 0) {
        errors.push('La factura debe tener al menos un item');
    } else {
        // Validar que los importes sean válidos
        for (let i = 0; i < input.details.length; i++) {
            const detail = input.details[i];
            if (detail.quantity <= 0) {
                errors.push(`El item ${i + 1} debe tener una cantidad mayor a 0`);
            }
            if (detail.unitPrice < 0) {
                errors.push(`El item ${i + 1} tiene un precio unitario negativo`);
            }
        }
    }

    // 4. Validar fechas de servicio si es necesario
    if (input.concepto === 'servicios') {
        if (!input.serviceDate && !input.startDate) {
            errors.push(
                'Para servicios, debe indicar la fecha del servicio o fecha de inicio',
            );
        }
        if (input.startDate && input.endDate && input.startDate > input.endDate) {
            errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
        }
    }

    // 5. Validar punto de venta
    if (input.pointOfSale !== undefined && input.pointOfSale !== null) {
        if (input.pointOfSale < 1 || input.pointOfSale > 99999) {
            errors.push('El punto de venta debe estar entre 1 y 99999');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// ============================================================================
// FORMATEAR CUIT PARA MOSTRAR (XX-XXXXXXXX-X)
// ============================================================================
export function formatCuitForDisplay(cuit: string): string {
    const cleaned = cuit.replace(/[-\s]/g, '');
    if (cleaned.length !== 11) {
        return cuit; // Devolver original si no tiene el formato esperado
    }
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
}

// ============================================================================
// LIMPIAR NÚMERO DE DOCUMENTO PARA ENVÍO A AFIP
// ============================================================================
export function cleanDocumentoForAfip(
    tipoDocumento: TipoDocumento,
    numeroDocumento: string,
): number {
    const afipDocTipo = mapTipoDocumentoToAfip(tipoDocumento);

    // Para consumidor final, el número es 0
    if (afipDocTipo === AFIP_DOC_TIPO.SIN_IDENTIFICAR) {
        return 0;
    }

    // Limpiar guiones, puntos y espacios
    const cleaned = numeroDocumento.replace(/[-.\s]/g, '');

    // Convertir a número
    const parsed = parseInt(cleaned, 10);

    return isNaN(parsed) ? 0 : parsed;
}
