import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import SeoFields from '@/Components/SeoFields';
import ManualProducts from './partials/ManualProducts';
import SmartConditions from './partials/SmartConditions';

export default function CollectionForm({ data, setData, errors, products, categories, smartProducts = [], collection = null }) {

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {/* ── Columna principal ─────────────────────────────────────────── */}
            <div className="md:col-span-2 space-y-4">

                {/* Información básica */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Información de la colección</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Ej: Ropa de verano, Ofertas del mes…"
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descripción opcional de la colección…"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tipo de colección */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tipo de colección</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('type', 'manual')}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${data.type === 'manual'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <p className="font-semibold text-sm">Manual</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Añade productos uno a uno. Ideal para colecciones de promociones o selecciones especiales.
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('type', 'smart')}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${data.type === 'smart'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <p className="font-semibold text-sm">Inteligente</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Define condiciones automáticas (categoría, precio, inventario). Los productos se agregan solos.
                                </p>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Productos – sección condicional */}
                {data.type === 'manual' ? (
                    <ManualProducts
                        data={data}
                        setData={setData}
                        products={products}
                    />
                ) : (
                    <SmartConditions
                        data={data}
                        setData={setData}
                        categories={categories}
                        smartProducts={smartProducts}
                    />
                )}
            </div>

            {/* ── Columna lateral ───────────────────────────────────────────── */}
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Estado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active" className="cursor-pointer">
                                {data.is_active ? 'Activa' : 'Inactiva'}
                            </Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(val) => setData('is_active', val)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Vigencia (opcional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="starts_at">Fecha de inicio</Label>
                            <Input
                                id="starts_at"
                                type="date"
                                value={data.starts_at}
                                onChange={(e) => setData('starts_at', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="ends_at">Fecha de fin</Label>
                            <Input
                                id="ends_at"
                                type="date"
                                value={data.ends_at}
                                onChange={(e) => setData('ends_at', e.target.value)}
                            />
                            {errors.ends_at && <p className="text-sm text-destructive">{errors.ends_at}</p>}
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div className="col-span-full md:col-span-2">
                <SeoFields
                    data={data}
                    setData={setData}
                    errors={errors}
                    autoGenerateFromFields={{
                        title: data.title,
                        description: data.description,
                        image: collection?.media?.[0]?.original_url,
                    }}
                />
            </div>
        </div>
    );
}
