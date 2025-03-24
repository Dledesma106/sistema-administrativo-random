import Image from 'next/image';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Download, Eye, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Expense,
    ExpensePaySource,
    ExpensePaySourceBank,
    ExpenseType,
    GetTechniciansQuery,
} from '@/api/graphql';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2 } from '@/components/ui/typography';
import { toast } from '@/components/ui/use-toast';
import { useCreateExpense } from '@/hooks/api/expense/useCreateExpense';
import { useGenerateUploadUrls } from '@/hooks/api/file/useGenerateUploadUrls';
import { routesBuilder } from '@/lib/routes';
import { cn } from '@/lib/utils';

// Definición de las opciones para ciudades
const CITY_OPTIONS = [
    {
        label: 'Trelew',
        value: 'Trelew',
    },
    {
        label: 'Rawson',
        value: 'Rawson',
    },
    {
        label: 'Madryn',
        value: 'Madryn',
    },
    {
        label: 'Comodoro',
        value: 'Comodoro',
    },
    {
        label: 'Esquel',
        value: 'Esquel',
    },
    {
        label: 'Otro',
        value: 'Otro',
    },
];

interface CreateExpenseFormProps {
    taskId?: string;
    techs: NonNullable<GetTechniciansQuery['technicians']>;
}

interface ExpenseFormValues {
    amount: number;
    expenseType: ExpenseType;
    paySource: ExpensePaySource;
    paySourceBank?: ExpensePaySourceBank;
    installments?: number;
    expenseDate: Date;
    doneBy: string;
    customDoneBy?: string;
    cityName: string;
    customCityName?: string;
    observations?: string;
    fileKeys: string[];
    filenames: string[];
    mimeTypes: string[];
    sizes: number[];
}

// Función para formatear número como moneda argentina (punto para miles, coma para decimales)
const formatCurrency = (value: string): string => {
    if (!value) {
        return '';
    }

    // Eliminar puntos y reemplazar coma por punto para convertir a número
    const numericValue = value.replace(/\./g, '').replace(',', '.');

    // Convertir a número y limitar a 2 decimales
    const number = parseFloat(numericValue);
    if (isNaN(number)) {
        return '';
    }

    // Formatear con separador de miles y decimales
    const parts = number.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Devolver con coma como separador decimal
    return parts.join(',');
};

