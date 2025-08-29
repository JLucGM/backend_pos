import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import { Checkbox } from '@/Components/ui/checkbox';

export default function UserInfo({
  orders,
  userOptions,
  selectedUser,
  handleUserChange,
  customStyles,
  deliveryLocations,
  data,
  setData,
  errors,
  isDisabled,
}) {
  return (
    <div>
      <h2 className="font-semibold text-lg">Usuario</h2>
      {orders && orders.user ? (
        <div className="mt-2">
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre:</p>
          <span className="text-gray-900 dark:text-gray-100">{orders.user.name}</span>

          {orders.user.email && (
            <>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Email:</p>
              <span className="text-gray-900 dark:text-gray-100">{orders.user.email}</span>
            </>
          )}

          {orders.user.phone && (
            <>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Teléfono:</p>
              <span className="text-gray-900 dark:text-gray-100">{orders.user.phone}</span>
            </>
          )}

          {orders.user.identification && (
            <>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Identificación:</p>
              <span className="text-gray-900 dark:text-gray-100">{orders.user.identification}</span>
            </>
          )}

          {orders.delivery_location ? (
            <>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Dirección:</p>
              <span className="text-gray-900 dark:text-gray-100">{orders.delivery_location.address_line_1}</span>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">No hay dirección de entrega disponible.</p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2">
            <InputLabel htmlFor="user_id" value="Seleccionar Usuario" />
            <Select
              id="user_id"
              name="user_id"
              options={userOptions}
              value={selectedUser}
              onChange={handleUserChange}
              styles={customStyles}
              placeholder="Buscar o seleccionar usuario..."
              isClearable={true}
              isDisabled={isDisabled}
            />
            <InputError message={errors.user_id} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="delivery_location_id" value="Direcciones de Entrega" />
            {deliveryLocations.length > 0 ? (
              <div className="space-y-3 mt-2">
                {deliveryLocations.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location.id}`}
                      checked={data.delivery_location_id === location.id}
                      onCheckedChange={(checked) => {
                        setData('delivery_location_id', checked ? location.id : null);
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
        </>
      )}
    </div>
  );
}
