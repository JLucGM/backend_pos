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
import { useSelectOptions } from '@/hooks/useSelectOptions';

export default function UserForm({ data, setData, errors, roles, role, user = "" }) {
        const { statusOptions } = useSelectOptions();
    
    return (
        <>
            {/* {user.avatar ? ( */}

            {/* // <div className="w-[350px] mx-auto col-span-full">
                //     <AspectRatio ratio={14 / 9}>
                //         <img className='rounded-xl object-cover' src={user.avatar} alt="Avatar" />
                //     </AspectRatio>

                // </div> */}
            {/* ) : (
                null
            )} */}

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
                        <InputLabel htmlFor="is_active" value="Estado" />
                        <Select
                            options={statusOptions}
                            name="is_active"
                            value={statusOptions.find(option => option.value === Number(data.is_active))}
                            onChange={(selectedOption) => setData('is_active', selectedOption.value)}
                            styles={customStyles} // si usas estilos personalizados
                            className="mt-1"
                        />
                        <InputError message={errors.is_active} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Rol" />
                        <Select
                            name="role"
                            id="role"
                            options={roles.map(role => ({ value: role.id, label: role.name }))}
                            value={roles.length > 0 ? roles.map(role => ({ value: role.id, label: role.name })).find(option => option.value === data.role) : null}
                            onChange={(selectedOption) => setData('role', selectedOption ? selectedOption.value : null)}
                            styles={customStyles}
                        />
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    {/* <div>
                        <InputLabel htmlFor="store" value="Tiendas" />
                        <Select
                            name="store_id"
                            id="store"
                            options={stores.length > 0 ? stores.map(store => ({ value: store.id, label: store.store_name })) : []}
                            value={stores.length > 0 ? stores.map(store => ({ value: store.id, label: store.store_name })).find(option => option.value === data.store_id) : null}
                            onChange={(selectedOption) => setData('store_id', selectedOption ? selectedOption.value : null)}
                            styles={customStyles}
                        />
                        <InputError message={errors.store_id} className="mt-2" />
                    </div> */}
                </DivSection>

            </div>
        </>
    );
}