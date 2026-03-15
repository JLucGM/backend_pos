import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function DomainForm({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400">Configuración de Dominio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel value="Subdominio actual" />
                    <div className="mt-1 flex items-center p-2 bg-gray-50 dark:bg-gray-800 border rounded-md text-gray-600 dark:text-gray-400 text-sm italic">
                        {data.subdomain}.audaz.pos.test
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400">
                        Este es tu subdominio asignado por defecto.
                    </p>
                </div>

                <div>
                    <InputLabel htmlFor="domain" value="Dominio Personalizado" />
                    <TextInput
                        id="domain"
                        type="text"
                        placeholder="ejemplo.com"
                        value={data.domain || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('domain', e.target.value)}
                    />
                    <p className="mt-1 text-[10px] text-gray-500">
                        Si tienes un dominio propio, ingrésalo aquí para apuntar tu tienda.
                    </p>
                    <InputError message={errors.domain} className="mt-2" />
                </div>
            </div>
        </div>
    );
}
