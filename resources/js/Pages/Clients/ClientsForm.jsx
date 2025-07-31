import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { AspectRatio } from '@/Components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import DivSection from '@/Components/ui/div-section';
import { Input } from '@/Components/ui/input';
// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Select from 'react-select';
import { customStyles } from '@/hooks/custom-select';

export default function ClientsForm({ data, setData, errors, user = "" }) {
    return (
        <>
            
            <div className="col-span-full flex justify-center">

                <Avatar className="h-56 w-56 ">
                    <AvatarImage className="h-56 w-56 object-cover" src={user.avatar_url} />
                    <AvatarFallback className="h-56 w-56 object-cover bg-slate-200 border-2 border-slate-400">
                        <p className='text-3xl' >CN</p>
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="col-span-1 md:col-span-2">

                <DivSection className='my-4'>
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
                            type="text"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="identification" value="identification" />
                        <TextInput
                            id="identification"
                            type="text"
                            name="identification"
                            value={data.identification}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('identification', e.target.value)}
                        />
                        <InputError message={errors.identification} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="text"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Teléfono" />
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

                </DivSection>
            </div>

            <div className="col-span-1">

                <DivSection className='my-4'>
                    <div>
                        <InputLabel htmlFor="avatar" value="Avatar" />
                        <Input
                            id="avatar"
                            type="file"
                            name="avatar"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('avatar', e.target.files[0])}
                        />
                        <InputError message={errors.avatar} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Estado" />
                        <select
                            name="status"
                            id="status"
                            value={data.status}
                            className="border-gray-300 w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-full"
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value={0}>Inactivo</option>
                            <option value={1}>Activo</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                </DivSection>

            </div>
        </>
    );
}