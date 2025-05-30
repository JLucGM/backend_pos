import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsForm({ data, setting, setData, errors }) {

    const favicon = setting.media.find(mediaItem => mediaItem.collection_name === 'favicon');
    const logo = setting.media.find(mediaItem => mediaItem.collection_name === 'logo');
    const logofooter = setting.media.find(mediaItem => mediaItem.collection_name === 'logofooter');

    return (
        <>
            {/* <Tabs defaultValue="account" className="flex">
                <TabsList className="flex flex-col h-full">
                    <TabsTrigger value="account" className="w-full text-wrap">Account</TabsTrigger>
                    <TabsTrigger value="password" className="w-full text-wrap">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs> */}

            <div>
                {/* setting{setting.app_name} */}
                <InputLabel htmlFor="name" value="Nombre" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="email" value="Correo" />
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="phone" value="Telefono" />
                <TextInput
                    id="phone"
                    type="text"
                    name="phone"
                    value={data.phone}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="address" value="address" />
                <TextInput
                    id="address"
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} className="mt-2" />
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

            <div>
                <InputLabel htmlFor="logo" value="Logo" />
                <Input
                    id="logo"
                    type="file"
                    name="logo"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('logo', Array.from(e.target.files))} // Almacena todos los archivos
                    multiple
                />
                <InputError message={errors.logo} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="favicon" value="favicon" />
                <Input
                    id="favicon"
                    type="file"
                    name="favicon"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('favicon', Array.from(e.target.files))} // Almacena todos los archivos
                    multiple
                />
                <InputError message={errors.favicon} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="logofooter" value="logofooter" />
                <Input
                    id="logofooter"
                    type="file"
                    name="logofooter"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('logofooter', Array.from(e.target.files))} // Almacena todos los archivos
                    multiple
                />
                <InputError message={errors.logofooter} className="mt-2" />
            </div>


            <div>
                <h2>Favicon</h2>
                {favicon && (
                    <img
                        src={favicon.original_url} // URL del favicon
                        alt={favicon.name} // Nombre del favicon
                        className="w-10 h-10 object-cover rounded-full"
                    />
                )}
            </div>

            <div>
                <h2>Logo</h2>
                {logo && (
                    <img
                        src={logo.original_url} // URL del logo
                        alt={logo.name} // Nombre del logo
                        className="w-44 h-44 object-cover rounded-xl"
                    />
                )}
            </div>

            <div>
                <h2>logofooter</h2>
                {logofooter && (
                    <img
                        src={logofooter.original_url} // URL del logofooter
                        alt={logofooter.name} // Nombre del logofooter
                        className="w-44 h-44 object-cover rounded-xl"
                    />
                )}
            </div>
        </>
    );
}