import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select'; // Importar los estilos personalizados

export default function ThemeSelector({ page, themes }) {
    const [selectedTheme, setSelectedTheme] = useState(() => {
        if (page.theme_id) {
            const theme = themes.find(t => t.id === page.theme_id);
            return theme ? { value: theme.id, label: theme.name } : null;
        }
        return { value: null, label: 'Heredar de la plantilla' };
    });

    const themeOptions = [
        { value: null, label: 'Heredar de la plantilla' },
        ...themes.map(theme => ({
            value: theme.id,
            label: theme.name
        }))
    ];

    const handleThemeChange = (selectedOption) => {
        setSelectedTheme(selectedOption);
        
        // Usar router.patch directamente
        router.patch(route('pages.update-theme', page), {
            theme_id: selectedOption.value
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tema actualizado');
                // No necesitas router.reload aquí, Inertia ya actualiza la página
            },
            onError: () => {
                toast.error('Error al actualizar tema');
            }
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-3">Tema de la Página</h3>
            
            <div className="space-y-3">
                <div>
                    <Label htmlFor="theme-selector">Seleccionar Tema</Label>
                    <Select
                        name="theme-selector"
                        id="theme-selector"
                        value={selectedTheme}
                        onChange={handleThemeChange}
                        options={themeOptions}
                        styles={customStyles}
                        placeholder="Selecciona un tema..."
                        className="mt-1"
                    />
                </div>
                
                <div className="text-sm text-gray-600">
                    <p>Tema actual: <span className="font-medium">
                        {page.theme?.name || page.template?.theme?.name || 'Tema por defecto'}
                    </span></p>
                    <p className="text-xs mt-1">
                        {page.theme_id 
                            ? '✅ Este tema prevalece sobre el de la plantilla'
                            : page.template?.theme_id 
                                ? '🔗 Usando tema de la plantilla'
                                : '⚙️ Usando tema por defecto'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}