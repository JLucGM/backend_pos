import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Asegúrate de que la ruta sea correcta
import DeliveryLocationForm from "./DeliveryLocationForm";

export default function AddressDialog({ isOpen, onOpenChange, user, location, countries, states, cities, onSuccess }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="flex flex-col gap-4"> {/* Añadimos un div contenedor aquí */}
                    <DialogHeader>
                        <DialogTitle>
                            {location ? "Editar Dirección de Envío" : "Agregar Nueva Dirección"}
                        </DialogTitle>
                        <DialogDescription>
                            {location
                                ? "Actualiza los detalles de esta dirección de envío."
                                : "Agrega una nueva dirección para recibir pedidos."}
                        </DialogDescription>
                    </DialogHeader>
                    <DeliveryLocationForm
                        user={user}
                        location={location}
                        countries={countries}
                        states={states}
                        cities={cities}
                        onCancel={onOpenChange}
                        onSuccess={() => {
                            onSuccess();
                            onOpenChange(false);
                        }}
                    />
                </div> {/* Cerramos el div contenedor */}
            </DialogContent>
        </Dialog>
    );
}