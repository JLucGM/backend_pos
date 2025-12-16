import React, { useState, useCallback } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
// Importamos buildTree para inicializar y SortableTree
import SortableTree, { buildTree } from './partials/SortableTree';
import DivSection from '@/Components/ui/div-section';
import { PlusCircle } from 'lucide-react';

export default function MenusForm({ data, setData, errors, dynamicPages }) {

    // 1. Inicialización del árbol: Convierte la lista plana (data.items) en estructura anidada.
    const [treeItems, setTreeItems] = useState(() => buildTree(data.items || []));

    // 2. Callback para actualizar el estado del árbol y sincronizar con Inertia
    const handleTreeChange = useCallback((newTree) => {
        setTreeItems(newTree);

        // 🚨 FUNCIÓN CRÍTICA: Prepara los datos ANIDADOS para el backend.
        const cleanTreeForSubmit = (nodes) => {
            return nodes.map((node, index) => ({
                // Si el ID es temporal (string 'temp-...'), enviamos null para que Laravel cree uno nuevo
                id: (typeof node.id === 'string' && node.id.startsWith('temp-')) ? null : node.id,
                title: node.title,
                url: node.url,
                order: index,
                // RECURSIVIDAD: Incluimos los hijos (limpios)
                children: node.children ? cleanTreeForSubmit(node.children) : []
            }));
        };

        const nestedItems = cleanTreeForSubmit(newTree);

        // 3. Enviamos la estructura ANIDADA a Inertia (data.items)
        setData('items', nestedItems);
    }, [setData]);

    const addItem = () => {
        const newItem = {
            id: `temp-${Date.now()}`, // ID temporal para React
            title: '',
            url: '',
            children: [],
            parent_id: null,
        };
        const newTree = [...treeItems, newItem];
        handleTreeChange(newTree);
    };

    return (
        <div className="space-y-6">
            <DivSection>
                <InputLabel htmlFor="name" value="Nombre del Menú" />
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.name} className="mt-2" />
            </DivSection>

            <DivSection>

                <div className="">
                    <SortableTree
                        treeItems={treeItems}
                        onTreeChange={handleTreeChange}
                        errors={errors}
                        dynamicPages={dynamicPages}
                    />
                </div>
                <Button variant="outline" size="sm" type="button" onClick={addItem} className="mb-4 flex gap-2 w-full">
                    <PlusCircle className="size-4" /> Agregar Elemento
                </Button>
            </DivSection>
        </div>
    );
}