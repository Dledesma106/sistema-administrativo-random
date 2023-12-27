import { Button, ButtonProps } from './ui/button';
import { LoadingSpinner } from './ui/spinner';

type Props = Omit<ButtonProps, 'children'> & {
    spinnerProps?: React.SVGProps<SVGSVGElement>;
    showSpinner?: boolean;
    children: string;
};

export const ButtonWithSpinner = ({ showSpinner, children, ...props }: Props) => (
    <Button {...props} className="relative" type="submit">
        <span className={showSpinner ? 'invisible' : 'visible'}>{children}</span>

        {showSpinner && (
            <span className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size={20} />
            </span>
        )}
    </Button>
);
