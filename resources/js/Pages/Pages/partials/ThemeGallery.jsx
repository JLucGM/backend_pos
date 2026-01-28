import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function ThemeGallery({ themes, currentThemeId }) {
    const handleApply = (themeId) => {
        router.patch(route('pages.update-company-theme'), {
            theme_id: themeId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tema aplicado correctamente a todas las páginas');
            },
            onError: () => {
                toast.error('Error al aplicar el tema');
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {themes.map(theme => {
                const isActive = theme.id === currentThemeId;
                return (
                    <Card key={theme.id} className={`overflow-hidden flex flex-col ${isActive ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden group">
                            {/* Placeholder image */}
                            <img
                                src={`https://placehold.co/600x400/f8fafc/0f172a?text=${encodeURIComponent(theme.name)}&font=montserrat`}
                                alt={theme.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {isActive && (
                                <div className="absolute top-2 right-2">
                                    <Badge className="bg-green-500 hover:bg-green-600 shadow-sm">Activo</Badge>
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">{theme.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {theme.description || "Diseño profesional optimizado para conversión y experiencia de usuario."}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-0">
                            {isActive ? (
                                <Button disabled variant="outline" className="w-full bg-gray-50">
                                    Tema Seleccionado
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleApply(theme.id)}
                                    className="w-full"
                                >
                                    Aplicar Tema
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
