import React, { useState, useEffect, useRef, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Solo react-beautiful-dnd
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button'; // Ajusta el path si usas Shadcn
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog'; // Dialog de Shadcn
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { X, Undo, Redo, Monitor, Tablet, Smartphone, ArrowLeftToLine, Eye, Save, Trash, Plus } from 'lucide-react';
import CarouselComponent from '@/Components/BuilderPages/CarouselComponent';

// Hook personalizado para lazy loading
const useLazyLoad = (ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [ref]);

    return isVisible;
};

// Componente Video con lazy loading
const LazyVideo = ({ src, title }) => {
    const videoRef = useRef(null);
    const isVisible = useLazyLoad(videoRef);

    return (
        <div ref={videoRef} style={{ height: '200px', backgroundColor: '#f0f0f0' }}>
            {isVisible ? (
                <iframe
                    width="100%"
                    height="200"
                    src={src}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <p>Cargando video...</p>
                </div>
            )}
        </div>
    );
};

// Componente Producto (usa products prop)
const ProductComponent = ({ products }) => {
    if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {products.map((product) => (
                <div key={product.id} className="w-48 border p-4 rounded">
                    <h4 className="font-semibold">{product.product_name}</h4>
                    <p className="text-sm">Precio: ${product.product_price}</p>
                    {product.media && product.media.length > 0 && (
                        <img src={product.media[0].original_url} alt={product.product_name} className="w-full h-24 object-cover mt-2" />
                    )}
                </div>
            ))}
        </div>
    );
};

