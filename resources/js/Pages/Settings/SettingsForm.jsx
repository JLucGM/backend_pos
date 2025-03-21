import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';

export default function SettingsForm({ data, setting, setData, errors }) {
    return (
        <>
            <div>
                <InputLabel htmlFor="app_name" value="Nombre" />
                <TextInput
                    id="app_name"
                    type="text"
                    name="app_name"
                    value={data.app_name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('app_name', e.target.value)}
                />
                <InputError message={errors.app_name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="admin_email" value="Correo" />
                <TextInput
                    id="admin_email"
                    type="email"
                    name="admin_email"
                    value={data.admin_email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('admin_email', e.target.value)}
                />
                <InputError message={errors.admin_email} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="admin_phone" value="Telefono" />
                <TextInput
                    id="admin_phone"
                    type="text"
                    name="admin_phone"
                    value={data.admin_phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('admin_phone', e.target.value)}
                />
                <InputError message={errors.admin_phone} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="shipping_base_price" value="shipping_base_price" />
                <TextInput
                    id="shipping_base_price"
                    type="text"
                    name="shipping_base_price"
                    value={data.shipping_base_price}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('shipping_base_price', e.target.value)}
                />
                <InputError message={errors.shipping_base_price} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="default_currency" value="default_currency" />
                <TextInput
                    id="default_currency"
                    type="text"
                    name="default_currency"
                    value={data.default_currency}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('default_currency', e.target.value)}
                />
                <InputError message={errors.default_currency} className="mt-2" />
            </div>

            {/* <div>
                <InputLabel htmlFor="logo" value="Media" />
                <Input
                    id="logo"
                    type="file"
                    name="logo"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('logo', Array.from(e.target.files))} // Almacena todos los archivos
                    multiple
                />
                <InputError message={errors.logo} className="mt-2" />
            </div> */}

            {/* {setting.media && setting.media.length > 0 && (
                // <p>{setting.media[0].original_url}</p>
                <img
                    src={setting.media[0].original_url} // Asegúrate de que esto sea correcto
                    alt={setting.media[0].name} // Asegúrate de que esto sea correcto
                    className="w-44 h-44 object-cover rounded-xl aspect-square"
                />
            )} */}
        </>
    );
}