import Link from 'next/link';

import useLoading from '@/hooks/useLoading';

interface Props {
    title: string;
    path: string;
    icon: JSX.Element;
    toggle: boolean;
    selectItem: (id: number) => void;
    id: number;
}

export default function Item({
    title,
    path,
    icon,
    toggle,
    selectItem,
    id,
}: Props): JSX.Element {
    const { startLoading, stopLoading } = useLoading();
    async function navigate(): Promise<void> {
        selectItem(id);
        startLoading();
        stopLoading();
    }

    const handleNavigate = (): void => {
        void navigate();
    };

    return (
        <Link
            href={path}
            className={`mt-1 flex h-12 w-full items-center rounded px-4 ${
                toggle ? 'bg-gray-700 text-gray-300' : ''
            } hover:bg-gray-700 hover:text-gray-300`}
            onClick={handleNavigate}
        >
            {icon}
            <span className="ml-2 select-none text-sm font-medium">{title}</span>
        </Link>
    );
}
