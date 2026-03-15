import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Checkbox } from '@/Components/ui/checkbox';

export default function RolesForm({ data, setData, errors, permissionsList }) {

    const handlePermissionChange = (permissionId, checked) => {
        const currentPermissions = [...(data.permissions || [])];
        if (checked) {
            setData('permissions', [...currentPermissions, permissionId]);
        } else {
            setData('permissions', currentPermissions.filter(id => id !== permissionId));
        }
    };

    // Agrupar permisos por prefijo (ej: admin.user, admin.products) para mejor visualización
    const groupedPermissions = (permissionsList || []).reduce((acc, permission) => {
        const parts = permission.name.split('.');
        const group = parts.length > 1 ? parts[1] : 'otros';
        if (!acc[group]) acc[group] = [];
        acc[group].push(permission);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="">
                <InputLabel htmlFor="name" value="Nombre del Rol" />
                <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="block w-full mt-1"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel value="Permisos" className="text-lg font-bold mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(groupedPermissions).map(([group, permissions]) => (
                        <div key={group} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="capitalize font-semibold text-sm text-gray-700 dark:text-gray-300 border-b mb-3 pb-1">
                                {group}
                            </h3>
                            <div className="space-y-2">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={(data.permissions || []).includes(permission.id)}
                                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                                        />
                                        <label
                                            htmlFor={`perm-${permission.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {permission.description || permission.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <InputError message={errors.permissions} className="mt-4" />
            </div>
        </div>
    );
}
