export default function DivSection({
    className = '',
    children,
    ...props
}) {
    return (
        <div
            {...props}
            className={
                `bg-white dark:bg-gray-800 border shadow rounded-2xl p-4 ` + className
            }
        >
            {children}
        </div>
    );
}
