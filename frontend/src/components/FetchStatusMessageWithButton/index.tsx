import Button, { ButtonVariant } from '../Button';

type Props = {
    message: string;
    btnHref: string;
    btnText: string;
};

const FetchStatusMessageWithButton: React.FC<Props> = ({ message, btnHref, btnText }) => (
    <div className="flex flex-1 items-center">
        <div className="w-full">
            <h2 className="mb-4 text-center text-3xl font-bold">{message}</h2>

            <div className="flex justify-center">
                <Button variant={ButtonVariant.GRAY} href={btnHref}>
                    {btnText}
                </Button>
            </div>
        </div>
    </div>
);

export default FetchStatusMessageWithButton;
