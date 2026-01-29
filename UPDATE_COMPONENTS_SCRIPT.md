# Script para Actualizar Componentes Restantes

## Componentes que necesitan actualización con valores del tema:

### Componentes Básicos (Ya actualizados ✅)
- [x] ButtonComponent.jsx
- [x] HeadingComponent.jsx  
- [x] TextComponent.jsx
- [x] ImageComponent.jsx
- [x] VideoComponent.jsx
- [x] LinkComponent.jsx
- [x] ContainerComponent.jsx
- [x] DividerComponent/DividerComponent.jsx
- [x] MarqueeComponent/MarqueeTextComponent.jsx
- [x] Banner/BannerComponent.jsx (parcialmente)

### Componentes que necesitan actualización:

#### Banner Components
- [ ] Banner/BannerTextComponent.jsx
- [ ] Banner/BannerTitleComponent.jsx

#### Bento Components  
- [ ] BentoComponent/BentoComponent.jsx
- [ ] BentoComponent/BentoFeatureComponent.jsx
- [ ] BentoComponent/BentoFeatureTextComponent.jsx
- [ ] BentoComponent/BentoFeatureTitleComponent.jsx
- [ ] BentoComponent/BentoTitleComponent.jsx

#### Carousel Components
- [ ] Carousel/CarouselComponent.jsx
- [ ] Carousel/CarouselCardComponent.jsx
- [ ] Carousel/CarouselImageComponent.jsx
- [ ] Carousel/CarouselNameComponent.jsx
- [ ] Carousel/CarouselPriceComponent.jsx
- [ ] Carousel/CarouselTitleComponent.jsx

#### Product Components
- [ ] Product/ProductComponent.jsx
- [ ] Product/ProductCardComponent.jsx
- [ ] Product/ProductImageComponent.jsx
- [ ] Product/ProductNameComponent.jsx
- [ ] Product/ProductPriceComponent.jsx
- [ ] Product/ProductTitleComponent.jsx

#### Header/Footer Components
- [ ] Header/HeaderComponent.jsx
- [ ] Header/HeaderLogoComponent.jsx
- [ ] Header/HeaderMenuComponent.jsx
- [ ] Footer/FooterComponent.jsx
- [ ] Footer/FooterMenuComponent.jsx

#### AnnouncementBar Components
- [ ] AnnouncementBar/AnnouncementBarComponent.jsx
- [ ] AnnouncementBar/AnnouncementComponent.jsx

#### Auth Components
- [ ] Auth/LoginComponent.jsx
- [ ] Auth/RegisterComponent.jsx

#### Cart Components
- [ ] Cart/CartComponent.jsx
- [ ] Cart/CartItemsComponent.jsx
- [ ] Cart/CartSummaryComponent.jsx

#### Checkout Components
- [ ] Checkout/CheckoutComponent.jsx
- [ ] Checkout/CheckoutDiscountGiftCardComponent.jsx
- [ ] Checkout/CheckoutPaymentComponent.jsx
- [ ] Checkout/CheckoutSummaryComponent.jsx
- [ ] Checkout/CustomerInfoComponent.jsx

#### ProductDetail Components
- [ ] ProductDetail/ProductDetailComponent.jsx
- [ ] ProductDetail/ProductDetailAttributesComponent.jsx
- [ ] ProductDetail/ProductDetailDescriptionComponent.jsx
- [ ] ProductDetail/ProductDetailImageComponent.jsx
- [ ] ProductDetail/ProductDetailNameComponent.jsx
- [ ] ProductDetail/ProductDetailPriceComponent.jsx
- [ ] ProductDetail/ProductDetailStockComponent.jsx
- [ ] ProductDetail/QuantitySelectorComponent.jsx

#### Other Components
- [ ] Orders/OrdersComponent.jsx
- [ ] Profile/ProfileComponent.jsx
- [ ] Success/SuccessComponent.jsx
- [ ] PageContentComponent.jsx

## Patrón de Actualización

Para cada componente, seguir este patrón:

1. **Importar utilidades del tema:**
```jsx
import { getThemeWithDefaults, getComponentStyles, hslToCss, getTextStyles, getResolvedFont } from '@/utils/themeUtils';
```

2. **Obtener tema con valores por defecto:**
```jsx
const themeWithDefaults = getThemeWithDefaults(themeSettings);
```

3. **Usar valores del tema como fallback:**
```jsx
// En lugar de valores hardcodeados
const color = customStyles.color || '#000000';

// Usar valores del tema
const color = customStyles.color || hslToCss(themeWithDefaults.text);
```

4. **Para componentes específicos, usar getComponentStyles:**
```jsx
const themeComponentStyles = getComponentStyles(themeWithDefaults, 'componentType');
const backgroundColor = customStyles.backgroundColor || themeComponentStyles.backgroundColor;
```

5. **Para tipografía, usar getTextStyles y getResolvedFont:**
```jsx
const themeTextStyles = getTextStyles(themeWithDefaults, 'paragraph');
const fontSize = customStyles.fontSize || themeTextStyles.fontSize;
const fontFamily = getResolvedFont(themeWithDefaults, 'body_font');
```

## Valores del Tema Disponibles

### Colores Principales
- `themeWithDefaults.background` - Color de fondo
- `themeWithDefaults.text` - Color de texto
- `themeWithDefaults.heading` - Color de títulos
- `themeWithDefaults.links` - Color de enlaces
- `themeWithDefaults.borders` - Color de bordes

### Tipografía
- `themeWithDefaults.body_font` - Fuente del cuerpo
- `themeWithDefaults.heading_font` - Fuente de títulos
- `themeWithDefaults.paragraph_fontSize` - Tamaño de párrafo
- `themeWithDefaults.heading1_fontSize` - Tamaño H1
- etc.

### Componentes Específicos
- `themeWithDefaults.banner_*` - Configuración de banner
- `themeWithDefaults.carousel_*` - Configuración de carousel
- `themeWithDefaults.bento_*` - Configuración de bento
- etc.

## Prioridad de Actualización

1. **Alta prioridad:** Componentes de texto y tipografía
2. **Media prioridad:** Componentes de layout (Banner, Bento, Carousel)
3. **Baja prioridad:** Componentes específicos de funcionalidad (Cart, Checkout)

## Notas

- Siempre mantener compatibilidad hacia atrás
- Los valores personalizados del usuario deben tener prioridad sobre los valores del tema
- Usar `hslToCss()` para convertir valores HSL a CSS
- Testear cada componente después de la actualización