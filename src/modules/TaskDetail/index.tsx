import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DownloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { expenseColumns } from './columns';

import { GetTaskQuery, TaskStatus, TaskType } from '@/api/graphql';
import Modal from '@/components/Modal';
import { Badge } from '@/components/ui/Badges/badge';
import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { TaskTypeBadge } from '@/components/ui/Badges/TaskTypeBadge';
import { Button } from '@/components/ui/button';
import { DataList } from '@/components/ui/data-list';
import { ImageViewer } from '@/components/ui/ImageViewer';
import { PDFViewer } from '@/components/ui/PDFViewer';
import { FormSkeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { TypographyH1 } from '@/components/ui/typography';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useFileUpload } from '@/hooks/api/file/useFileUpload';
import { useGetTask } from '@/hooks/api/tasks/useGetTask';
import { useRemoveTaskAttachment } from '@/hooks/api/tasks/useRemoveTaskAttachment';
import { useUpdateTaskAdministrative } from '@/hooks/api/tasks/useUpdateTaskAdministrative';
import { useUpdateTaskStatus } from '@/hooks/api/tasks/useUpdateTaskStatus';
import { routesBuilder } from '@/lib/routes';

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-bold">{children}</h2>
);

type Props = {
    task: NonNullable<GetTaskQuery['taskById']>;
};

