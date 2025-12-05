// ApplyTemplate.jsx - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter 
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'sonner';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';

export default function ApplyTemplate({ page, templates, onTemplateApplied }) {
    const [open, setOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [keepCustomTheme, setKeepCustomTheme] = useState(true);
    
    // Usar useForm para manejar el formulario correctamente
    const { data, setData, post, processing, errors } = useForm({
        template_id: '',
        keep_custom_theme: true,
    });

    // Preparar opciones para React Select
    const templateOptions = templates.map(template => ({
        value: template.id,
        label: `${template.name} ${template.is_global ? '(Global)' : ''}`,
        description: template.description,
        original: template // Guardar el objeto completo
    }));

    // Cuando se selecciona una plantilla, actualizar los datos del formulario
    const handleTemplateChange = (option) => {
        setSelectedTemplate(option);
        setData('template_id', option ? option.value : '');
        console.log('Template seleccionado:', {
            option,
            templateId: option ? option.value : null,
            dataValue: data.template_id
        });
    };

    const handleApply = () => {
        console.log('Datos a enviar:', {
            template_id: data.template_id,
            keep_custom_theme: keepCustomTheme,
            selectedTemplate: selectedTemplate
        });

        if (!data.template_id || data.template_id === '') {
            toast.error('Selecciona una plantilla válida');
            return;
        }

        // IMPORTANTE: Usar post() de useForm, no router.post()
        post(route('pages.apply-template', page), {
            preserveScroll: true,
            preserveState: false, // Recargar la página completa
            onSuccess: () => {
                toast.success('Plantilla aplicada correctamente');
                setOpen(false);
                setSelectedTemplate(null);
                setData('template_id', '');
                
                // Recargar después de un breve delay
                setTimeout(() => {
                    router.reload({
                        only: ['page'],
                        preserveScroll: true
                    });
                }, 300);
                
                if (onTemplateApplied) {
                    onTemplateApplied();
                }
            },
            onError: (errors) => {
                console.error('Errores del formulario:', errors);
                toast.error('Error al aplicar plantilla');
            }
        });
    };

    const handleDetach = () => {
        if (confirm('¿Remover plantilla? Se mantendrá el contenido actual.')) {
            // Para detach, usar router.post con datos explícitos
            router.post(route('pages.detach-template', page), {}, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    toast.success('Plantilla removida');
                    setTimeout(() => {
                        router.reload({
                            only: ['page'],
                            preserveScroll: true
                        });
                    }, 300);
                    if (onTemplateApplied) {
                        onTemplateApplied();
                    }
                },
                onError: () => {
                    toast.error('Error al remover plantilla');
                }
            });
        }
    };

    // Valor actual para el Select
    const currentValue = selectedTemplate || 
        (page.template ? templateOptions.find(opt => opt.value === page.template.id) : null);

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg">Plantilla</h3>
                    <p className="text-sm text-gray-600">
                        {page.template 
                            ? `Usando: ${page.template.name}`
                            : 'Sin plantilla aplicada'
                        }
                    </p>
                </div>
                
                <div className="space-x-2">
                    {page.template && (
                        <Button
                            onClick={handleDetach}
                            variant="destructive"
                            size="sm"
                        >
                            Remover Plantilla
                        </Button>
                    )}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                {page.template ? 'Cambiar Plantilla' : 'Aplicar Plantilla'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {page.template ? 'Cambiar Plantilla' : 'Aplicar Plantilla'}
                                </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="template">Seleccionar Plantilla</Label>
                                    <Select
                                        name="template_id"  // IMPORTANTE: mismo nombre que en el formulario
                                        id="template"
                                        value={currentValue}
                                        onChange={handleTemplateChange}
                                        options={templateOptions}
                                        styles={customStyles}
                                        placeholder="Buscar o seleccionar..."
                                        className="mt-1"
                                        isClearable
                                        formatOptionLabel={(option) => (
                                            <div>
                                                <div className="font-medium">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {option.description}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    />
                                    {/* Campo oculto para Inertia */}
                                    <input 
                                        type="hidden" 
                                        name="template_id" 
                                        value={data.template_id} 
                                    />
                                    <input 
                                        type="hidden" 
                                        name="keep_custom_theme" 
                                        value={keepCustomTheme ? 1 : 0} 
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="keep-theme"
                                        checked={keepCustomTheme}
                                        onCheckedChange={setKeepCustomTheme}
                                    />
                                    <Label htmlFor="keep-theme" className="text-sm">
                                        Mantener tema personalizado
                                    </Label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Si está desactivado, se usará el tema de la plantilla
                                </p>
                            </div>
                            
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setOpen(false);
                                        setSelectedTemplate(null);
                                        setData('template_id', '');
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleApply}
                                    disabled={!data.template_id || processing}
                                >
                                    {processing ? 'Aplicando...' : 'Aplicar'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            
            {/* Debug info */}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="font-medium">Page ID:</span> {page.id}
                    </div>
                    <div>
                        <span className="font-medium">Template ID en DB:</span> {page.template_id || 'null'}
                    </div>
                    <div>
                        <span className="font-medium">Uses Template:</span> {page.uses_template ? 'true' : 'false'}
                    </div>
                    <div>
                        <span className="font-medium">Template seleccionado:</span> {data.template_id || 'ninguno'}
                    </div>
                </div>
            </div>
        </div>
    );
}