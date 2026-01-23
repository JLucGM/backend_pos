# Componente Success

Este componente muestra la página de éxito después de completar una orden en el checkout.

## Características

- Muestra información detallada de la orden
- Resumen de productos ordenados
- Información de entrega y pago
- Botones de acción personalizables
- Totalmente personalizable desde el Builder

## Uso en el Builder

1. Agregar el componente "Página de Éxito" desde el diálogo de agregar componentes
2. Personalizar textos, colores y botones desde el panel de edición
3. El componente mostrará datos de ejemplo en el Builder
4. En el frontend, mostrará los datos reales de la orden

## Props principales

- `order`: Objeto con los datos de la orden
- `companyId`: ID de la empresa
- `mode`: 'builder' o 'frontend'

## Personalización

El componente permite personalizar:
- Títulos y subtítulos
- Colores de texto e iconos
- Botones de acción
- Mensajes adicionales
- Espaciado y diseño

## Integración con el Checkout

Después de procesar una orden exitosamente, el CheckoutController redirige a la página de éxito que renderiza este componente con los datos reales de la orden.