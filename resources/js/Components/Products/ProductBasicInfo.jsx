import React, { useRef, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Input } from '@/Components/ui/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ImageIcon, CheckCircle2 } from 'lucide-react';
import TextAreaRich from '@/Components/ui/TextAreaRich';
import { customStyles } from '@/hooks/custom-select';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import MediaDetailsDialog from '@/Components/MediaDetailsDialog';
import { Checkbox } from '@/Components/ui/checkbox';

export default function ProductBasicInfo({ data, setData, errors, categoryOptions, handleCategoryChange, handleDeleteImage, product, libraryMedia = [] }) {
    const animatedComponents = makeAnimated();
    const textAreaRef = useRef();
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [selectedLibraryImages, setSelectedLibraryImages] = useState([]);
    const [selectedImageDetails, setSelectedImageDetails] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Estado para la selección múltiple
    const [selectedItems, setSelectedItems] = useState([]); // {id, isExisting}

    const handleImageClick = (image, isExisting = true) => {
        if (isExisting) {
            setSelectedImageDetails({
                ...image,
                url: image.original_url,
                thumb: image.thumb || image.original_url,
                usage_products: libraryMedia.find(m => m.file_name === image.file_name)?.usage_products || 1,
                usage_collections: libraryMedia.find(m => m.file_name === image.file_name)?.usage_collections || 0,
            });
        } else {
            setSelectedImageDetails(image);
        }
        setIsDetailsOpen(true);
    };

    const toggleSelect = (id, isExisting, e) => {
        e.stopPropagation();
        const key = `${isExisting ? 'ex' : 'lib'}-${id}`;
        if (selectedItems.includes(key)) {
            setSelectedItems(selectedItems.filter(i => i !== key));
        } else {
            setSelectedItems([...selectedItems, key]);
        }
    };

    const deleteSelected = async () => {
        if (!confirm(`¿Estás seguro de quitar las ${selectedItems.length} imágenes seleccionadas?`)) return;

        // Separar las selecciones
        const existingToWeb = [];
        const libraryToRemove = [];

        selectedItems.forEach(key => {
            if (key.startsWith('ex-')) {
                existingToWeb.push(parseInt(key.replace('ex-', '')));
            } else {
                libraryToRemove.push(parseInt(key.replace('lib-', '')));
            }
        });

        // Eliminar existentes (relación con DB)
        for (const id of existingToWeb) {
            await handleDeleteImage(id);
        }

        // Eliminar nuevas de la librería (estado local)
        if (libraryToRemove.length > 0) {
            const newLibraryIds = (data.library_media_ids || []).filter(id => !libraryToRemove.includes(id));
            setData('library_media_ids', newLibraryIds);
            setSelectedLibraryImages(selectedLibraryImages.filter(img => !libraryToRemove.includes(img.media_id)));
        }

        setSelectedItems([]);
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
        <DivSection className='space-y-4'>
            <div>
                <InputLabel htmlFor="product_name" value="Nombre" />
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    value={data.product_name || ''}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_name', e.target.value)}
                />
                <InputError message={errors.product_name} />
            </div>

            <div>
                <InputLabel htmlFor="product_description" value="Descripción" />
                <TextAreaRich
                    initialValue={data.product_description || ''}
                    ref={textAreaRef}
                    name="product_description"
                    onChange={(newText) => setData('product_description', newText)}
                />
                <InputError message={errors.product_description} />
            </div>

            <div>
                <div className="flex justify-between items-end mb-2">
                    <InputLabel value="Media" />
                    {selectedItems.length > 0 && (
                        <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={deleteSelected}
                            className="h-8"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Eliminar ({selectedItems.length})
                        </Button>
                    )}
                </div>
                <div className="mt-1">
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
                <InputError message={errors.images} className="mt-2" />
                <InputError message={errors.library_media_ids} className="mt-2" />
            </div>

            <div className="my-4">
                <div className="flex flex-wrap gap-3">
                    {/* Imágenes ya existentes en el producto */}
                    {product && product.media && product.media.length > 0 ? (
                        product.media.map((image) => {
                            const isSelected = selectedItems.includes(`ex-${image.id}`);
                            return (
                                <div 
                                    key={image.id} 
                                    className={`relative group rounded-xl border-2 transition-all overflow-hidden ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                >
                                    {/* Contenedor del Checkbox con efecto hover */}
                                    <div 
                                        className={`absolute top-2 left-2 z-30 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                    >
                                        <Checkbox 
                                            checked={isSelected} 
                                            onCheckedChange={() => {
                                                // Simulamos el evento para reutilizar toggleSelect si es necesario o llamamos directo
                                                const key = `ex-${image.id}`;
                                                setSelectedItems(prev => 
                                                    prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
                                                );
                                            }}
                                            className="h-5 w-5 bg-white/90 data-[state=checked]:bg-primary shadow-sm border-gray-300"
                                        />
                                    </div>
                                    
                                    <img
                                        src={image.original_url}
                                        alt={image.name}
                                        className="w-32 h-32 object-cover cursor-pointer"
                                        onClick={() => handleImageClick(image, true)}
                                    />
                                    
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            );
                        })
                    ) : null}

                    {/* Imágenes seleccionadas de la librería (pendientes de guardar) */}
                    {selectedLibraryImages.map((image) => {
                        const isSelected = selectedItems.includes(`lib-${image.media_id}`);
                        return (
                            <div 
                                key={image.media_id} 
                                className={`relative group rounded-xl border-2 transition-all overflow-hidden ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-blue-400'}`}
                            >
                                {/* Contenedor del Checkbox con efecto hover */}
                                <div 
                                    className={`absolute top-2 left-2 z-30 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    <Checkbox 
                                        checked={isSelected} 
                                        onCheckedChange={() => {
                                            const key = `lib-${image.media_id}`;
                                            setSelectedItems(prev => 
                                                prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
                                            );
                                        }}
                                        className="h-5 w-5 bg-white/90 data-[state=checked]:bg-primary shadow-sm border-gray-300"
                                    />
                                </div>

                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-32 h-32 object-cover cursor-pointer"
                                    onClick={() => handleImageClick(image, false)}
                                />
                                <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[8px] px-1 rounded-tl-md">
                                    Librería
                                </div>
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <ImageSelector
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelectImage={handleSelectFromLibrary}
                allImages={[
                    ...(product?.media || []).map(m => ({
                        id: m.id,
                        src: m.original_url,
                        thumb: m.thumb || m.original_url,
                        name: m.name,
                        file_name: m.file_name,
                        media_id: m.id,
                        is_from_product: true
                    })),
                    ...libraryMedia
                ]}
            />

            <MediaDetailsDialog 
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                image={selectedImageDetails}
            />

            <div>
                <InputLabel value="Categorías" />
                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    styles={customStyles}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    components={animatedComponents}
                    value={categoryOptions.filter(option => data.categories.includes(option.value))}
                />
                <InputError message={errors.categories} />
            </div>
        </DivSection>
    );
}
