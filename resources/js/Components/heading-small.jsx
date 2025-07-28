export default function HeadingSmall({ title, description, className="" }) {
    return (
        <header className={`mb-6 ${className}`}>
            <h3 className="mb-0.5 text-base font-medium">{title}</h3>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </header>
    );
}
