import Link from 'next/link';

import { BsPlus } from 'react-icons/bs';

import { TypographyH1 } from './ui/typography';

import { Button } from '@/components/ui/button';

interface Props {
    title: string;
    path?: string;
    nameButton?: React.ReactNode;
}

export default function TitleButton({ title, path, nameButton }: Props): JSX.Element {
    return (
        <div className="mb-8 flex items-center justify-between pt-2">
            <TypographyH1>{title}</TypographyH1>

            {path && nameButton && (
                <Button asChild className="flex items-center space-x-2">
                    <Link href={path}>
                        <BsPlus size="20" />
                        <span>{nameButton}</span>
                    </Link>
                </Button>
            )}
        </div>
    );
}
