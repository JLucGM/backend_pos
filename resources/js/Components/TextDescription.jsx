export default function TextDescription({
    className = '',
    children,
    ...props
}) {
    return (
        <p
            {...props}
            className={
                `text-sm text-gray-500 ` + className
            }
        >
            {children}
        </p>
    );
}
