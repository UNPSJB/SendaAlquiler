type Props = {
    title: string;
    line1: string;
    line2?: string;
    className?: string;
};

const FetchStatusMessageWithDescription: React.FC<Props> = ({
    title,
    line1,
    line2,
    className,
}) => (
    <div className={className}>
        <h2 className="mb-1 text-center text-3xl font-bold">{title}</h2>

        <div className="text-center text-sm text-gray-800">
            <p>{line1}</p>
            {line2 && <p>{line2}</p>}
        </div>
    </div>
);

export default FetchStatusMessageWithDescription;