const Content: React.FC<Props> = ({ task }) => {
    const { user } = useUserContext();
    const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
    const { mutateAsync: updateTaskAdministrative } = useUpdateTaskAdministrative();
    const { mutateAsync: removeTaskAttachment } = useRemoveTaskAttachment();
    const { files, isUploading, uploadFiles, addFiles, removeFile, clearFiles } =
        useFileUpload();
    const router = useRouter();

    const [administrativeNotes, setAdministrativeNotes] = useState<string>(
        task.administrativeNotes || '',
    );
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);

    const handleAdministrativeNotesUpdate = async () => {
        await updateTaskAdministrative({
            id: task.id,
            input: {
                administrativeNotes,
                fileKeys: [],
                filenames: [],
                mimeTypes: [],
                sizes: [],
            },
        });
        setIsEditingNotes(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const newFiles = Array.from(event.target.files);
        addFiles(newFiles);

        // Resetear el input para permitir seleccionar el mismo archivo
        event.target.value = '';
    };

    const handleSaveFiles = async () => {
        if (files.length === 0) {
            return;
        }
        try {
            const prefix = `tasks/${task.id}/administrative`;
            const fileInfo = await uploadFiles(files, prefix);

            await updateTaskAdministrative({
                id: task.id,
                input: {
                    administrativeNotes,
                    fileKeys: fileInfo.map((f) => f.key),
                    filenames: fileInfo.map((f) => f.filename),
                    mimeTypes: fileInfo.map((f) => f.mimeType),
                    sizes: fileInfo.map((f) => f.size),
                },
            });

            // Limpiar la lista de archivos después de subirlos exitosamente
            clearFiles();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error uploading files:', error);
        }
    };

    const handleRemoveAttachment = (fileKey: string) => {
        setFileToDelete(fileKey);
        setDeleteModal(true);
    };

    const confirmDeleteAttachment = async () => {
        if (!fileToDelete) {
            return;
        }

        try {
            await removeTaskAttachment({
                id: task.id,
                fileKey: fileToDelete,
            });
            setDeleteModal(false);
            setFileToDelete(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error removing attachment:', error);
        }
    };

    const link =
        task.taskType === TaskType.Preventivo
            ? routesBuilder.preventives.details(task.preventive?.id ?? '')
            : undefined;

    return (
        <main className="rounded-lg border border-accent bg-background-primary p-4">
            <div className="flex justify-between">
                <TypographyH1 className="mb-2">Tarea #{task.taskNumber}</TypographyH1>
                {user.roles.includes('AdministrativoTecnico') && (
                    <div className="flex gap-2">
                        {task.status !== TaskStatus.Aprobada && (
                            <Button asChild>
                                <Link href={routesBuilder.tasks.edit(task.id)}>
                                    Editar
                                </Link>
                            </Button>
                        )}
                        {task.status === TaskStatus.Finalizada && (
                            <Button
                                onClick={() =>
                                    updateTaskStatus({
                                        id: task.id,
                                        status: TaskStatus.Aprobada,
                                    })
                                }
                            >
                                Aprobar Tarea
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <p className="text-muted-foreground">{task.description}</p>

            <div className="space-y-4 pt-4">
                <div>
                    <Title>Fecha de creación</Title>
                    {format(task.createdAt, 'dd/MM/yyyy')}
                </div>

                <div>
                    <Title>Fecha de inicio</Title>
                    {task.startedAt ? format(task.startedAt, 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>

                <div>
                    <Title>Fecha de cierre</Title>
                    {task.closedAt ? format(task.closedAt, 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>

                <div>
                    <Title>Estado</Title>
                    <TaskStatusBadge status={task.status} />
                </div>

                <div>
                    <Title>Tipo de tarea</Title>
                    <TaskTypeBadge
                        type={task.taskType}
                        link={link}
                        frequency={task.preventive?.frequency ?? undefined}
                    />
                </div>

                {task.branch ? (
                    <div>
                        <Title>Sucursal</Title>

                        <p className="mb-1">
                            {task.branch.number && `#${task.branch.number}`}
                            {task.branch.name && task.branch.number && ' - '}
                            {task.branch.name && task.branch.name} -{' '}
                            {task.branch.city.name} - {task.branch.city.province.name}
                        </p>
                    </div>
                ) : (
                    <div>
                        <Title>Cliente y Empresa</Title>
                        <p className="mb-1">
                            {task.clientName}
                            {task.businessName && ` - ${task.businessName}`}
                        </p>
                    </div>
                )}

                {task.business?.name === 'GIASA' && (
                    <div>
                        <Title>Número de Ticket Movitec</Title>
                        <p className="mb-1">{task.movitecTicket}</p>
                    </div>
                )}

                <section>
                    <h2 className="mb-4 text-sm font-bold">Participantes</h2>
                    {task.participants && task.participants.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {task.participants.map((participant, index) => (
                                <Badge
                                    key={`${participant}-${index}`}
                                    variant="default"
                                    className="whitespace-nowrap"
                                >
                                    {participant}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No hay participantes</p>
                    )}
                </section>

                <div>
                    <Title>Numero de OT</Title>
                    <p className="mb-1">{task.actNumber}</p>
                </div>

                {task.status === TaskStatus.Finalizada && (
                    <div>
                        <Title>Se usaron materiales?</Title>
                        <p className="mb-1">{task.useMaterials ? 'Si' : 'No'}</p>
                    </div>
                )}

                <div>
                    <Title>Observaciones</Title>
                    <p className="mb-1">{task.observations}</p>
                </div>

                {/* Sección de Anotaciones Administrativas - Solo para AdministrativoContable */}
                {user?.roles?.includes('AdministrativoContable') && (
                    <div>
                        <Title>Anotaciones</Title>
                        {isEditingNotes ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={administrativeNotes}
                                    onChange={(e) =>
                                        setAdministrativeNotes(e.target.value)
                                    }
                                    placeholder="Agregar anotaciones administrativas..."
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleAdministrativeNotesUpdate}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingNotes(false);
                                            setAdministrativeNotes(
                                                task.administrativeNotes || '',
                                            );
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="mb-1 min-h-[60px] rounded-md border border-accent bg-muted p-2">
                                    {task.administrativeNotes ||
                                        'Sin anotaciones administrativas'}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsEditingNotes(true)}
                                >
                                    {task.administrativeNotes ? 'Editar' : 'Agregar'}{' '}
                                    Anotaciones
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Sección de Archivos Administrativos - Solo para AdministrativoContable */}
                {user?.roles?.includes('AdministrativoContable') && (
                    <div>
                        <Title>Adjuntar archivos</Title>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    multiple
                                    accept="*/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer rounded-md border border-accent bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Seleccionar Archivos
                                </label>
                                {files.length > 0 && (
                                    <Button
                                        size="sm"
                                        onClick={handleSaveFiles}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Subiendo...' : 'Subir Archivos'}
                                    </Button>
                                )}
                            </div>
                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Archivos seleccionados:
                                    </p>
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-md border border-accent bg-muted p-2"
                                        >
                                            <span className="text-sm">{file.name}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeFile(index)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <section>
                    <Title>Imágenes</Title>

                    {task.images.length === 0 ? (
                        <p className="text-muted-foreground">No hay imágenes</p>
                    ) : (
                        <div className="grid grid-cols-6 gap-4">
                            {task.images.map((image) => (
                                <div key={image.id}>
                                    <a
                                        className="group relative inline-block overflow-hidden rounded-md border border-accent"
                                        download={image.id}
                                        href={image.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Image
                                            src={image.url}
                                            width={640}
                                            height={1252}
                                            alt=""
                                            className="z-0"
                                        />

                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 transition-colors duration-200 group-hover:bg-background/90">
                                            <DownloadIcon />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="flex flex-col gap-2">
                    <div className="flex flex-col items-start justify-between">
                        <Title>
                            {task.expenses.length === 0
                                ? 'Gastos'
                                : `Gastos: $${task.expenses
                                      .reduce((acc, curr) => acc + curr.amount, 0)
                                      .toLocaleString('es-AR')}`}
                        </Title>
                        {(user.roles.includes('AdministrativoContable') ||
                            user.roles.includes('AdministrativoTecnico')) && (
                            <Button
                                className="flex items-center gap-1"
                                onClick={() =>
                                    router.push(`/tasks/${task.id}/expenses/create`)
                                }
                            >
                                <BsPlus size="20" />
                                <span>Crear nuevo gasto</span>
                            </Button>
                        )}
                    </div>

                    {task.expenses.length === 0 ? (
                        <p className="text-muted-foreground">No hay gastos</p>
                    ) : (
                        <DataList
                            data={task.expenses}
                            columns={expenseColumns}
                            onRowClick={(expense) =>
                                router.push(
                                    routesBuilder.accounting.expenses.details(expense.id),
                                )
                            }
                            emptyMessage="No hay gastos"
                        />
                    )}
                </section>

                {/* Archivos adjuntos administrativos existentes */}
                {user.roles.includes('AdministrativoContable') &&
                    task.attachmentFiles &&
                    task.attachmentFiles.length > 0 && (
                        <section>
                            <Title>Archivos adjuntos</Title>
                            <div className="flex flex-wrap gap-4">
                                {task.attachmentFiles.map((file: any) => (
                                    <div key={file.key} className="group relative">
                                        {file.mimeType &&
                                        file.mimeType.startsWith('image/') ? (
                                            <div className="relative">
                                                <ImageViewer
                                                    src={file.url}
                                                    alt={file.filename || ''}
                                                    filename={file.filename || ''}
                                                    showPreviewButton={true}
                                                    className="aspect-square object-contain transition-all duration-300"
                                                    previewClassName="group relative aspect-square overflow-hidden rounded-md border border-accent"
                                                />
                                                {user?.roles?.includes(
                                                    'AdministrativoContable',
                                                ) && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                                                        onClick={() =>
                                                            handleRemoveAttachment(
                                                                file.key,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : file.mimeType &&
                                          file.mimeType.startsWith('application/pdf') ? (
                                            <PDFViewer
                                                url={file.url}
                                                filename={file.filename || ''}
                                                showPreviewButton={false}
                                                className="h-[600px] w-full"
                                                deletable={user?.roles?.includes(
                                                    'AdministrativoContable',
                                                )}
                                                onDelete={() =>
                                                    handleRemoveAttachment(file.key)
                                                }
                                            />
                                        ) : (
                                            <div className="relative">
                                                <Button
                                                    className="w-full"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <a
                                                        className="inline-flex items-center gap-2"
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <DownloadIcon className="size-5" />
                                                        {file.filename}
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
            </div>

            <Modal
                openModal={deleteModal}
                handleToggleModal={() => setDeleteModal(false)}
                action={confirmDeleteAttachment}
                msg="¿Seguro que quiere eliminar este archivo adjunto?"
            />
        </main>
    );
};

export const TaskDetail = ({ id }: { id: string }) => {
    const result = useGetTask(id);

    if (result.isPending) {
        return <FormSkeleton />;
    }

    if (result.isError) {
        return <p>Error</p>;
    }

    if (!result.data.taskById) {
        return <p>Not found</p>;
    }

    return <Content task={result.data.taskById} />;
};
