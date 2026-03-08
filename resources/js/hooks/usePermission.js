import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props;

    /**
     * Verifica si el usuario tiene un permiso específico.
     * Siempre retorna true si es Super Admin.
     */
    const can = (permission) => {
        if (auth.isSuperAdmin) return true;
        return auth.permissions.includes(permission);
    };

    /**
     * Verifica si el usuario tiene todos los permisos en una lista.
     */
    const canAll = (permissions) => {
        if (auth.isSuperAdmin) return true;
        return permissions.every(p => auth.permissions.includes(p));
    };

    /**
     * Verifica si el usuario tiene al menos uno de los permisos en una lista.
     */
    const canAny = (permissions) => {
        if (auth.isSuperAdmin) return true;
        return permissions.some(p => auth.permissions.includes(p));
    };

    /**
     * Verifica si el usuario tiene un rol específico.
     */
    const hasRole = (role) => {
        if (auth.isSuperAdmin) return true;
        return auth.roles.includes(role);
    };

    return { 
        can, 
        canAll, 
        canAny, 
        hasRole, 
        isSuperAdmin: auth.isSuperAdmin,
        user: auth.user,
        roles: auth.roles,
        permissions: auth.permissions
    };
}
