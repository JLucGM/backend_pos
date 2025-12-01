import React from 'react';
import { Label } from '@/Components/ui/label';
import { ScrollArea } from '@/Components/ui/scroll-area';

const PageContentEditDialog = ({
    pageContent
}) => {
    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                    <span className="inline-flex items-center gap-2">
                        🔒 Componente Protegido
                    </span>
                </h4>
                <p className="text-yellow-700 text-sm">
                    Este componente muestra el contenido original de la página y <strong>no puede ser editado o eliminado</strong> desde el builder.
                </p>
                <p className="text-yellow-600 text-xs mt-2">
                    Para modificar este contenido, edita la página directamente desde el menú de páginas.
                </p>
            </div>

            <div>
                <Label htmlFor="pageContentPreview">
                    Vista previa del contenido:
                </Label>
                <ScrollArea className="h-64 mt-2 border rounded-md p-4 bg-gray-50">
                    {pageContent ? (
                        <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: pageContent }}
                        />
                    ) : (
                        <p className="text-gray-500">No hay contenido disponible</p>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

export default PageContentEditDialog;