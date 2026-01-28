import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';

export default function ThemeSelector({ themes }) {
    const [selectedTheme, setSelectedTheme] = useState(null);

    const themeOptions = themes.map(theme => ({
        value: theme.id,
        label: theme.name
    }));

    const handleThemeChange = (selectedOption) => {
        setSelectedTheme(selectedOption);

        router.patch(route('pages.update-company-theme'), {
            theme_id: selectedOption.value
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tema de todas las páginas actualizado');
            },
            onError: () => {
                toast.error('Error al actualizar tema');
            }
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow mb-4">
            <div className="space-y-3">
                <div>
                    <Label htmlFor="theme-selector">
                        Tema para todas las páginas
                    </Label>
                    <Select
                        name="theme-selector"
                        id="theme-selector"
                        value={selectedTheme}
                        onChange={handleThemeChange}
                        options={themeOptions}
                        styles={customStyles}
                        placeholder="Selecciona un tema para aplicar a todo..."
                        className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Este tema se aplicará a todas las páginas existentes.
                    </p>
                </div>
            </div>
        </div>
    );
}