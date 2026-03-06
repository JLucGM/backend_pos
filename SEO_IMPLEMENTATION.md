# Implementación SEO para Productos, Páginas y Colecciones

Esta implementación agrega funcionalidad SEO completa a tu aplicación Laravel con Inertia.js y React.

## Características Implementadas

### 1. Campos SEO en Base de Datos
- **Meta Title**: Título optimizado para motores de búsqueda (máx. 60 caracteres)
- **Meta Description**: Descripción para resultados de búsqueda (máx. 160 caracteres)
- **Meta Keywords**: Palabras clave relevantes (máx. 10)
- **Open Graph**: Títulos, descripciones e imágenes para redes sociales
- **Twitter Cards**: Metadatos específicos para Twitter
- **Auto-completado**: Los campos se llenan automáticamente basándose en el contenido

### 2. Modelos Actualizados
- `Product`, `Page`, y `Collection` ahora incluyen el trait `HasSeo`
- Generación automática de campos SEO basada en contenido
- Métodos helper para obtener datos SEO optimizados

### 3. Componentes Frontend
- **SeoFields**: Componente para editar campos SEO en formularios con vista previa siempre visible
- **SeoHead**: Componente para renderizar meta tags en el head
- **useSeo**: Hook para manejar datos SEO en componentes
- **SeoProductHead**: Componente específico para productos
- **SeoCollectionHead**: Componente específico para colecciones

## Instalación y Configuración

### 1. Ejecutar Migraciones
```bash
php artisan migrate
```

### 2. Generar SEO para Registros Existentes
```bash
# Generar para todos los modelos
php artisan seo:generate

# Generar solo para productos
php artisan seo:generate --model=product

# Generar solo para páginas
php artisan seo:generate --model=page

# Generar solo para colecciones
php artisan seo:generate --model=collection
```

### 3. Configurar Rutas (opcional)
Agregar al archivo `routes/web.php`:
```php
Route::get('/sitemap.xml', [SitemapController::class, 'index']);
```

## Uso en Formularios

### Productos
El componente `SeoFields` se ha agregado automáticamente al formulario de productos con auto-completado:

```jsx
<SeoFields
    data={data}
    setData={setData}
    errors={errors}
    autoGenerateFromFields={{
        title: data.product_name,
        description: data.product_description,
        image: product?.media?.[0]?.original_url,
    }}
/>
```

### Páginas
Similar implementación en el formulario de páginas:

```jsx
<SeoFields
    data={data}
    setData={setData}
    errors={errors}
    autoGenerateFromFields={{
        title: data.title,
        content: data.content,
    }}
/>
```

### Colecciones
Y en el formulario de colecciones:

```jsx
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
```

## Uso en Frontend

### Frontend/Index.jsx
El componente principal del frontend ahora incluye SEO automático:

```jsx
import SeoHead from '@/Components/SeoHead';
import { useSeo } from '@/hooks/useSeo';

export default function Index({ page, company, ... }) {
    const { meta, structuredData } = useSeo({
        title: page.meta_title || page.title || (company?.name ? `${page.title} - ${company.name}` : page.title),
        description: page.meta_description || `Página ${page.title}`,
        keywords: Array.isArray(page.meta_keywords) ? page.meta_keywords.join(', ') : '',
        // ... más campos SEO
    });

    return (
        <>
            <SeoHead
                title={meta.title}
                description={meta.description}
                keywords={meta.keywords}
                ogTitle={meta.ogTitle}
                ogDescription={meta.ogDescription}
                ogImage={meta.ogImage}
                structuredData={structuredData}
            />
            {/* Contenido de la página */}
        </>
    );
}
```

### Componentes BuilderPages
Los componentes pueden usar SEO específico para productos:

```jsx
import SeoProductHead from '@/Components/BuilderPages/SeoProductHead';

// En el renderBlock del Frontend/Index.jsx
case 'productDetail':
    return (
        <>
            {currentProduct && (
                <SeoProductHead 
                    product={currentProduct} 
                    company={company} 
                />
            )}
            <Component {...props} />
        </>
    );
```

## Funcionalidades Automáticas

### 1. Auto-completado de SEO
Los campos SEO se llenan automáticamente cuando el usuario escribe:
- **Meta Title**: Se genera desde el nombre/título (máx. 55 caracteres)
- **Meta Description**: Se extrae del contenido/descripción (máx. 155 caracteres)
- **Keywords**: Se extraen automáticamente del título y contenido
- **Open Graph y Twitter**: Se copian desde los campos meta básicos

