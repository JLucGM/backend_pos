import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

export default function SettingsForm({ data, setting, setData, errors, currencies }) {

    const favicon = setting.media.find(mediaItem => mediaItem.collection_name === 'favicon');
    const logo = setting.media.find(mediaItem => mediaItem.collection_name === 'logo');
    const logofooter = setting.media.find(mediaItem => mediaItem.collection_name === 'logofooter');

    return (
        <>
            <div>
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
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="phone" value="Teléfono" />
                <TextInput
                    id="phone"
                    type="text"
                    name="phone"
                    value={data.phone}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="address" value="Dirección" />
                <TextInput
                    id="address"
                    type="text"
                    name="address"
                    value={data.address}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('address', e.target.value)}
                />
                <InputError message={errors.address} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="currency_id" value="Moneda" />
                <Select 
                    value={data.currency_id?.toString() || ''} 
                    onValueChange={(value) => setData('currency_id', parseInt(value))}
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencies?.map((currency) => (
                            <SelectItem key={currency.id} value={currency.id.toString()}>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{currency.symbol}</span>
                                    <span>{currency.name}</span>
                                    <span className="text-sm text-gray-500">({currency.code})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.currency_id} className="mt-2" />
                {setting.currency && (
                    <div className="mt-2 text-sm text-gray-600">
                        Moneda actual: {setting.currency.symbol} {setting.currency.name} ({setting.currency.code})
                    </div>
                )}
            </div>

            <div>
                <InputLabel htmlFor="logo" value="Logo" />
                <Input
                    id="logo"
                    type="file"
                    name="logo"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('logo', Array.from(e.target.files))}
                    multiple
                />
                <InputError message={errors.logo} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="favicon" value="Favicon" />
                <Input
                    id="favicon"
                    type="file"
                    name="favicon"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('favicon', Array.from(e.target.files))}
                    multiple
                />
                <InputError message={errors.favicon} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="logofooter" value="Logo Footer" />
                <Input
                    id="logofooter"
                    type="file"
                    name="logofooter"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('logofooter', Array.from(e.target.files))}
                    multiple
                />
                <InputError message={errors.logofooter} className="mt-2" />
            </div>

            <div>
                <h2>Favicon</h2>
                {favicon && (
                    <img
                        src={favicon.original_url}
                        alt={favicon.name}
                        className="w-10 h-10 object-cover rounded-full"
                    />
                )}
            </div>

            <div>
                <h2>Logo</h2>
                {logo && (
                    <img
                        src={logo.original_url}
                        alt={logo.name}
                        className="w-44 h-44 object-cover rounded-xl"
                    />
                )}
            </div>

            <div>
                <h2>Logo Footer</h2>
                {logofooter && (
                    <img
                        src={logofooter.original_url}
                        alt={logofooter.name}
                        className="w-44 h-44 object-cover rounded-xl"
                    />
                )}
            </div>
        </>
    );
}