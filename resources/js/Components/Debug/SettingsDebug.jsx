import React from 'react';
import { usePage } from '@inertiajs/react';

export default function SettingsDebug() {
    const { settings } = usePage().props;
    
    return (
        <div className="p-4 bg-gray-100 border rounded mb-4">
            <h3 className="font-bold mb-2">Debug Settings:</h3>
            <pre className="text-xs overflow-auto">
                {JSON.stringify(settings, null, 2)}
            </pre>
        </div>
    );
}