// Función para convertir valor con formato de moneda argentina a número decimal
const currencyToNumber = (value: string): number => {
    if (!value) {
        return 0;
    }
    // Eliminar puntos y reemplazar coma por punto para convertir a número
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

// Función para formatear fechas
const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) {
        return 'N/A';
    }
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export default function CreateExpenseForm({ taskId, techs }: CreateExpenseFormProps) {
    const router = useRouter();
    const createExpenseMutation = useCreateExpense();
    const generateUploadUrlsMutation = useGenerateUploadUrls();
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<
        {
            key: string;
            filename: string;
            mimeType: string;
            size: number;
        }[]
    >([]);

    const form = useForm<ExpenseFormValues>({
        defaultValues: {
            amount: 0,
            installments: 1,
            expenseDate: new Date(),
            fileKeys: [],
            filenames: [],
            mimeTypes: [],
            sizes: [],
        },
    });

    // Estado local para manejar los valores de los campos numéricos como string
    const [amountInputValue, setAmountInputValue] = useState('0');
    const [installmentsInputValue, setInstallmentsInputValue] = useState('1');

    const watchPaySource = form.watch('paySource');
    const watchDoneBy = form.watch('doneBy');
    const watchCityName = form.watch('cityName');

    // Función para manejar la subida de archivos
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        // Verificar que no se exceda el límite de 5 archivos
        if (files.length + event.target.files.length > 5) {
            toast({
                description: 'No se pueden adjuntar más de 5 archivos en total',
                variant: 'destructive',
                duration: 5000,
            });
            return;
        }

        try {
            // Guardar referencia a los archivos seleccionados
            const newFiles = Array.from(event.target.files);

            // Mostrar toast de carga
            toast({
                description: 'Preparando archivos...',
                duration: 3000,
            });

            // Generar prefijo único para los archivos
            const prefix = taskId ? `expenses/${taskId}` : 'expenses/no-task';

            // Obtener URLs presignadas para subida
            const result = await generateUploadUrlsMutation.mutateAsync({
                fileCount: newFiles.length,
                prefix,
                mimeTypes: newFiles.map((file) => file.type),
            });

            if (!result.generateUploadUrls.success) {
                console.log(result.generateUploadUrls.message);
                throw new Error(
                    result.generateUploadUrls.message ||
                        'Error al generar URLs para subida',
                );
            }

            // Mostrar toast de carga para la subida
            toast({
                description: 'Subiendo archivos...',
                duration: 5000,
            });

            // Subir los archivos mediante nuestro endpoint de proxy
            const uploadPromises = newFiles.map(async (file, index) => {
                const { key } = result.generateUploadUrls.uploadUrls[index];

                // Convertir archivo a Base64
                const reader = new FileReader();
                const fileBase64Promise = new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                const fileBase64 = await fileBase64Promise;

                // Enviar al endpoint de proxy
                const uploadResponse = await fetch('/api/upload-file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file: fileBase64,
                        contentType: file.type,
                        key: key,
                    }),
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(
                        `Error al subir el archivo ${file.name}: ${errorData.error || uploadResponse.statusText}`,
                    );
                }

                return {
                    key,
                    filename: file.name,
                    mimeType: file.type,
                    size: file.size,
                };
            });

            // Esperar a que todas las subidas se completen
            const fileInfo = await Promise.all(uploadPromises);

            // Actualizar UI
            setFiles([...files, ...newFiles]);

            // Actualizar el formulario con las claves de los archivos
            form.setValue('fileKeys', [
                ...form.getValues('fileKeys'),
                ...fileInfo.map((f) => f.key),
            ]);
            form.setValue('filenames', [
                ...form.getValues('filenames'),
                ...fileInfo.map((f) => f.filename),
            ]);
            form.setValue('mimeTypes', [
                ...form.getValues('mimeTypes'),
                ...fileInfo.map((f) => f.mimeType),
            ]);
            form.setValue('sizes', [
                ...form.getValues('sizes'),
                ...fileInfo.map((f) => f.size),
            ]);

            // También guardar la información para uso posterior
            setUploadedFiles([...uploadedFiles, ...fileInfo]);

            // Notificar éxito
            toast({
                description: `${newFiles.length} ${newFiles.length === 1 ? 'archivo subido' : 'archivos subidos'} exitosamente.`,
                variant: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error al subir archivos:', error);
            toast({
                description: `Error al subir los archivos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                variant: 'destructive',
                duration: 5000,
            });
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles.splice(index, 1);
        setUploadedFiles(newUploadedFiles);

        // Actualizamos los valores del formulario
        form.setValue(
            'fileKeys',
            form.getValues('fileKeys').filter((_, i) => i !== index),
        );
        form.setValue(
            'filenames',
            form.getValues('filenames').filter((_, i) => i !== index),
        );
        form.setValue(
            'mimeTypes',
            form.getValues('mimeTypes').filter((_, i) => i !== index),
        );
        form.setValue(
            'sizes',
            form.getValues('sizes').filter((_, i) => i !== index),
        );
    };

    const onSubmit = async (values: ExpenseFormValues) => {
        try {
            // Determinar el valor final de doneBy
            const finalDoneBy =
                values.doneBy === 'Otro'
                    ? values.customDoneBy || 'Otro'
                    : techs.find((tech) => tech.id === values.doneBy)?.fullName ||
                      values.doneBy;

            // Determinar el valor final de cityName
            const finalCityName =
                values.cityName === 'Otro'
                    ? values.customCityName || 'Otro'
                    : values.cityName;

            // Si no hay archivos seleccionados, mostrar error
            if (files.length === 0) {
                toast({
                    title: 'Error',
                    description: 'Debe adjuntar al menos un archivo',
                    variant: 'destructive',
                    duration: 5000,
                });
                return;
            }

            // Mostrar toast de carga para archivos
            toast({
                description: 'Subiendo archivos...',
                duration: 5000,
            });

            try {
                // Generar prefijo para los archivos temporales - usaremos un timestamp
                const timestamp = new Date().getTime();
                // Usar el taskId si está disponible, o un prefijo temporal
                const prefix = taskId
                    ? `expenses/${taskId}/temp_${timestamp}`
                    : `expenses/no-task/temp_${timestamp}`;

                // Obtener URLs presignadas para subida
                const urlsResult = await generateUploadUrlsMutation.mutateAsync({
                    fileCount: files.length,
                    prefix,
                    mimeTypes: files.map((file) => file.type),
                });

                if (!urlsResult.generateUploadUrls.success) {
                    throw new Error(
                        urlsResult.generateUploadUrls.message ||
                            'Error al generar URLs para subida de archivos',
                    );
                }

                // Subir los archivos a S3 usando nuestro endpoint de proxy
                const uploadPromises = files.map(async (file, index) => {
                    const { key } = urlsResult.generateUploadUrls.uploadUrls[index];

                    // Convertir archivo a Base64
                    const reader = new FileReader();
                    const fileBase64Promise = new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });

                    const fileBase64 = await fileBase64Promise;

                    // Enviar al endpoint de proxy
                    const uploadResponse = await fetch('/api/upload-file', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            file: fileBase64,
                            contentType: file.type,
                            key: key,
                        }),
                    });

                    if (!uploadResponse.ok) {
                        const errorData = await uploadResponse.json();
                        throw new Error(
                            `Error al subir el archivo ${file.name}: ${errorData.error || uploadResponse.statusText}`,
                        );
                    }

                    return {
                        key,
                        filename: file.name,
                        mimeType: file.type,
                        size: file.size,
                    };
                });

                // Esperar a que todas las subidas se completen
                const fileInfo = await Promise.all(uploadPromises);

                // Mostrar toast de carga para la creación del gasto
                toast({
                    description: 'Creando gasto...',
                    duration: 3000,
                });

                // Ahora creamos el gasto con las claves de archivos ya subidos
                const result = await createExpenseMutation.mutateAsync({
                    taskId,
                    expenseData: {
                        amount: values.amount,
                        expenseType: values.expenseType,
                        paySource: values.paySource,
                        paySourceBank:
                            values.paySource === ExpensePaySource.Credito ||
                            values.paySource === ExpensePaySource.Debito
                                ? values.paySourceBank || null
                                : null,
                        installments: values.installments || 1,
                        expenseDate: values.expenseDate,
                        doneBy: finalDoneBy,
                        cityName: finalCityName,
                        observations: values.observations || null,
                        // Enviamos los arrays con la información de los archivos ya subidos
                        fileKeys: fileInfo.map((f) => f.key),
                        filenames: fileInfo.map((f) => f.filename),
                        mimeTypes: fileInfo.map((f) => f.mimeType),
                        sizes: fileInfo.map((f) => f.size),
                        imageKeys: [], // No tenemos imágenes específicas, todo va como archivo
                    },
                });

                if (
                    !result?.createExpense?.success ||
                    !result.createExpense.expense?.id
                ) {
                    throw new Error(
                        result?.createExpense?.message || 'Error al crear el gasto',
                    );
                }

                // Mostrar toast de éxito
                toast({
                    title: '¡Gasto creado exitosamente!',
                    description: `El gasto #${result.createExpense.expense?.expenseNumber} ha sido registrado correctamente con ${fileInfo.length} archivos adjuntos.`,
                    variant: 'success',
                    duration: 5000,
                });

                // Redirigir después de un breve delay para que el usuario vea el mensaje
                setTimeout(() => {
                    if (taskId) {
                        router.push(routesBuilder.tasks.details(taskId));
                    } else {
                        router.push(routesBuilder.accounting.expenses.list());
                    }
                }, 1000);
            } catch (error) {
                console.error('Error al procesar la solicitud:', error);

                // Mostrar toast de error
                toast({
                    title: 'Error inesperado',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'Ocurrió un error al procesar su solicitud. Por favor intente nuevamente.',
                    variant: 'destructive',
                    duration: 5000,
                });
            }
        } catch (error) {
            // Error en la validación o preparación de datos
            console.error('Error al preparar datos:', error);

            // Mostrar toast de error
            toast({
                title: 'Error de validación',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error al validar los datos. Por favor revise el formulario e intente nuevamente.',
                variant: 'destructive',
                duration: 5000,
            });
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>Crear Gasto</h1>
            </TypographyH2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Monto */}
                        <FormField
                            name="amount"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                                min: {
                                    value: 1,
                                    message: 'El monto debe ser mayor a 0',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monto</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                type="text"
                                                placeholder="0"
                                                value={amountInputValue}
                                                className="pl-7"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Permitir solo números, puntos y una única coma
                                                    if (
                                                        /^$|^[0-9.]*,?[0-9]*$/.test(value)
                                                    ) {
                                                        setAmountInputValue(value);
                                                        // Convertir valor con formato a número para el formulario
                                                        field.onChange(
                                                            currencyToNumber(value),
                                                        );
                                                    }
                                                }}
                                                onFocus={(e) => e.target.select()}
                                                onBlur={() => {
                                                    // Si el campo está vacío al perder el foco, mostrar 0
                                                    if (amountInputValue === '') {
                                                        setAmountInputValue('0');
                                                        field.onChange(0);
                                                    } else {
                                                        // Formatear el valor como moneda al perder el foco
                                                        const formattedValue =
                                                            formatCurrency(
                                                                amountInputValue,
                                                            );
                                                        setAmountInputValue(
                                                            formattedValue,
                                                        );
                                                        field.onChange(
                                                            currencyToNumber(
                                                                formattedValue,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tipo de gasto */}
                        <FormField
                            name="expenseType"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de gasto</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione un tipo"
                                            searchPlaceholder="Buscar tipo de gasto"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={Object.values(ExpenseType).map(
                                                (type) => ({
                                                    label: type,
                                                    value: type,
                                                }),
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Fuente de pago */}
                        <FormField
                            name="paySource"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fuente de pago</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una fuente"
                                            searchPlaceholder="Buscar fuente de pago"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={Object.values(ExpensePaySource).map(
                                                (source) => ({
                                                    label: source,
                                                    value: source,
                                                }),
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Banco emisor (condicional) */}
                        {(watchPaySource === ExpensePaySource.Credito ||
                            watchPaySource === ExpensePaySource.Debito) && (
                            <FormField
                                name="paySourceBank"
                                control={form.control}
                                rules={{
                                    required: 'Este campo es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Banco emisor</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                selectPlaceholder="Seleccione un banco"
                                                searchPlaceholder="Buscar banco"
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                items={Object.values(
                                                    ExpensePaySourceBank,
                                                ).map((bank) => ({
                                                    label: bank,
                                                    value: bank,
                                                }))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Cuotas (condicional) */}
                        {watchPaySource === ExpensePaySource.Credito && (
                            <FormField
                                name="installments"
                                control={form.control}
                                rules={{
                                    required: 'Este campo es requerido',
                                    min: {
                                        value: 1,
                                        message: 'Las cuotas deben ser al menos 1',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cuotas</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={installmentsInputValue}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^$|^[0-9]*$/.test(value)) {
                                                        setInstallmentsInputValue(value);
                                                        field.onChange(
                                                            value === ''
                                                                ? 1
                                                                : Number(value),
                                                        );
                                                    }
                                                }}
                                                onFocus={(e) => e.target.select()}
                                                onBlur={() => {
                                                    // Si el campo está vacío o es menor que 1 al perder el foco, mostrar 1
                                                    if (
                                                        installmentsInputValue === '' ||
                                                        Number(installmentsInputValue) < 1
                                                    ) {
                                                        setInstallmentsInputValue('1');
                                                        field.onChange(1);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Fecha de pago */}
                        <FormField
                            name="expenseDate"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de pago</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value &&
                                                            'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            'dd/MM/yyyy',
                                                            { locale: es },
                                                        )
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="size-4 ml-auto opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Pagado por */}
                        <FormField
                            name="doneBy"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pagado por</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione quién pagó"
                                            searchPlaceholder="Buscar"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={[
                                                ...techs.map((tech) => ({
                                                    label: tech.fullName,
                                                    value: tech.id,
                                                })),
                                                {
                                                    label: 'Otro',
                                                    value: 'Otro',
                                                },
                                            ]}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo personalizado para "Pagado por" */}
                        {watchDoneBy === 'Otro' && (
                            <FormField
                                name="customDoneBy"
                                control={form.control}
                                rules={{
                                    required: 'Este campo es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de quien pagó</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Ciudad */}
                        <FormField
                            name="cityName"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una ciudad"
                                            searchPlaceholder="Buscar ciudad"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={CITY_OPTIONS}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo personalizado para "Ciudad" */}
                        {watchCityName === 'Otro' && (
                            <FormField
                                name="customCityName"
                                control={form.control}
                                rules={{
                                    required: 'Este campo es requerido',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de la ciudad</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre de la ciudad"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    {/* Observaciones */}
                    <FormField
                        name="observations"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ingrese observaciones (opcional)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Archivos */}
                    <div className="space-y-2">
                        <FormLabel>Archivos (máximo 5)</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center rounded-md border border-accent bg-background p-2"
                                >
                                    <span className="max-w-32 mr-2 truncate">
                                        {file.name}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                            {files.length < 5 && (
                                <label className="flex cursor-pointer items-center rounded-md border border-dashed border-accent bg-background p-2 hover:bg-accent/10">
                                    <PlusCircle className="size-4 mr-2" />
                                    <span>Añadir imagen</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Se requiere al menos una imagen. Formatos aceptados: JPG, PNG,
                            GIF, etc.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (taskId) {
                                    router.push(routesBuilder.tasks.details(taskId));
                                } else {
                                    router.push(routesBuilder.accounting.expenses.list());
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                createExpenseMutation.isPending || files.length === 0
                            }
                        >
                            {createExpenseMutation.isPending
                                ? 'Creando...'
                                : 'Crear Gasto'}
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}

type ExpenseDetailProps = {
    expense: Expense;
    taskId?: string;
};

export const ExpenseDetail = ({ expense, taskId }: ExpenseDetailProps) => {
    const router = useRouter();

    // Combinar imágenes y archivos en una sola lista
    const files = [
        ...(expense.images || []).map((image) => ({
            url: image.url,
            key: image.key,
            filename: `Imagen ${image.id.substring(0, 6)}`,
            mimeType: 'image/jpeg',
            id: image.id,
        })),
        ...(expense.files || []).map((file) => ({
            url: file.url,
            key: file.key,
            filename: file.filename || `Imagen`,
            mimeType: file.mimeType || 'image/jpeg',
            id: file.id,
        })),
    ];

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        Gasto #{expense.expenseNumber} -{' '}
                        {formatCurrency(String(expense.amount || 0))}
                    </CardTitle>
                    {taskId && (
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            Volver a la tarea
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Tipo:
                        </h4>
                        <p>{expense.expenseType}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Forma de pago:
                        </h4>
                        <p>{expense.paySource}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Ciudad:
                        </h4>
                        <p>{expense.cityName}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Pagado por:
                        </h4>
                        <p>{expense.doneBy}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Fecha:
                        </h4>
                        <p>{formatDate(expense.expenseDate)}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">
                            Estado:
                        </h4>
                        <p>{expense.status}</p>
                    </div>
                    {expense.observations && (
                        <div className="col-span-2 md:col-span-4">
                            <h4 className="text-sm font-semibold text-muted-foreground">
                                Observaciones:
                            </h4>
                            <p className="whitespace-pre-line">{expense.observations}</p>
                        </div>
                    )}
                </div>

                {files.length > 0 && (
                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                            Imágenes adjuntas:
                        </h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {files.map((file, index) => (
                                <div key={index} className="group">
                                    <div className="relative aspect-square overflow-hidden rounded-md border border-accent">
                                        <Image
                                            src={file.url}
                                            alt={file.filename}
                                            fill
                                            className="object-contain transition-all duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                                            <div className="flex gap-2">
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-full bg-white p-2 text-black transition-transform hover:scale-110"
                                                >
                                                    <Eye size={16} />
                                                </a>
                                                <a
                                                    href={file.url}
                                                    download={file.filename}
                                                    className="rounded-full bg-white p-2 text-black transition-transform hover:scale-110"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-center text-xs text-muted-foreground">
                                        {file.filename}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