### 2. Vista Previa Siempre Visible
- Vista previa de Google y Facebook siempre visible
- Se actualiza en tiempo real mientras el usuario escribe
- Muestra cómo se verá en los resultados de búsqueda

### 3. Extracción de Palabras Clave
El sistema automáticamente:
- Filtra palabras comunes (stop words) en español e inglés
- Extrae palabras de más de 2 caracteres
- Limita a 10 palabras clave máximo
- Incluye categorías de productos cuando están disponibles

### 4. Datos Estructurados (JSON-LD)
Se generan automáticamente para:
- **Productos**: Schema.org Product con precios, imágenes, marca
- **Colecciones**: Schema.org CollectionPage
- **Páginas**: Schema.org WebPage o WebSite (para homepage)

## Servicios Disponibles

### SeoService
```php
// Generar meta tags
$metaTags = SeoService::generateMetaTags($model);

// Generar datos estructurados
$structuredData = SeoService::generateStructuredData($model);

// Generar datos para sitemap
$sitemapData = SeoService::generateSitemapData($models);
```

### HasSeo Trait
```php
// Métodos disponibles en modelos
$model->getSeoTitle();
$model->getSeoDescription();
$model->getSeoKeywords();
$model->getOgTitle();
$model->getOgImage();
// ... más métodos
```

## Sitemap XML

El sistema genera automáticamente un sitemap XML en `/sitemap.xml` que incluye:
- Todas las páginas publicadas
- Todos los productos activos
- Todas las colecciones activas
- Frecuencia de cambio y prioridades optimizadas

## Páginas por Defecto

Al registrar un nuevo usuario, se crean automáticamente páginas con SEO optimizado:
- Página de inicio con meta tags específicos
- Páginas de tienda, productos, carrito, etc.
- Páginas de políticas con descripciones apropiadas
- Todas con campos SEO pre-llenados

## Personalización

### Modificar Generación Automática
Edita el trait `HasSeo` para personalizar:
- Lógica de generación de títulos
- Extracción de palabras clave
- Límites de caracteres
- Stop words

### Agregar Nuevos Campos SEO
1. Crear migración con nuevos campos
2. Actualizar trait `HasSeo`
3. Modificar componente `SeoFields`
4. Actualizar `SeoService`

## Mejores Prácticas

### Títulos SEO
- Máximo 60 caracteres
- Incluir palabra clave principal
- Ser descriptivo y único

### Meta Descriptions
- Máximo 160 caracteres
- Incluir call-to-action
- Describir el contenido claramente

### Palabras Clave
- Máximo 10 palabras
- Relevantes al contenido
- Evitar keyword stuffing

### Imágenes Open Graph
- Tamaño recomendado: 1200x630px
- Formato: JPG o PNG
- Peso máximo: 1MB

## Cambios Principales en esta Versión

### ✅ Eliminado el Switch de Auto-generar
- Los campos SEO se auto-completan automáticamente
- El usuario puede editar manualmente cualquier campo
- No hay necesidad de activar/desactivar la función

### ✅ Vista Previa Siempre Visible
- La vista previa se movió fuera de los tabs
- Siempre visible mientras se editan los campos SEO
- Se actualiza en tiempo real

### ✅ Integración Completa con Frontend
- SEO automático en Frontend/Index.jsx
- Componentes específicos para productos y colecciones
- Datos estructurados automáticos

### ✅ Datos Disponibles en Vistas Edit
- Todos los campos SEO están disponibles en las vistas de edición
- Auto-completado basado en el contenido existente
- Validación y límites de caracteres

## Monitoreo y Análisis

Para monitorear el rendimiento SEO:
1. Configurar Google Search Console
2. Usar herramientas como SEMrush o Ahrefs
3. Monitorear Core Web Vitals
4. Revisar regularmente el sitemap XML

## Troubleshooting

### Campos SEO no se generan automáticamente
- Los campos se llenan automáticamente al escribir en los campos principales
- Usar el botón "Regenerar" si es necesario
- Verificar que el modelo use el trait `HasSeo`

### Meta tags no aparecen en frontend
- Verificar que se use el componente `SeoHead`
- Comprobar que el hook `useSeo` esté configurado
- Revisar que los datos se pasen correctamente desde el backend

### Sitemap no se genera
- Verificar que la ruta esté configurada
- Comprobar permisos de los modelos
- Revisar que haya contenido publicado/activo