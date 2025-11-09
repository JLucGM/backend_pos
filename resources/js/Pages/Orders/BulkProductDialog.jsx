import React from 'react';
import { Button } from '@/Components/ui/button';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/Components/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/Components/ui/dialog';

export default function BulkProductDialog({
    productOptions = [],
    selectedProductsBulk = [],
    bulkProductColumns = [],
    handleAddBulkProducts,
    selectAllBulk,
    clearBulkSelection,
    isDisabled = false,
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    disabled={isDisabled}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="size-4" />
                    Agregar Productos
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Seleccionar Productos</DialogTitle>
                    <DialogDescription>
                        Marca los productos o variaciones que deseas agregar al pedido. Solo se muestran productos con stock disponible.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {productOptions.length > 0 ? (
                        <DataTable
                            columns={bulkProductColumns}
                            data={productOptions}
                            // Opcional: Si tu DataTable soporta filtrado, agrega searchInput o similar
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay productos disponibles.</p>
                    )}
                </div>
                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={selectAllBulk}
                            disabled={isDisabled || productOptions.length === 0}
                        >
                            Seleccionar Todos ({productOptions.length})
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearBulkSelection}
                            disabled={selectedProductsBulk.length === 0}
                        >
                            Limpiar Selección
                        </Button>
                    </div>
                    <Button
                        type="button"
                        onClick={handleAddBulkProducts}
                        disabled={selectedProductsBulk.length === 0 || isDisabled}
                    >
                        Agregar Seleccionados ({selectedProductsBulk.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
