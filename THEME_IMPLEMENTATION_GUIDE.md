# Guía de Implementación de Temas

Esta guía explica cómo usar correctamente los valores por defecto del tema en los componentes del Builder y en toda la aplicación.

## Resumen de Cambios Implementados

### 1. Utilidades del Tema (`resources/js/utils/themeUtils.jsx`)

Se han agregado las siguientes funciones:

- `getDefaultThemeSettings()`: Proporciona todos los valores por defecto del tema basados en el ThemeSeeder
- `getThemeWithDefaults(themeSettings)`: Combina los valores actuales del tema con los valores por defecto
- Todas las funciones existentes ahora usan automáticamente los valores por defecto

### 2. Hook Personalizado (`resources/js/hooks/useTheme.jsx`)

Un hook que simplifica el uso de temas en componentes:

```jsx
import { useTheme } from '@/hooks/useTheme';

const MyComponent = ({ themeSettings }) => {
    const { colors, fonts, styles, getButtonStyle } = useTheme(themeSettings);
    
    return (
        <div style={styles.container}>
            <button style={styles.button.primary}>
                Botón Primario
            </button>
        </div>
    );
};
```

### 3. Componentes Actualizados

Los siguientes componentes han sido actualizados para usar los valores por defecto del tema:

- `ButtonComponent.jsx`: Usa valores por defecto para colores, bordes, y tipografía
- `HeadingComponent.jsx`: Aplica automáticamente estilos de heading del tema
- `TextComponent.jsx`: Usa configuración de párrafo y headings del tema
- `Builder.jsx`: Función `handleAddComponent` usa valores por defecto para nuevos componentes

## Cómo Usar los Valores por Defecto del Tema

### Método 1: Usando las Utilidades Directamente

```jsx
import { getThemeWithDefaults, getButtonStyles, hslToCss } from '@/utils/themeUtils';

const MyComponent = ({ themeSettings }) => {
    // Obtener tema con valores por defecto
    const theme = getThemeWithDefaults(themeSettings);
    
    // Usar valores específicos
    const buttonStyles = getButtonStyles(theme, 'primary');
    
    return (
        <button style={{
            ...buttonStyles,
            padding: '12px 24px'
        }}>
            Mi Botón
        </button>
    );
};
```

### Método 2: Usando el Hook useTheme (Recomendado)

```jsx
import { useTheme } from '@/hooks/useTheme';

const MyComponent = ({ themeSettings }) => {
    const { colors, styles, getButtonStyle } = useTheme(themeSettings);
    
    return (
        <div style={{ backgroundColor: colors.background }}>
            <button style={styles.button.primary}>
                Botón Primario
            </button>
            <button style={styles.button.secondary}>
                Botón Secundario
            </button>
        </div>
    );
};
```

## Valores por Defecto Disponibles

### Colores Generales
- `background`: '0 0% 100%' (Blanco)
- `heading`: '0 0% 3.9%' (Negro)
- `text`: '0 0% 3.9%' (Negro)
- `links`: '209 100% 50%' (Azul)
- `borders`: '0 0% 96.1%' (Gris claro)

### Botones
- **Primario**: Fondo azul claro, texto negro
- **Secundario**: Fondo gris claro, texto negro
- Incluye estados hover y configuración de bordes

### Tipografía
- **Fuentes**: Inter como fuente por defecto
- **Párrafo**: 16px, normal, line-height 1.6
- **Headings**: Tamaños escalados de 2.5rem (h1) a 1rem (h6)

### Componentes Específicos
- **Banner**: 400px altura, padding 20px
- **Carousel**: Gap 10px, fondo blanco
- **Bento**: Gap 20px, fondo blanco
- **Marquee**: Padding vertical 10px, 16px font-size
- **Divider**: Padding vertical 20px, línea 1px

## Mejores Prácticas

### 1. Siempre Usar Valores por Defecto

```jsx
// ❌ Malo - valores hardcodeados
const styles = {
    backgroundColor: '#ffffff',
    color: '#000000'
};

// ✅ Bueno - usar valores del tema
const { colors } = useTheme(themeSettings);
const styles = {
    backgroundColor: colors.background,
    color: colors.text
};
```

### 2. Combinar Valores del Tema con Personalizaciones

```jsx
const { styles, colors } = useTheme(themeSettings);

const customButtonStyle = {
    ...styles.button.primary,
    borderRadius: '8px', // Personalización específica
    padding: '16px 32px'  // Personalización específica
};
```

### 3. Usar Funciones de Utilidad para Casos Específicos

```jsx
const { getButtonStyle, getTextStyle } = useTheme(themeSettings);

// Para casos específicos que no están en los estilos pre-calculados
const customHeadingStyle = {
    ...getTextStyle('heading3'),
    textTransform: 'uppercase'
};
```

### 4. Aplicar Temas en Componentes del Builder

```jsx
// En componentes del Builder, siempre usar getThemeWithDefaults
import { getThemeWithDefaults, hslToCss } from '@/utils/themeUtils';

const MyBuilderComponent = ({ comp, themeSettings }) => {
    const theme = getThemeWithDefaults(themeSettings);
    
    const styles = {
        backgroundColor: hslToCss(theme.background),
        color: hslToCss(theme.text),
        // ... otros estilos usando valores del tema
    };
    
    return <div style={styles}>{comp.content}</div>;
};
```

## Estructura de Archivos

```
resources/js/
├── utils/
│   └── themeUtils.jsx          # Utilidades principales del tema
├── hooks/
│   └── useTheme.jsx            # Hook personalizado para temas
├── Components/
│   ├── BuilderPages/           # Componentes actualizados del Builder
│   │   ├── ButtonComponent.jsx
│   │   ├── HeadingComponent.jsx
│   │   └── TextComponent.jsx
│   └── Examples/
│       └── ThemedComponentExample.jsx  # Ejemplo de implementación
└── Pages/Pages/
    └── Builder.jsx             # Builder principal actualizado
```

## Migración de Componentes Existentes

Para migrar componentes existentes:

1. **Importar las utilidades necesarias**:
   ```jsx
   import { useTheme } from '@/hooks/useTheme';
   // o
   import { getThemeWithDefaults, hslToCss } from '@/utils/themeUtils';
   ```

2. **Reemplazar valores hardcodeados**:
   ```jsx
   // Antes
   backgroundColor: '#ffffff'
   
   // Después
   backgroundColor: colors.background
   ```

3. **Usar estilos pre-calculados cuando sea posible**:
   ```jsx
   // En lugar de crear estilos manualmente
   <button style={styles.button.primary}>
   ```

4. **Testear con diferentes temas** para asegurar compatibilidad.

## Ejemplo Completo

Ver `resources/js/Components/Examples/ThemedComponentExample.jsx` para un ejemplo completo de implementación que muestra:

- Uso del hook useTheme
- Aplicación de colores del tema
- Uso de tipografía consistente
- Implementación de botones temáticos
- Formularios con estilos del tema

Este ejemplo puede servir como referencia para implementar temas en otros componentes de la aplicación.