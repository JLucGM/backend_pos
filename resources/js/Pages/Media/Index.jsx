import React, { useState, useMemo, Suspense, lazy } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { 
    Upload, 
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import MediaDetailsDialog from '@/Components/MediaDetailsDialog';
import { MediaColumns } from './Columns';
import Loader from '@/Components/ui/loader';

const DataTable = lazy(() => import('@/Components/DataTable'));
const DivSection = lazy(() => import('@/Components/ui/div-section'));

export default function MediaIndex({ libraryMedia = [], productMedia = [] }) {
    const [isUploading, setIsUploading] = useState(false);
    const [copyingId, setCopyingId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // --- Unificación y Deduplicación ---
    const allMediaUnified = useMemo(() => {
        const unique = new Map();
        
        // Combinamos ambas fuentes
        const combined = [...libraryMedia, ...productMedia];

        combined.forEach(item => {
            // Deduplicamos por nombre de archivo
            const key = item.file_name || item.name;
            if (!unique.has(key)) {
                unique.set(key, item);
            }
        });

        return Array.from(unique.values());
    }, [libraryMedia, productMedia]);

    const handleShowDetails = (item) => {
        setSelectedImage(item);
        setIsDetailsOpen(true);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post(route('media.store'), formData, {
            onSuccess: () => {
                setIsUploading(false);
                toast.success('Imagen subida correctamente');
            },
            onError: () => {
                setIsUploading(false);
                toast.error('Error al subir la imagen');
            },
        });
    };

    const columns = useMemo(() => 
        MediaColumns(handleShowDetails, copyingId, setCopyingId), 
    [copyingId]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Librería Media
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={() => document.getElementById('media-upload').click()} 
                            disabled={isUploading}
                            size="sm"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                            Subir Imagen
                        </Button>
                        <input 
                            id="media-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleUpload}
                        />
                    </div>
                </div>
            }
        >
            <Head title="Librería Media" />

            <div className="py-6">
                <Suspense fallback={<Loader />}>
                    <DivSection>
                        <DataTable
                            columns={columns}
                            data={allMediaUnified}
                            // Las rutas de editar/eliminar se manejan dentro de las columnas por ser media global
                        />
                    </DivSection>
                </Suspense>
            </div>

            <MediaDetailsDialog 
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                image={selectedImage}
            />
        </AuthenticatedLayout>
    );
}
