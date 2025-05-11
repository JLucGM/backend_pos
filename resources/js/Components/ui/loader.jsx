import { Loader2 } from "lucide-react";

export default function Loader({
    className = '',
    size = 30,
}) {
    return (
        <div className="flex items-center justify-center">

            <Loader2 className={
                `animate-spin text-gray-500 ` + className
            }
                size={size}
            />
        </div>
    );
}
