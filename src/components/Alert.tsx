import { AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai';
import { BsCheckLg, BsX } from 'react-icons/bs';

import { type AlertType } from '@/context/alertContext/AlertProvider';
import useAlert from '@/context/alertContext/useAlert';

interface Props {
    message: string;
    type: AlertType;
    id: string;
}

export default function Alert({ message, type, id }: Props): JSX.Element {
    function Icon(): JSX.Element {
        switch (type) {
            case 'Success':
                return <BsCheckLg color="green" size={15} />;
            case 'Failure':
                return <AiOutlineWarning color="red" />;
            case 'Info':
                return <AiOutlineInfoCircle color="blue" />;
        }
    }

    function color(): string {
        switch (type) {
            case 'Success':
                return 'green';
            case 'Failure':
                return 'red';
            case 'Info':
                return 'blue';
        }
    }

    const textColor = (type: string): string => {
        switch (type) {
            case 'Success':
                return 'text-green-900';
            case 'Failure':
                return 'text-red-900';
            case 'Info':
                return 'text-blue-900';
            default:
                return '';
        }
    };

    const { removeAlert } = useAlert();

    return (
        <div
            className={`fixed bottom-0 right-0 m-4 flex w-96 items-center justify-between rounded-lg border p-2 shadow-lg`}
        >
            <div className="pl-6">
                <Icon />
            </div>
            <div className="flex w-full items-center justify-between rounded-r-lg border border-gray-200 border-l-transparent bg-white px-4 py-6">
                <div className={textColor(type)}>{message}</div>
                <button onClick={() => removeAlert(id)}>
                    <BsX size={20} color={color()} />
                </button>
            </div>
        </div>
    );
}
