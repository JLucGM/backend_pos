import { useForm } from '@inertiajs/react';
import { handleImageDeletion } from '@/utils/handleImageDeletion';

export const useImageManagement = (product) => {
    const { delete: deleteImage } = useForm();

    const handleDeleteImage = (imageId) => {
        handleImageDeletion(deleteImage, 'products.images.destroy', { product: product.id, imageId });
    };

    return { handleDeleteImage };
};