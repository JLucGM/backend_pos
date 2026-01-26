# Guía de Componentes de Suscripción

## Componentes Creados

### 1. SubscriptionPlanCard
Componente reutilizable para mostrar tarjetas de planes de suscripción.

**Props:**
- `plan` (object, required): Objeto del plan de suscripción
- `billingCycle` (string, default: 'monthly'): Ciclo de facturación ('monthly' | 'yearly')
- `isSelected` (boolean, default: false): Si la tarjeta está seleccionada
- `isCurrentPlan` (boolean, default: false): Si es el plan actual del usuario
- `onSelect` (function): Función callback cuando se selecciona el plan
- `processing` (boolean, default: false): Estado de procesamiento
- `showSelectButton` (boolean, default: true): Mostrar botón de selección
- `buttonText` (string): Texto personalizado del botón
- `buttonVariant` (string): Variante personalizada del botón

**Ejemplo de uso:**
```jsx
<SubscriptionPlanCard
    plan={plan}
    billingCycle="monthly"
    isCurrentPlan={isCurrentPlan(plan)}
    onSelect={handleSelectPlan}
    processing={processing}
/>
```

### 2. BillingCycleSelector
Componente para seleccionar el ciclo de facturación (mensual/anual).

**Props:**
- `billingCycle` (string, required): Ciclo actual ('monthly' | 'yearly')
- `onCycleChange` (function, required): Función callback para cambiar el ciclo
- `showSavingsBadge` (boolean, default: true): Mostrar badge de ahorro
- `savingsText` (string, default: "Ahorra 2 meses"): Texto del badge de ahorro

**Ejemplo de uso:**
```jsx
<BillingCycleSelector 
    billingCycle={billingCycle}
    onCycleChange={setBillingCycle}
/>
```

## Campo is_featured en la Base de Datos

### Migración
Se agregó el campo `is_featured` a la tabla `subscription_plans`:
```php
$table->boolean('is_featured')->default(false); // Plan destacado/popular
```

### Modelo SubscriptionPlan
Se agregaron:
- Campo `is_featured` al array `$fillable`
- Cast `'is_featured' => 'boolean'`
- Scope `scopeFeatured()` para filtrar planes destacados

### Seeder
El plan "Profesional" está marcado como destacado (`is_featured: true`).

## Funcionalidades Implementadas

### 1. Plan Destacado Dinámico
- Los planes con `is_featured: true` muestran un badge "Más Popular"
- Estilo visual diferenciado (borde púrpura, sombra)
- Botón con colores destacados

### 2. Componentes Reutilizables
- `SubscriptionPlanCard`: Usado en Index y Register
- `BillingCycleSelector`: Usado en ambas páginas
- Consistencia visual y funcional

### 3. Flexibilidad
- Fácil cambio de plan destacado desde la base de datos
- Componentes configurables con props
- Estilos adaptativos según el tipo de plan

## Páginas Actualizadas

### 1. resources/js/Pages/Subscriptions/Index.jsx
- Usa `SubscriptionPlanCard` para mostrar planes
- Usa `BillingCycleSelector` para cambiar ciclo
- Plan destacado se muestra dinámicamente

### 2. resources/js/Pages/Auth/Register.jsx
- Mismos componentes reutilizados
- Integración con formulario de registro
- Selección de plan opcional

## Ventajas de la Implementación

1. **Dinámico**: El plan destacado se controla desde la base de datos
2. **Reutilizable**: Componentes usados en múltiples páginas
3. **Mantenible**: Cambios centralizados en los componentes
4. **Escalable**: Fácil agregar nuevos tipos de planes o características
5. **Consistente**: UI uniforme en toda la aplicación

## Próximos Pasos Sugeridos

1. Crear panel de administración para gestionar planes destacados
2. Agregar más campos dinámicos (colores, iconos personalizados)
3. Implementar A/B testing para diferentes planes destacados
4. Agregar animaciones y transiciones mejoradas