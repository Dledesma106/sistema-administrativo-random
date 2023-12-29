import Link from 'next/link';

import { BsPlus } from 'react-icons/bs';

import { Button } from '@/components/ui/button';

interface Props {
    title: string;
    path?: string;
    nameButton?: React.ReactNode;
}

export default function TitleButton({ title, path, nameButton }: Props): JSX.Element {
    return (
        <>
            <div className="flex items-center justify-between border-gray-400 bg-white px-5 py-4">
                <h2 className="text-xl font-semibold text-gray-600">{title}</h2>

                {path && nameButton && (
                    <Button asChild className="flex items-center space-x-2">
                        <Link href={path}>
                            <BsPlus size="20" />
                            <span>{nameButton}</span>
                        </Link>
                    </Button>
                )}
            </div>
            <hr className="mb-2 bg-gray-100" />
        </>
    );
}
