import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Trash } from "lucide-react";

/**
 * Componente de diálogo de confirmación para eliminaciones en el SaaS.
 * 
 * @param {string} url - La ruta de eliminación (ej. route('cities.destroy', id)).
 * @param {string} title - Título del diálogo.
 * @param {string} description - Mensaje de advertencia.
 * @param {Object} data - Datos adicionales para la petición (opcional).
 */
const ConfirmDeleteDialog = ({ 
    url, 
    title = "¿Estás completamente seguro?", 
    description = "Esta acción no se puede deshacer. Esto eliminará permanentemente el registro de nuestros servidores.",
    data = {}
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setLoading(true);
        router.delete(url, {
            data: data,
            onSuccess: () => {
                setOpen(false);
            },
            onFinish: () => setLoading(false),
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-red-600 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                    <Trash className="mr-2 h-4 w-4" /> Eliminar
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0">
                    <Button 
                        type="button"
                        variant="ghost" 
                        onClick={() => setOpen(false)} 
                        disabled={loading}
                        className="sm:mr-2"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="button"
                        variant="destructive" 
                        onClick={handleConfirm} 
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Confirmar eliminación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
