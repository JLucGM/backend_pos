import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Input } from '@/Components/ui/input';

export default function GeneralForm({ data, setting, setData, errors }) {
    const favicon = setting.media.find(mediaItem => mediaItem.collection_name === 'favicon');
    const logo = setting.media.find(mediaItem => mediaItem.collection_name === 'logo');
    const logofooter = setting.media.find(mediaItem => mediaItem.collection_name === 'logofooter');

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información General</h3>
                    <div>
                        <InputLabel htmlFor="name" value="Nombre del Comercio" />
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
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t pt-6">
                <div>
                    <InputLabel htmlFor="logo" value="Logo Principal" />
                    <Input
                        id="logo"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('logo', Array.from(e.target.files))}
                    />
                    {logo && <img src={logo.original_url} className="mt-2 w-20 h-20 object-contain border rounded" />}
                </div>

                <div>
                    <InputLabel htmlFor="favicon" value="Favicon" />
                    <Input
                        id="favicon"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('favicon', Array.from(e.target.files))}
                    />
                    {favicon && <img src={favicon.original_url} className="mt-2 w-8 h-8 object-contain border rounded" />}
                </div>

                <div>
                    <InputLabel htmlFor="logofooter" value="Logo Footer" />
                    <Input
                        id="logofooter"
                        type="file"
                        className="mt-1"
                        onChange={(e) => setData('logofooter', Array.from(e.target.files))}
                    />
                    {logofooter && <img src={logofooter.original_url} className="mt-2 w-20 h-20 object-contain border rounded" />}
                </div>
            </div>
        </>
    );
}