// Componente del canvas (sin drag/drop, solo renderizado)
const CanvasItem = memo(
    ({ comp, onEditComponent, onDeleteComponent, themeSettings, isPreview = false, products, setComponents }) => {
        const getStyles = () => {
            const styles = comp.styles || {};
            return {
                color: styles.color || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
                fontSize: styles.fontSize || 'inherit',
                backgroundColor: styles.backgroundColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
                padding: styles.padding || 'inherit',
                fontFamily: themeSettings?.fontFamily || 'inherit',
            };
        };

        return (
            <div
                className='group relative border border-transparent hover:border-slate-400'
            >
                <div className="opacity-0 rounded-t-lg group-hover:opacity-100 bg-slate-400 transition-opacity duration-300 absolute -top-6 px-2">
                    {comp.type.charAt(0).toUpperCase() + comp.type.slice(1)}

                </div>
                {!isPreview && (
                    <Button
                        onClick={() => onDeleteComponent(comp.id)}
                        className="absolute top-1 right-1 z-10"
                        variant="destructive"
                        size="icon"
                    >
                        <Trash size={12} />
                    </Button>
                )}
                <div onDoubleClick={isPreview ? undefined : () => onEditComponent(comp)} style={{ cursor: isPreview ? 'default' : 'pointer' }}>
                    {comp.type === 'text' && <p style={getStyles(comp)}>{comp.content}</p>}
                    {comp.type === 'image' && <img src={comp.content} alt="Imagen" className="w-full" />}
                    {comp.type === 'button' && <Button style={getStyles(comp)}>{comp.content}</Button>}
                    {comp.type === 'video' && <LazyVideo src={comp.content} title="Video" />}
                    {comp.type === 'link' && <a href={comp.content} target="_blank" rel="noopener noreferrer" style={getStyles(comp)}>{comp.content || 'Enlace'}</a>}
                    {comp.type === 'product' && (
                        <div style={{ position: 'relative' }}>
                            <ProductComponent products={products} />
                        </div>
                    )}
                    {comp.type === 'carousel' && (
                        <div style={{ position: 'relative' }}>
                            <CarouselComponent products={products.slice(0, comp.content.limit || 5)} />
                        </div>
                    )}
                    {comp.type === 'container' && (
                        <div
                            style={{ ...getStyles(comp), border: isPreview ? 'none' : '2px dashed #ccc', minHeight: '50px', padding: '10px', borderRadius: 8 }}
                        >
                            {comp.content.map((subComp, subIndex) => (
                                <CanvasItem
                                    key={subComp.id}
                                    comp={subComp}
                                    onEditComponent={(subComp) => onEditComponent(subComp)}
                                    onDeleteComponent={(id) => {
                                        setComponents((prev) => prev.map((c) => {
                                            if (c.id === comp.id) {
                                                return { ...c, content: c.content.filter((sc) => sc.id !== id) };
                                            }
                                            return c;
                                        }));
                                    }}
                                    themeSettings={themeSettings}
                                    isPreview={isPreview}
                                    products={products}
                                    setComponents={setComponents}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

// Componente del canvas (sin droppable, solo renderiza items)
const Canvas = ({ components, onEditComponent, onDeleteComponent, themeSettings, products, setComponents, canvasWidth }) => (
    <div
        className={`min-h-[400px]  mx-auto transition-all duration-300 ease-in-out bg-gray-100 p-4 rounded-lg border-2  relative`}
        style={{
            backgroundSize: '20px 20px',
            width: canvasWidth,
        }}>
        {components.map((comp, index) => (
            <CanvasItem
                key={comp.id}
                comp={comp}
                onEditComponent={onEditComponent}
                onDeleteComponent={onDeleteComponent}
                themeSettings={themeSettings}
                isPreview={false}
                products={products}
                setComponents={setComponents}
            />
        ))}
    </div>
);

// Sidebar usando react-beautiful-dnd (solo aquí hay drag/drop)
const Sidebar = ({ components }) => (
    <Droppable droppableId="sidebar">
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 p-2 rounded border ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}`}
            >
                {components.map((comp, index) => (
                    <Draggable key={comp.id} draggableId={comp.id.toString()} index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-2 border rounded cursor-move transition ${snapshot.isDragging ? 'opacity-50 bg-gray-200' : 'bg-white'}`}
                            >
                                {comp.type.charAt(0).toUpperCase() + comp.type.slice(1)} {/* (ID: {comp.id}) */}
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);

// Componente principal del Builder
export default function Builder({ page, products }) {
    const [components, setComponents] = useState([]);
    const [editingComponent, setEditingComponent] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editStyles, setEditStyles] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [canvasWidth, setCanvasWidth] = useState('100%');
    const autoSaveRef = useRef(null);
    const hasLoaded = useRef(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('');

    const themeSettings = page.theme?.settings || {};

    const addToHistory = (newComponents) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(newComponents)));
        if (newHistory.length > 10) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    useEffect(() => {
        if (page.layout && !hasLoaded.current) {
            try {
                const initialComponents = JSON.parse(page.layout);
                setComponents(initialComponents);
                addToHistory(initialComponents);
            } catch (error) {
                console.error('Error parsing layout:', error);
            }
            hasLoaded.current = true;
        } else if (!page.layout && !hasLoaded.current) {
            hasLoaded.current = true;
        }
    }, [page.layout]);

    // useEffect(() => {
    //     if (hasUnsavedChanges) {
    //         autoSaveRef.current = setTimeout(() => {
    //             saveLayout(true);
    //         }, 30000);
    //     }
    //     return () => clearTimeout(autoSaveRef.current);
    // }, [components, hasUnsavedChanges]);

    const handleEditComponent = (comp) => {
        setEditingComponent(comp);
        setEditContent(comp.content);
        setEditStyles(comp.styles || {});
    };

    const saveEdit = () => {
        if (editingComponent) {
            setComponents((prev) => {
                const newComponents = prev.map((c) => {
                    if (c.id === editingComponent.id) {
                        return { ...c, content: editContent, styles: editStyles };
                    }
                    return c;
                });
                addToHistory(newComponents);
                setHasUnsavedChanges(true);
                return newComponents;
            });
            setEditingComponent(null);
            setEditContent('');
            setEditStyles({});
        }
    };

    const cancelEdit = () => {
        setEditingComponent(null);
        setEditContent('');
        setEditStyles({});
    };

    const deleteComponent = (id) => {
        setComponents((prev) => {
            const newComponents = prev.filter((c) => c.id !== id);
            addToHistory(newComponents);
            setHasUnsavedChanges(true);
            return newComponents;
        });
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setComponents(history[historyIndex - 1]);
            setHasUnsavedChanges(true);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setComponents(history[historyIndex + 1]);
            setHasUnsavedChanges(true);
        }
    };

    const saveLayout = (isAuto = false) => {
        router.post(route('pages.updateLayout', page), {
            layout: JSON.stringify(components),
        }, {
            onSuccess: () => {
                setHasUnsavedChanges(false);
                setHistory([JSON.parse(JSON.stringify(components))]);
                setHistoryIndex(0);
                if (!isAuto) {
                    toast("Layout actualizado con éxito.");
                } else {
                    toast("Layout guardado automáticamente.");
                }
            },
            onError: (errors) => {
                console.error('Error saving layout:', errors);
                toast.error("Error al actualizar el layout.");
            }
        });
    };

    // Solo maneja reordenar desde el sidebar
    const handleDragEnd = (result) => {
        if (!result.destination || result.source.droppableId !== 'sidebar') return;

        const items = Array.from(components);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        setComponents(items);
        addToHistory(items);
        setHasUnsavedChanges(true);
    };

    const handleAddComponent = () => {
        if (selectedType) {
            let content = 'Nuevo ' + selectedType;
            if (selectedType === 'video') content = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            if (selectedType === 'link') content = 'https://example.com';
            if (selectedType === 'image') content = 'https://picsum.photos/150';
            if (selectedType === 'container') content = [];
            if (selectedType === 'carousel') content = { limit: 5 };
            const newItem = { id: Date.now(), type: selectedType, content, styles: {} };
            setComponents((prev) => {
                const newComponents = [...prev, newItem];
                addToHistory(newComponents);
                setHasUnsavedChanges(true);
                return newComponents;
            });
            setIsAddDialogOpen(false);
            setSelectedType('');
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Head title={page.title} />
            {isPreviewMode ? (
                // Modo Preview: Vista completa sin herramientas de edición
                <div style={{ padding: '20px' }}>
                    <Button
                        className="fixed top-10 right-10 z-50"
                        variant="destructive"
                        size="icon"
                        onClick={() => setIsPreviewMode(false)}
                    >
                        <X size={16} />
                    </Button>
                    <h1>{page.title}</h1>
                    <div style={{
                        backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : '#fff',
                        fontFamily: themeSettings?.fontFamily || 'inherit',
                        padding: '10px',
                    }}>
                        {components.map((comp, index) => (
                            <CanvasItem
                                key={comp.id}
                                comp={comp}
                                index={index}
                                onEditComponent={() => { }} // No editar en preview
                                onDeleteComponent={() => { }} // No eliminar en preview
                                themeSettings={themeSettings}
                                isPreview={true}
                                products={products}
                                setComponents={setComponents}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                // Modo Edición: Builder completo con sidebar drag/drop y canvas estático
                <div className="min-h-screen bg-gray-50">
                    {/* Toolbar Superior con Tooltips */}
                    <TooltipProvider>
                        <div className="flex justify-between items-center px-4 py-2 border-b bg-white shadow-sm">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => router.visit(route('pages.index'))}>
                                        <ArrowLeftToLine size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Volver a páginas</TooltipContent>
                            </Tooltip>
                            <div className="mx-auto">
                                <Button variant="ghost" disabled size="icon">
                                    {page.title}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setCanvasWidth('100%')} variant={canvasWidth === '100%' ? 'outline' : 'ghost'} size="icon">
                                            <Monitor size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver en escritorio</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setCanvasWidth('640px')} variant={canvasWidth === '640px' ? 'outline' : 'ghost'} size="icon">
                                            <Tablet size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver en tablet</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setIsPreviewMode(true)} variant="ghost" size="icon">
                                            <Eye size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Modo preview</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="icon">
                                            <Undo size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Deshacer</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="icon">
                                            <Redo size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Rehacer</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => saveLayout(false)} size="icon">
                                            <Save size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Guardar</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </TooltipProvider>

                    {/* Contenido Principal */}
                    <div className="flex gap-6 p-6">
                        {/* Sidebar Plano usando react-beautiful-dnd */}
                        <div className="w-64 bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-4">Jerarquía de Componentes</h3>
                            <Sidebar components={components} />
                            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full mt-4" variant="outline">
                                <Plus size={16} className="mr-2" />
                                Agregar Componente
                            </Button>
                        </div>

                        {/* Canvas Estático (sin drag/drop) */}
                        <div className="flex-1">
                            <Canvas
                                components={components}
                                onEditComponent={handleEditComponent}
                                onDeleteComponent={deleteComponent}
                                themeSettings={themeSettings}
                                products={products}
                                setComponents={setComponents}
                                canvasWidth={canvasWidth}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Dialog de Edición con Shadcn */}
            <Dialog open={!!editingComponent} onOpenChange={() => setEditingComponent(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar {editingComponent?.type}</DialogTitle>
                    </DialogHeader>
                    {editingComponent?.type === 'product' ? (
                        <p>Los productos son dinámicos y se cargan automáticamente desde la base de datos. No se editan aquí.</p>
                    ) : editingComponent?.type === 'carousel' ? (
                        <div className="space-y-4">
                            <Label htmlFor="limit">Número de productos a mostrar</Label>
                            <Input
                                id="limit"
                                type="number"
                                value={editContent.limit || 5}
                                onChange={(e) => setEditContent({ ...editContent, limit: parseInt(e.target.value) })}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Label htmlFor="content">Contenido</Label>
                            <textarea
                                id="content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full h-20 p-2 border rounded"
                            />
                            {(editingComponent?.type === 'text' || editingComponent?.type === 'button' || editingComponent?.type === 'link') && (
                                <>
                                    <Label htmlFor="color">Color</Label>
                                    <Input
                                        id="color"
                                        type="color"
                                        value={editStyles.color || '#000000'}
                                        onChange={(e) => setEditStyles({ ...editStyles, color: e.target.value })}
                                    />
                                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                                    <Select value={editStyles.fontSize || '16px'} onValueChange={(value) => setEditStyles({ ...editStyles, fontSize: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="12px">12px</SelectItem>
                                            <SelectItem value="16px">16px</SelectItem>
                                            <SelectItem value="20px">20px</SelectItem>
                                            <SelectItem value="24px">24px</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                            {editingComponent?.type === 'button' && (
                                <>
                                    <Label htmlFor="bgColor">Color de fondo</Label>
                                    <Input
                                        id="bgColor"
                                        type="color"
                                        value={editStyles.backgroundColor || '#007bff'}
                                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                                    />
                                    <Label htmlFor="padding">Padding</Label>
                                    <Select value={editStyles.padding || '10px'} onValueChange={(value) => setEditStyles({ ...editStyles, padding: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5px">5px</SelectItem>
                                            <SelectItem value="10px">10px</SelectItem>
                                            <SelectItem value="15px">15px</SelectItem>
                                            <SelectItem value="20px">20px</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                            {editingComponent?.type === 'container' && (
                                <>
                                    <Label htmlFor="bgColor">Fondo</Label>
                                    <Input
                                        id="bgColor"
                                        type="color"
                                        value={editStyles.backgroundColor || '#f9f9f9'}
                                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                                    />
                                    <Label htmlFor="padding">Padding</Label>
                                    <Select value={editStyles.padding || '10px'} onValueChange={(value) => setEditStyles({ ...editStyles, padding: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5px">5px</SelectItem>
                                            <SelectItem value="10px">10px</SelectItem>
                                            <SelectItem value="15px">15px</SelectItem>
                                            <SelectItem value="20px">20px</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setEditingComponent(null);
                            setEditContent('');
                            setEditStyles({});
                        }}>Cancelar</Button>
                        <Button onClick={saveEdit}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Agregar Componente */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Componente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label htmlFor="type">Tipo de Componente</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="image">Imagen</SelectItem>
                                <SelectItem value="button">Botón</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="link">Enlace</SelectItem>
                                <SelectItem value="product">Producto</SelectItem>
                                <SelectItem value="carousel">Carrusel de Productos</SelectItem>
                                <SelectItem value="container">Contenedor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddComponent} disabled={!selectedType}>Agregar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DragDropContext>
    );
}
