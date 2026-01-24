import { Checkbox } from '@/Components/ui/checkbox';
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import Select from 'react-select';
import { useEffect, useState } from 'react'; // Importa useEffect y useState

export default function UserInfo({
  orders,
  userOptions,
  selectedUser,
  handleUserChange,
  customStyles,
  deliveryLocations = [],
  data,
  setData,
  errors,
  isDisabled,
}) {
  // Estado local para manejar el checkbox seleccionado
  const [selectedLocationId, setSelectedLocationId] = useState(data.delivery_location_id);
  
  // Sincroniza cuando cambia data.delivery_location_id
  useEffect(() => {
    setSelectedLocationId(data.delivery_location_id);
  }, [data.delivery_location_id]);
  
  // También sincroniza si orders tiene un delivery_location_id pero data no
  useEffect(() => {
    if (orders?.delivery_location_id && !data.delivery_location_id) {
      setData('delivery_location_id', orders.delivery_location_id);
      setSelectedLocationId(orders.delivery_location_id);
    }
  }, [orders, data.delivery_location_id, setData]);
  
  const handleLocationChange = (locationId) => {
    setSelectedLocationId(locationId);
    setData('delivery_location_id', locationId);
  };
  
  return (
    <div>
      <h2 className="font-semibold text-lg">Cliente</h2>
      
      <div className="mt-2">
        <InputLabel htmlFor="user_id" value="Seleccionar Usuario" />
        <Select
          id="user_id"
          name="user_id"
          options={userOptions}
          value={selectedUser}
          onChange={handleUserChange}
          styles={customStyles}
          placeholder="Seleccionar usuario."
          isClearable={true}
          isDisabled={isDisabled}
        />
        <InputError message={errors.user_id} className="mt-2" />
      </div>

      {data.delivery_type === 'delivery' && (
        <div className="mt-4">
          <InputLabel htmlFor="delivery_location_id" value="Direcciones de Entrega" />
          {deliveryLocations.length > 0 ? (
            <div className="space-y-3 mt-2">
              {deliveryLocations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location.id}`}
                    checked={selectedLocationId === location.id}
                    onCheckedChange={(checked) => {
                      handleLocationChange(checked ? location.id : null);
                    }}
                    disabled={isDisabled}
                  />
                  <label
                    htmlFor={`location-${location.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                  >
                    <div className="flex flex-col">
                      <div className="gap-2">
                        {!!location.is_default && (
                          <p className="text-muted-foreground text-xs">Dirección predeterminada</p>
                        )}
                        <p className="font-medium">
                          {location.address_line_1}
                          {location.address_line_2 && `, ${location.address_line_2}`}
                        </p>
                      </div>
                      {location.postal_code && (
                        <span className="text-muted-foreground text-xs">Código postal: {location.postal_code}</span>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              {data.user_id
                ? 'Este usuario no tiene direcciones registradas'
                : 'Seleccione un usuario para ver sus direcciones'}
            </p>
          )}
          <InputError message={errors.delivery_location_id} className="mt-2" />
        </div>
      )}
    </div>
  );
}