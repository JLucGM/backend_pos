import React, { useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ImageIcon, Trash2 } from 'lucide-react';
import SeoFields from '@/Components/SeoFields';
import ManualProducts from './partials/ManualProducts';
import SmartConditions from './partials/SmartConditions';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import MediaDetailsDialog from '@/Components/MediaDetailsDialog';
import { Checkbox } from '@/Components/ui/checkbox';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function CollectionForm({ data, setData, errors, products, categories, smartProducts = [], collection = null, libraryMedia = [] }) {
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [selectedLibraryImages, setSelectedLibraryImages] = useState([]);
    const [selectedImageDetails, setSelectedImageDetails] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Estado para selección múltiple
    const [selectedItems, setSelectedItems] = useState([]); // {id, isExisting}

    const handleImageClick = (image, isExisting = true) => {
        if (isExisting) {
            setSelectedImageDetails({
                ...image,
                url: image.original_url,
                thumb: image.thumb || image.original_url,
                usage_products: libraryMedia.find(m => m.file_name === image.file_name)?.usage_products || 0,
                usage_collections: libraryMedia.find(m => m.file_name === image.file_name)?.usage_collections || 1,
            });
        } else {
            setSelectedImageDetails(image);
        }
        setIsDetailsOpen(true);
    };

    const toggleSelect = (id, isExisting) => {
        const key = `${isExisting ? 'ex' : 'lib'}-${id}`;
        setSelectedItems(prev => 
            prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
        );
    };

    const deleteSelected = async () => {
        if (!confirm(`¿Estás seguro de quitar las ${selectedItems.length} imágenes seleccionadas?`)) return;

        const existingToDel = [];
        const libraryToRemove = [];

        selectedItems.forEach(key => {
            if (key.startsWith('ex-')) {
                existingToDel.push(parseInt(key.replace('ex-', '')));
            } else {
                libraryToRemove.push(parseInt(key.replace('lib-', '')));
            }
        });

        // Eliminar existentes de la DB (relación)
        for (const id of existingToDel) {
            router.delete(route('collections.images.destroy', { collection: collection.id, imageId: id }), {
                preserveScroll: true,
            });
        }

        // Eliminar nuevas de la librería (estado local)
        if (libraryToRemove.length > 0) {
            const newLibraryIds = (data.library_media_ids || []).filter(id => !libraryToRemove.includes(id));
            setData('library_media_ids', newLibraryIds);
            setSelectedLibraryImages(selectedLibraryImages.filter(img => !libraryToRemove.includes(img.media_id)));
        }

        setSelectedItems([]);
        toast.success('Imágenes quitadas correctamente');
    };

    const handleSelectFromLibrary = (image) => {
        const currentIds = data.library_media_ids || [];
        if (!currentIds.includes(image.media_id)) {
            setData('library_media_ids', [...currentIds, image.media_id]);
            setSelectedLibraryImages([...selectedLibraryImages, image]);
        }
    };

    const removeLibraryImage = (mediaId) => {
        setData('library_media_ids', data.library_media_ids.filter(id => id !== mediaId));
        setSelectedLibraryImages(selectedLibraryImages.filter(img => img.media_id !== mediaId));
    };

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {/* ── Columna principal ─────────────────────────────────────────── */}
            <div className="md:col-span-2 space-y-4">

                {/* Información básica */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Información de la colección</CardTitle>
                        {selectedItems.length > 0 && (
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                onClick={deleteSelected}
                                className="h-8"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Quitar ({selectedItems.length})
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Ej: Ropa de verano, Ofertas del mes…"
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción opcional de la colección…"
                                rows={3}
                            />
                        </div>

                        <div className="pt-2">
                            <Label className="mb-2 block">Imágenes de la colección</Label>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsMediaPickerOpen(true)}
                                className="flex items-center gap-2 w-full justify-center border-dashed border-2 py-8 hover:bg-accent/50"
                            >
                                <ImageIcon className="h-5 w-5" />
                                Gestionar o Subir Imágenes
                            </Button>
                        </div>

                        {/* Visualización de imágenes */}
                        {( (collection?.media?.length > 0) || selectedLibraryImages.length > 0 ) && (
                            <div className="pt-4 border-t">
                                <div className="flex flex-wrap gap-2">
                                    {collection?.media?.map((image) => {
                                        const isSelected = selectedItems.includes(`ex-${image.id}`);
                                        return (
                                            <div 
                                                key={image.id} 
                                                className={`relative group border-2 rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                            >
                                                {/* Checkbox Overlay */}
                                                <div 
                                                    className={`absolute top-1 left-1 z-30 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                >
                                                    <Checkbox 
                                                        checked={isSelected} 
                                                        onCheckedChange={() => toggleSelect(image.id, true)}
                                                        className="h-4 w-4 bg-white/90 data-[state=checked]:bg-primary shadow-sm border-gray-300"
                                                    />
                                                </div>

                                                <img 
                                                    src={image.original_url} 
                                                    className="w-24 h-24 object-cover" 
                                                    onClick={() => handleImageClick(image, true)}
                                                />
                                                
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                        );
                                    })}
                                    {selectedLibraryImages.map((image) => {
                                        const isSelected = selectedItems.includes(`lib-${image.media_id}`);
                                        return (
                                            <div 
                                                key={image.media_id} 
                                                className={`relative group border-2 rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-blue-400'}`}
                                            >
                                                {/* Checkbox Overlay */}
                                                <div 
                                                    className={`absolute top-1 left-1 z-30 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                >
                                                    <Checkbox 
                                                        checked={isSelected} 
                                                        onCheckedChange={() => toggleSelect(image.media_id, false)}
                                                        className="h-4 w-4 bg-white/90 data-[state=checked]:bg-primary shadow-sm border-gray-300"
                                                    />
                                                </div>

                                                <img 
                                                    src={image.src} 
                                                    className="w-24 h-24 object-cover" 
                                                    onClick={() => handleImageClick(image, false)}
                                                />
                                                <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[8px] px-1 rounded-tl-md">
                                                    Nueva
                                                </div>
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tipo de colección */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tipo de colección</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('type', 'manual')}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${data.type === 'manual'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <p className="font-semibold text-sm">Manual</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Añade productos uno a uno. Ideal para colecciones de promociones o selecciones especiales.
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('type', 'smart')}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${data.type === 'smart'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <p className="font-semibold text-sm">Inteligente</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Define condiciones automáticas (categoría, precio, inventario). Los productos se agregan solos.
                                </p>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Productos – sección condicional */}
                {data.type === 'manual' ? (
                    <ManualProducts
                        data={data}
                        setData={setData}
                        products={products}
                    />
                ) : (
                    <SmartConditions
                        data={data}
                        setData={setData}
                        categories={categories}
                        smartProducts={smartProducts}
                    />
                )}
            </div>

            {/* ── Columna lateral ───────────────────────────────────────────── */}
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Estado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active" className="cursor-pointer">
                                {data.is_active ? 'Activa' : 'Inactiva'}
                            </Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(val) => setData('is_active', val)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Vigencia (opcional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="starts_at">Fecha de inicio</Label>
                            <Input
                                id="starts_at"
                                type="date"
                                value={data.starts_at}
                                onChange={(e) => setData('starts_at', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="ends_at">Fecha de fin</Label>
                            <Input
                                id="ends_at"
                                type="date"
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                            />
                            {errors.ends_at && <p className="text-sm text-destructive">{errors.ends_at}</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div className="col-span-full md:col-span-2">
                <SeoFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    autoGenerateFromFields={{
                        title: data.title,
                        description: data.description,
                        image: collection?.media?.[0]?.original_url,
                    }}
                />
            </div>

            <ImageSelector
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelectImage={handleSelectFromLibrary}
                allImages={[
                    ...(collection?.media || []).map(m => ({
                        id: m.id,
                        src: m.original_url,
                        thumb: m.thumb || m.original_url,
                        name: m.name,
                        file_name: m.file_name,
                        media_id: m.id,
                        is_from_product: false
                    })),
                    ...libraryMedia
                ]}
            />

            <MediaDetailsDialog 
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                image={selectedImageDetails}
            />
        </div>
    );
}
