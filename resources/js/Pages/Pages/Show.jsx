import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CurrencyDisplay from '@/Components/CurrencyDisplay';
import CarouselComponent from '@/Components/BuilderPages/CarouselComponent';
import HeaderComponent from '@/Components/BuilderPages/Header/HeaderComponent';
import FooterComponent from '@/Components/BuilderPages/Footer/FooterComponent';

// Componente Producto (igual que antes)
const ProductComponent = ({ products }) => {
    if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {products.map((product) => (
                <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', width: '200px' }}>
                    <h4>{product.product_name}</h4>
                    <p>Precio: <CurrencyDisplay currency={settings?.currency} amount={product.product_price} /></p>
                    {product.media && product.media.length > 0 && (
                        <img src={product.media[0].original_url} alt={product.product_name} style={{ width: '100%' }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default function Show({ page, products, availableMenus, logoUrl }) {
    // Extraer settings del theme
    const themeSettings = page.theme?.settings || {};

    // Función para obtener estilos del componente, aplicando defaults del theme
    const getStyles = (comp) => {
        const styles = comp.styles || {};
        return {
            color: styles.color || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
            fontSize: styles.fontSize || 'inherit',
            backgroundColor: styles.backgroundColor || (themeSettings?.primary ? `hsl(${themeSettings.primary})` : 'inherit'),
            padding: styles.padding || 'inherit',
            fontFamily: themeSettings?.fontFamily || 'inherit',
        };
    };

    // Función recursiva para renderizar componentes (incluye contenedores y carousel)
    const renderComponent = (comp) => {
        switch (comp.type) {
            case 'text':
                return <p key={comp.id} style={getStyles(comp)}>{comp.content}</p>;
            case 'image':
                return <img key={comp.id} src={comp.content} alt="Imagen" style={{ maxWidth: '100%' }} />;
            case 'button':
                return <button key={comp.id} style={{ ...getStyles(comp), border: 'none' }}>{comp.content}</button>;
            case 'video':
                return (
                    <iframe
                        key={comp.id}
                        width="100%"
                        height="200"
                        src={comp.content}
                        title="Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                );
            case 'link':
                return <a key={comp.id} href={comp.content} target="_blank" rel="noopener noreferrer" style={getStyles(comp)}>{comp.content || 'Enlace'}</a>;
            case 'product':
                return <ProductComponent key={comp.id} products={products} />;
            case 'carousel': // Nuevo caso para carousel
                return <CarouselComponent key={comp.id} products={products.slice(0, comp.content.limit || 5)} />;
            case 'header':
                return (
                    <HeaderComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        themeSettings={themeSettings}
                        appliedTheme={page.theme}
                        mode="frontend"
                        availableMenus={availableMenus}
                        companyLogo={logoUrl}
                    />
                );
            case 'footer':
                return (
                    <FooterComponent
                        key={comp.id}
                        comp={comp}
                        getStyles={getStyles}
                        themeSettings={themeSettings}
                        appliedTheme={page.theme}
                        mode="frontend"
                        availableMenus={availableMenus}
                    />
                );
            case 'container':
                return (
                    <div key={comp.id} style={getStyles(comp)}>
                        {comp.content.map((subComp) => renderComponent(subComp))}
                    </div>
                );
            default:
                return <div key={comp.id}>Componente desconocido</div>;
        }
    };

    const layout = page.layout ? JSON.parse(page.layout) : [];

    return (
        // <AuthenticatedLayout>
        <div
            className="max-w-7xl mx-auto"
            style={{
                // Aplicar estilos globales del theme al contenedor
                backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : '#fff',
                fontFamily: themeSettings?.fontFamily || 'inherit',
            }}
        >
            <Head title={page.title} />
            {/* <h1>{page.title}</h1> */}
            <div>
                {layout.map(renderComponent)}
            </div>
        </div>
        // </AuthenticatedLayout>
    );
}
