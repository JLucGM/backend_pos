import { toast } from 'sonner';

/**
 * Maneja la eliminación de una imagen usando Inertia.
 * @param {Function} deleteImage - Función de Inertia para eliminar.
 * @param {string} routeName - Nombre de la ruta (e.g., 'products.images.destroy').
 * @param {Object} params - Parámetros para la ruta (e.g., { product: product.id, imageId }).
 * @param {Function} onSuccess - Callback opcional para éxito.
 * @param {Function} onError - Callback opcional para error.
 */
export const handleImageDeletion = (deleteImage, routeName, params, onSuccess = () => {}, onError = () => {}) => {
    deleteImage(route(routeName, params), {
        onSuccess: () => {
            toast("Imagen eliminada con éxito.");
            onSuccess();
        },
        onError: (error) => {
            console.error("Error deleting image:", error);
            toast.error("Error al eliminar la imagen.");
            onError(error);
        }
    });
};