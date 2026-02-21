import React, { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Search, X, GripVertical, Plus } from 'lucide-react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

// ── Helper: calcula stock total igual que Products/Columns.jsx ────────────────
function getStockInfo(product) {
    const stocks = product.stocks ?? [];
    const combinations = product.combinations ?? [];

    if (combinations.length > 0) {
        const totalQty = stocks.reduce((sum, s) => sum + parseFloat(s.quantity ?? 0), 0);
        const varCount = combinations.length;
        return {
            label: `${totalQty} disponibles en ${varCount} variante${varCount !== 1 ? 's' : ''}`,
            isLow: totalQty === 0,
            hasVariants: true,
            varCount,
        };
    }
    const qty = stocks.length > 0 ? parseFloat(stocks[0].quantity ?? 0) : 0;
    return { label: `${qty} en stock`, isLow: qty === 0, hasVariants: false, varCount: 0 };
}

// ── Componente: precio display con moneda ─────────────────────────────────────
function PriceDisplay({ product, currency }) {
    const combinations = product.combinations ?? [];
    if (combinations.length > 0) {
        const prices = combinations.map((c) => parseFloat(c.combination_price ?? 0));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min === max) {
            return <CurrencyDisplay currency={currency} amount={min} />;
        }
        return (
            <>
                <CurrencyDisplay currency={currency} amount={min} />
                {' – '}
                <CurrencyDisplay currency={currency} amount={max} />
            </>
        );
    }
    return <CurrencyDisplay currency={currency} amount={product.product_price} />;
}

export default function ManualProducts({ data, setData, products }) {
    const { settings } = usePage().props;
    const [search, setSearch] = useState('');
    const selectedIds = data.product_ids ?? [];

    /* Producots disponibles filtrados por búsqueda */
    const available = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter(
            (p) => !selectedIds.includes(p.id) && p.product_name.toLowerCase().includes(q)
        );
    }, [products, selectedIds, search]);

    /* Objetos seleccionados en orden */
    const selectedProducts = useMemo(
        () => selectedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
        [selectedIds, products]
    );

    const addProduct = (id) => setData('product_ids', [...selectedIds, id]);
    const removeProduct = (id) => setData('product_ids', selectedIds.filter((x) => x !== id));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Productos de la colección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Buscar producto…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Resultados de búsqueda */}
                {search.length > 0 && (
                    <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                        {available.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-3">Sin resultados.</p>
                        ) : (
                            available.slice(0, 20).map((product) => {
                                const stock = getStockInfo(product);
                                return (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-2 hover:bg-muted/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {product.media?.[0] ? (
                                                <img
                                                    src={product.media[0].original_url}
                                                    alt={product.product_name}
                                                    className="size-8 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">?</div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium leading-tight">{product.product_name}</p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-xs text-muted-foreground">
                                                        <PriceDisplay product={product} currency={settings.currency} />
                                                    </span>
                                                    {stock.hasVariants && (
                                                        <Badge variant="secondary" className="text-xs px-1 py-0">
                                                            {stock.varCount} variante{stock.varCount !== 1 ? 's' : ''}
                                                        </Badge>
                                                    )}
                                                    <span className={`text-xs ${stock.isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                        · {stock.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => addProduct(product.id)}>
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Lista de seleccionados */}
                <div className="space-y-1">
                    {selectedProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6 border rounded-md border-dashed">
                            Busca y añade productos a esta colección.
                        </p>
                    ) : (
                        <>
                            <p className="text-xs text-muted-foreground mb-2">
                                {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} en la colección
                            </p>
                            <div className="border rounded-md divide-y">
                                {selectedProducts.map((product, index) => {
                                    const stock = getStockInfo(product);
                                    return (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-2 p-2 hover:bg-muted/20 transition-colors"
                                        >
                                            <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
                                            {product.media?.[0] ? (
                                                <img
                                                    src={product.media[0].original_url}
                                                    alt={product.product_name}
                                                    className="size-8 rounded object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="size-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                                                    {index + 1}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-sm font-medium truncate">{product.product_name}</p>
                                                    {stock.hasVariants && (
                                                        <Badge variant="secondary" className="text-xs px-1 py-0 shrink-0">
                                                            {stock.varCount} var.
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className={`text-xs ${stock.isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    <PriceDisplay product={product} currency={settings.currency} /> · {stock.label}
                                                </p>
                                            </div>
                                            <Button
                                                type="button" size="icon" variant="ghost"
                                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeProduct(product.id)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
