import { ITask, IUser } from 'backend/models/interfaces';

export type TaskFinishedEmailProps = {
    auditor: IUser;
    finishedBy: IUser;
    task: ITask;
};

export default function TaskFinishedEmail({
    auditor,
    finishedBy,
    task,
}: TaskFinishedEmailProps): JSX.Element {
    return (
        <>
            <div>
                <h3>Hola {auditor.fullName}</h3>
            </div>
            <p>
                La tarea en la sucursal con número #{task.branch.number} y descripción{' '}
                <em>&ldquo;{task.description}&rdquo;</em>
                ha sido marcada como &ldquo;finalizada&rdquo; por {finishedBy.fullName}.
            </p>

            <p>Puedes revisar el estado de la tarea en el sitio</p>
        </>
    );
}
