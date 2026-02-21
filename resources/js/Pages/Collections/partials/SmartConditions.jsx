import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';

// ─── Opciones de campo y operador ──────────────────────────────────────────────
const FIELD_OPTIONS = [
    { value: 'category', label: 'Categoría' },
    { value: 'price', label: 'Precio' },
    { value: 'stock', label: 'Inventario' },
    { value: 'is_active', label: 'Estado' },
];

const OPERATORS_BY_FIELD = {
    category: [
        { value: 'is', label: 'es igual a' },
        { value: 'is_not', label: 'no es igual a' },
    ],
    price: [
        { value: 'greater_than', label: 'mayor que' },
        { value: 'less_than', label: 'menor que' },
        { value: 'equals', label: 'igual a' },
    ],
    stock: [
        { value: 'greater_than', label: 'mayor que' },
        { value: 'less_than', label: 'menor que' },
    ],
    is_active: [
        { value: 'is', label: 'es' },
    ],
};

const emptyCondition = () => ({ field: 'category', operator: 'is', value: [] });

// ─── Componente de una sola condición ──────────────────────────────────────────
function ConditionRow({ condition, index, categories, onChange, onRemove }) {
    const operators = OPERATORS_BY_FIELD[condition.field] ?? [];

    const handleField = (e) => {
        const field = e.target.value;
        const defaultOp = OPERATORS_BY_FIELD[field]?.[0]?.value ?? 'is';
        const defaultVal = field === 'is_active' ? true : field === 'category' ? [] : '';
        onChange(index, { field, operator: defaultOp, value: defaultVal });
    };

    const handleOperator = (e) => onChange(index, { ...condition, operator: e.target.value });

    const handleValue = (val) => onChange(index, { ...condition, value: val });

    // ── Renderizado del campo de valor según tipo ─────────────────────────────
    let valueField = null;

    if (condition.field === 'category') {
        valueField = (
            <div className="flex flex-wrap gap-1 flex-1">
                <select
                    className="flex-1 min-w-[140px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    onChange={(e) => {
                        const id = Number(e.target.value);
                        if (!condition.value.includes(id)) {
                            handleValue([...(condition.value ?? []), id]);
                        }
                    }}
                    value=""
                >
                    <option value="" disabled>Seleccionar categoría…</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    ))}
                </select>
                {(condition.value ?? []).map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return cat ? (
                        <Badge key={catId} variant="secondary" className="gap-1 cursor-pointer"
                            onClick={() => handleValue(condition.value.filter((id) => id !== catId))}>
                            {cat.category_name} ×
                        </Badge>
                    ) : null;
                })}
            </div>
        );
    } else if (condition.field === 'price' || condition.field === 'stock') {
        valueField = (
            <Input
                type="number"
                className="flex-1"
                placeholder="0"
                value={condition.value}
                onChange={(e) => handleValue(e.target.value)}
            />
        );
    } else if (condition.field === 'is_active') {
        valueField = (
            <select
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={condition.value ? 'true' : 'false'}
                onChange={(e) => handleValue(e.target.value === 'true')}
            >
                <option value="true">Publicado</option>
                <option value="false">Borrador</option>
            </select>
        );
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Campo */}
            <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={condition.field}
                onChange={handleField}
            >
                {FIELD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Operador */}
            <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={condition.operator}
                onChange={handleOperator}
            >
                {operators.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                ))}
            </select>

            {/* Valor */}
            {valueField}

            {/* Eliminar */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onRemove(index)}
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

// ─── Componente principal ───────────────────────────────────────────────────────
export default function SmartConditions({ data, setData, categories, smartProducts = [] }) {
    const { settings } = usePage().props;
    const [preview, setPreview] = useState(smartProducts);
    const [loading, setLoading] = useState(false);
    const [debounceId, setDebounceId] = useState(null);

    const conditions = data.conditions ?? [];
    const conditionsMatch = data.conditions_match ?? 'all';

    // ── Actualizar condición ────────────────────────────────────────────────
    const updateCondition = (index, updated) => {
        const next = conditions.map((c, i) => (i === index ? updated : c));
        setData('conditions', next);
    };

    const addCondition = () => setData('conditions', [...conditions, emptyCondition()]);

    const removeCondition = (index) => {
        setData('conditions', conditions.filter((_, i) => i !== index));
    };

    // ── Preview con debounce ────────────────────────────────────────────────
    const fetchPreview = useCallback(() => {
        setLoading(true);
        window.axios
            .post(route('collections.previewSmart'), {
                conditions: conditions,
                conditions_match: conditionsMatch,
            })
            .then((res) => setPreview(res.data.products))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [conditions, conditionsMatch]);

    useEffect(() => {
        if (debounceId) clearTimeout(debounceId);
        const id = setTimeout(() => {
            if (conditions.length > 0) fetchPreview();
            else setPreview([]);
        }, 600);
        setDebounceId(id);
        return () => clearTimeout(id);
    }, [conditions, conditionsMatch]);

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Condiciones</CardTitle>
                        {/* Operador global */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Los productos deben cumplir</span>
                            <select
                                className="h-8 rounded-md border border-input bg-background px-2 py-0.5 text-sm shadow-sm"
                                value={conditionsMatch}
                                onChange={(e) => setData('conditions_match', e.target.value)}
                            >
                                <option value="all">TODAS</option>
                                <option value="any">ALGUNA</option>
                            </select>
                            <span className="text-muted-foreground">las condiciones</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {conditions.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                            Sin condiciones. Los productos no se filtrarán automáticamente.
                        </p>
                    )}
                    {conditions.map((condition, index) => (
                        <ConditionRow
                            key={index}
                            condition={condition}
                            index={index}
                            categories={categories}
                            onChange={updateCondition}
                            onRemove={removeCondition}
                        />
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                        <Plus className="size-4 mr-1" /> Añadir condición
                    </Button>
                </CardContent>
            </Card>

            {/* Preview de productos coincidentes */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        Vista previa
                        {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                        {!loading && (
                            <span className="text-sm font-normal text-muted-foreground">
                                {preview.length} producto{preview.length !== 1 ? 's' : ''} coinciden
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {preview.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                            {conditions.length === 0
                                ? 'Añade condiciones para ver los productos que coincidan.'
                                : 'Ningún producto cumple las condiciones actuales.'}
                        </p>
                    ) : (
                        <div className="border rounded-md divide-y max-h-72 overflow-y-auto">
                            {preview.slice(0, 50).map((product) => (
                                <div key={product.id} className="flex items-center gap-2 p-2">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.product_name}
                                            className="size-8 rounded object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs shrink-0">?</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-medium truncate">{product.product_name}</p>
                                            {product.has_variants && (
                                                <Badge variant="secondary" className="text-xs px-1 py-0 shrink-0">
                                                    {product.variants_count} var.
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            {product.min_price !== undefined && product.max_price !== undefined ? (
                                                product.min_price === product.max_price ? (
                                                    <CurrencyDisplay currency={settings.currency} amount={product.min_price} />
                                                ) : (
                                                    <>
                                                        <CurrencyDisplay currency={settings.currency} amount={product.min_price} />
                                                        <span>–</span>
                                                        <CurrencyDisplay currency={settings.currency} amount={product.max_price} />
                                                    </>
                                                )
                                            ) : (
                                                <CurrencyDisplay currency={settings.currency} amount={product.product_price} />
                                            )}
                                            <span>·</span>
                                            <span className={product.total_stock === 0 ? 'text-destructive' : ''}>
                                                {product.total_stock} en stock
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
