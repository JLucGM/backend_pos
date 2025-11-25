// components/BuilderPages/Builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { X, Undo, Redo, Monitor, Tablet, ArrowLeftToLine, Eye, Save, Plus, GripVertical } from 'lucide-react';
import ComponentTree from '@/Components/BuilderPages/ComponentTree';
import Canvas from '@/Components/BuilderPages/Canvas';
import CanvasItem from '@/Components/BuilderPages/CanvasItem';
import { addToHistory } from '@/utils/Builder/builderUtils';
import { ScrollArea } from '@/Components/ui/scroll-area';
import TextEditDialog from './partials/TextEditDialog';
import ButtonEditDialog from './partials/ButtonEditDialog';
import HeadingEditDialog from './partials/HeadingEditDialog';
import ImageEditDialog from './partials/ImageEditDialog';
import VideoEditDialog from './partials/VideoEditDialog';
import LinkEditDialog from './partials/LinkEditDialog';
import ProductEditDialog from './partials/ProductEditDialog';
import CarouselEditDialog from './partials/CarouselEditDialog';
import ContainerEditDialog from './partials/ContainerEditDialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/Components/ui/drawer';

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

    // Estados para el drag & drop visual
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [dropPosition, setDropPosition] = useState(null); // Nueva: posición del drop

    // Estado para el hover sincronizado
    const [hoveredComponentId, setHoveredComponentId] = useState(null);

    const themeSettings = page.theme?.settings || {};

    // Efectos
    useEffect(() => {
        if (page.layout && !hasLoaded.current) {
            try {
                const initialComponents = JSON.parse(page.layout);
                setComponents(initialComponents);
                addToHistory(initialComponents, history, setHistory, historyIndex, setHistoryIndex);
            } catch (error) {
                console.error('Error parsing layout:', error);
            }
            hasLoaded.current = true;
        } else if (!page.layout && !hasLoaded.current) {
            hasLoaded.current = true;
        }
    }, [page.layout]);

    useEffect(() => {
        if (hasUnsavedChanges) {
            autoSaveRef.current = setTimeout(() => {
                saveLayout(true);
            }, 30000);
        }
        return () => clearTimeout(autoSaveRef.current);
    }, [components, hasUnsavedChanges]);

    // Funciones principales
    const handleEditComponent = (comp) => {
        setEditingComponent(comp);
        setEditContent(comp.content);
        setEditStyles(comp.styles || {});
    };

    const saveEdit = () => {
        if (editingComponent) {
            setComponents((prev) => {
                const updateComponentInTree = (components, targetId, newData) => {
                    return components.map(component => {
                        if (component.id === targetId) {
                            return {
                                ...component,
                                content: newData.content,
                                styles: newData.styles
                            };
                        }

                        if (component.type === 'container' && component.content) {
                            return {
                                ...component,
                                content: updateComponentInTree(component.content, targetId, newData)
                            };
                        }

                        return component;
                    });
                };

                const newData = {
                    content: editContent,
                    styles: editStyles
                };

                const newComponents = updateComponentInTree(prev, editingComponent.id, newData);
                addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                setHasUnsavedChanges(true);
                return newComponents;
            });

            setEditingComponent(null);
            setEditContent('');
            setEditStyles({});

            toast.success("Cambios guardados correctamente");
        }
    };

    const cancelEdit = () => {
        setEditingComponent(null);
        setEditContent('');
        setEditStyles({});
    };

    const deleteComponent = (id) => {
        const removeFromTree = (items, targetId) => {
            return items.filter(item => {
                if (item.id === targetId) {
                    return false;
                }
                if (item.type === 'container' && item.content) {
                    item.content = removeFromTree(item.content, targetId);
                }
                return true;
            });
        };

        setComponents((prev) => {
            const newComponents = removeFromTree(prev, id);
            addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
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

    const handleAddComponent = () => {
        if (selectedType) {
            let content = 'Nuevo ' + selectedType;
            if (selectedType === 'video') content = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            if (selectedType === 'link') content = 'https://example.com';
            if (selectedType === 'image') content = 'https://picsum.photos/150';
            if (selectedType === 'container') content = [];
            if (selectedType === 'carousel') content = { limit: 5 };

            const newItem = {
                id: Date.now(),
                type: selectedType,
                content,
                styles: {}
            };

            setComponents((prev) => {
                const newComponents = [...prev, newItem];
                addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                setHasUnsavedChanges(true);
                return newComponents;
            });
            setIsAddDialogOpen(false);
            setSelectedType('');
        }
    };

    // Función para actualizar componentes desde el árbol
    const handleComponentsUpdate = (newComponents) => {
        setComponents(newComponents);
        addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
        setHasUnsavedChanges(true);
    };

    // Funciones mejoradas para manejar drag & drop con feedback visual
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        setHoveredComponentId(null); // Limpiar hover durante drag
        setDropPosition(null); // Limpiar posición anterior
    };

    // En Builder.jsx - mejora la función handleDragOver
    const handleDragOver = (event) => {
        const { active, over } = event;
        setOverId(over?.id || null);

        if (!over) {
            setDropPosition(null);
            return;
        }

        // Calcular posición del drop usando requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            if (over.id === 'root-area') {
                setDropPosition({ id: 'root-area', position: 'inside' });
                return;
            }

            const overElement = document.getElementById(`component-${over.id}`);
            if (overElement) {
                const rect = overElement.getBoundingClientRect();
                const cursorY = event.activatorEvent.clientY;

                // Determinar si el drop es arriba o abajo basado en la posición del cursor
                const overTop = rect.top;
                const overHeight = rect.height;

                const relativeY = cursorY - overTop;
                const threshold = overHeight / 3; // Usar 1/3 para hacerlo menos sensible

                let position;
                if (relativeY < threshold) {
                    position = 'top';
                } else if (relativeY > overHeight - threshold) {
                    position = 'bottom';
                } else {
                    position = 'inside';
                }

                // Solo actualizar si la posición cambió
                setDropPosition(prev => {
                    if (prev && prev.id === over.id && prev.position === position) {
                        return prev; // No cambiar si es la misma posición
                    }
                    return { id: over.id, position };
                });
            } else {
                setDropPosition(null);
            }
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveId(null);
        setOverId(null);
        setDropPosition(null); // Limpiar posición del drop

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // CASO: Mover al área raíz
        if (overId === 'root-area') {
            setComponents((prev) => {
                const removeComponent = (items, targetId) => {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].id === targetId) {
                            const [removed] = items.splice(i, 1);
                            return removed;
                        }
                        if (items[i].type === 'container' && items[i].content) {
                            const removed = removeComponent(items[i].content, targetId);
                            if (removed) {
                                return removed;
                            }
                        }
                    }
                    return null;
                };

                const newComponents = JSON.parse(JSON.stringify(prev));
                const removedComponent = removeComponent(newComponents, activeId);
                if (removedComponent) {
                    newComponents.push(removedComponent);
                }
                handleComponentsUpdate(newComponents);
                return newComponents;
            });
            return;
        }

        // Función mejorada para encontrar componentes
        const findComponentInfo = (items, id, parent = null, path = []) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return {
                        component: items[i],
                        index: i,
                        parent,
                        parentArray: items,
                        path: [...path, i]
                    };
                }
                if (items[i].type === 'container' && items[i].content) {
                    const found = findComponentInfo(items[i].content, id, items[i], [...path, i]);
                    if (found) return found;
                }
            }
            return null;
        };

        const activeInfo = findComponentInfo(components, activeId);
        const overInfo = findComponentInfo(components, overId);

        if (!activeInfo || !overInfo) {
            console.error('No se encontró información del componente activo o destino');
            return;
        }

        // PREVENIR: No permitir soltar un contenedor dentro de sí mismo o sus hijos
        const isDroppingInSelfOrChildren = (containerId, targetId) => {
            if (containerId === targetId) return true;

            const container = findComponentInfo(components, containerId);
            if (container && container.component.type === 'container' && container.component.content) {
                for (const child of container.component.content) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (activeInfo.component.type === 'container' &&
            isDroppingInSelfOrChildren(activeId, overId)) {
            console.log("No puedes soltar un contenedor dentro de sí mismo o sus hijos");
            toast.error("No puedes soltar un contenedor dentro de sí mismo");
            return;
        }

        const newComponents = JSON.parse(JSON.stringify(components));

        // Función para encontrar arrays padre en la nueva copia
        const findParentArrayByPath = (items, path) => {
            let current = items;
            for (let i = 0; i < path.length - 1; i++) {
                const index = path[i];
                if (current[index] && current[index].type === 'container' && current[index].content) {
                    current = current[index].content;
                } else {
                    return null;
                }
            }
            return current;
        };

        const activePath = activeInfo.path;
        const overPath = overInfo.path;

        const activeParentArray = findParentArrayByPath(newComponents, activePath);
        const overParentArray = findParentArrayByPath(newComponents, overPath);

        if (!activeParentArray || !overParentArray) {
            console.error('No se pudo encontrar los arrays padre');
            return;
        }

        const activeIndex = activePath[activePath.length - 1];
        const overIndex = overPath[overPath.length - 1];

        // Validar que los índices estén dentro de los límites
        if (activeIndex < 0 || activeIndex >= activeParentArray.length ||
            overIndex < 0 || overIndex >= overParentArray.length) {
            console.error('Índices fuera de rango:', { activeIndex, overIndex });
            return;
        }

        // Remover el componente activo de su ubicación actual
        const [movedComponent] = activeParentArray.splice(activeIndex, 1);

        // Obtener el componente destino con validación
        const overComponent = overParentArray[overIndex];
        if (!overComponent) {
            console.error('Componente destino no encontrado');
            return;
        }

        const isOverContainer = overComponent.type === 'container';

        // Usar la posición del drop para determinar la ubicación exacta
        const dropInfo = dropPosition || { position: 'bottom' };

        if (isOverContainer && dropInfo.position === 'inside') {
            // Mover dentro del contenedor
            overComponent.content = overComponent.content || [];

            // Verificar que no estamos moviendo el contenedor dentro de sí mismo
            if (movedComponent.id !== overComponent.id) {
                overComponent.content.push(movedComponent);
            } else {
                console.log("No puedes mover un contenedor dentro de sí mismo");
                return;
            }
        } else {
            // Mover al mismo nivel que el destino
            let adjustedIndex = overIndex;

            if (activeParentArray === overParentArray) {
                if (activeIndex < overIndex) {
                    adjustedIndex = overIndex - 1;
                }
            }

            // Ajustar basado en la posición del drop
            if (dropInfo.position === 'bottom') {
                adjustedIndex += 1;
            }

            // Asegurar que el índice esté dentro de los límites
            adjustedIndex = Math.max(0, Math.min(adjustedIndex, overParentArray.length));

            overParentArray.splice(adjustedIndex, 0, movedComponent);
        }

        handleComponentsUpdate(newComponents);
        toast.success("Componente movido correctamente");
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverId(null);
        setDropPosition(null);
    };

    // Función para encontrar el componente activo
    const findActiveComponent = (id) => {
        const findComponent = (items, targetId) => {
            for (const item of items) {
                if (item.id === targetId) {
                    return item;
                }
                if (item.type === 'container' && item.content) {
                    const found = findComponent(item.content, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        return findComponent(components, id);
    };

    // Sensors para dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Reducido para mayor sensibilidad
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeComponent = activeId ? findActiveComponent(activeId) : null;

    // JSX Principal
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`${page.title}`} />
            {isPreviewMode ? (
                // Modo Preview: Vista completa sin herramientas de edición
                <div>
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
                        <Canvas
                            components={components}
                            onEditComponent={() => { }}
                            onDeleteComponent={() => { }}
                            themeSettings={themeSettings}
                            products={products}
                            setComponents={setComponents}
                            canvasWidth={canvasWidth}
                            hoveredComponentId={null}
                            setHoveredComponentId={() => { }}
                            isPreview={true}
                        />
                    </div>
                </div>
            ) : (
                // Modo Edición: Builder completo con árbol de componentes
                <>
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
                        {/* Árbol de Componentes */}
                        <div className="w-80 bg-white p-4 rounded-lg shadow-md">
                            {/* <h3 className="font-semibold mb-4">Árbol de Componentes</h3> */}
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onDragCancel={handleDragCancel}
                                modifiers={[]} // Elimina modificadores que puedan interferir
                            >
                                <ComponentTree
                                    components={components}
                                    onEditComponent={handleEditComponent}
                                    onDeleteComponent={deleteComponent}
                                    activeId={activeId}
                                    overId={overId}
                                    dropPosition={dropPosition}
                                    hoveredComponentId={hoveredComponentId}
                                    setHoveredComponentId={setHoveredComponentId}
                                />
                                <DragOverlay dropAnimation={null}>
                                    {activeComponent ? (
                                        <div className="flex items-center gap-1 p-2 border-2 border-blue-500 rounded bg-blue-50 shadow-lg opacity-90">
                                            <div className="cursor-grab p-1">
                                                <GripVertical size={14} />
                                            </div>
                                            <span className="flex-1 text-sm font-medium">
                                                {activeComponent.type.charAt(0).toUpperCase() + activeComponent.type.slice(1)}
                                            </span>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full mt-4" variant="outline">
                                <Plus size={16} className="mr-2" />
                                Agregar Componente
                            </Button>
                        </div>

                        {/* Canvas */}
                        <div className="flex-1">
                            <Canvas
                                components={components}
                                onEditComponent={handleEditComponent}
                                onDeleteComponent={deleteComponent}
                                themeSettings={themeSettings}
                                products={products}
                                setComponents={setComponents}
                                canvasWidth={canvasWidth}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Drawer de Edición */}
            <Drawer open={!!editingComponent} onOpenChange={() => setEditingComponent(null)} direction="left" modal={false}>
                <DrawerContent className="w-80 flex flex-col h-full">
                    <DrawerHeader>
                        <DrawerTitle>Editar {editingComponent?.type}</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="flex-1 p-4">
                        {editingComponent?.type === 'text' && (
                            <TextEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                        {editingComponent?.type === 'button' && (
                            <ButtonEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                        {editingComponent?.type === 'heading' && (
                            <HeadingEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                        {editingComponent?.type === 'image' && (
                            <ImageEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                            />
                        )}
                        {editingComponent?.type === 'video' && (
                            <VideoEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                            />
                        )}
                        {editingComponent?.type === 'link' && (
                            <LinkEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                        {editingComponent?.type === 'product' && (
                            <ProductEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                        {editingComponent?.type === 'carousel' && (
                            <CarouselEditDialog
                                editContent={editContent}
                                setEditContent={setEditContent}
                            />
                        )}
                        {editingComponent?.type === 'container' && (
                            <ContainerEditDialog
                                editStyles={editStyles}
                                setEditStyles={setEditStyles}
                            />
                        )}
                    </ScrollArea>
                    <DrawerFooter>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={cancelEdit}>
                                Cancelar
                            </Button>
                            <Button onClick={saveEdit}>
                                Guardar
                            </Button>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

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
                                <SelectItem value="heading">Encabezado</SelectItem>
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
        </div>
    );
}