export default function InputData({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[12px] text-gray-500 dark:text-gray-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
