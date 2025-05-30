export default function DivSection({
    className = '',
    children,
    ...props
}) {
    return (
        <div
            {...props}
            className={
                `bg-white dark:bg-gray-800 border shadow rounded-3xl p-4 mb-4 ` + className
            }
        >
            {children}
        </div>
    );
}
