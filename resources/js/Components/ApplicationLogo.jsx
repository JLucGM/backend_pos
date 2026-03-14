export default function ApplicationLogo({ className = "", ...props }) {
    return (
        <img
            src="/logo-audaz.png"
            alt="Logo Audaz"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
