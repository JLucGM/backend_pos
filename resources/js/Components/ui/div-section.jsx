export default function DivSection({
    className = '',
    children,
    title,
    subtitle,
    ...props
}) {
    return (
        <div
            {...props}
            className={
                `bg-white dark:bg-gray-800 border shadow rounded-3xl p-4 mb-4 ` + className
            }
        >
            <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            {children}
        </div>
    );
}
