import React from 'react';
import { Head } from '@inertiajs/react'; // Componente clave para inyectar CSS de fuentes

// ==============================================================
// 1. IMPORTAR LOS COMPONENTES DE BLOQUE DE PÁGINA (TOP-LEVEL)
// ==============================================================
import BannerComponent from '@/Components/BuilderPages/BannerComponent';
import BentoComponent from '@/Components/BuilderPages/BentoComponent/BentoComponent';
import ContainerComponent from '@/Components/BuilderPages/ContainerComponent';
import HeadingComponent from '@/Components/BuilderPages/HeadingComponent';
import TextComponent from '@/Components/BuilderPages/TextComponent';
import ImageComponent from '@/Components/BuilderPages/ImageComponent';
import VideoComponent from '@/Components/BuilderPages/VideoComponent';
import LinkComponent from '@/Components/BuilderPages/LinkComponent';
import DividerComponent from '@/Components/BuilderPages/DividerComponent/DividerComponent';
import HeaderComponent from '@/Components/BuilderPages/HeaderComponent';
import FooterComponent from '@/Components/BuilderPages/FooterComponent';
import MarqueeTextComponent from '@/Components/BuilderPages/MarqueeComponent/MarqueeTextComponent';
import ProductComponent from '@/Components/BuilderPages/ProductComponent';
import CarouselComponent from '@/Components/BuilderPages/CarouselComponent';


// ==============================================================
// 2. MAPEO DE TIPOS A COMPONENTES
// ==============================================================
const componentMap = {
    // Componentes de Bloque/Sección (Inferred from EditDialogs)
    'banner': BannerComponent,     // Inferred from BannerComponentEditDialog
    'bento': BentoComponent,       // Inferred from BentoComponentEditDialog
    
    // Componentes Genéricos de Bloque/Contenedor (Inferred from EditDialogs)
    'container': ContainerComponent, // Inferred from ContainerEditDialog
    
    // Componentes Elementales (Si se permite insertarlos directamente en el layout)
    'heading': HeadingComponent,   // Inferred from HeadingEditDialog
    'text': TextComponent,         // Inferred from TextEditDialog
    'image': ImageComponent,       // Inferred from ImageEditDialog
    'video': VideoComponent,       // Inferred from VideoEditDialog
    'link':LinkComponent,
    'divider': DividerComponent,
    'header': HeaderComponent,
    'footer': FooterComponent,
    'marquee': MarqueeTextComponent,
    'product': ProductComponent,
    'carousel': CarouselComponent,
    // 'list': ListComponent,         // Inferred from ListComponentEditDialog
    // Nota: 'link', 'button', 'icon' son casi siempre hijos.

    // Añade aquí cualquier otro componente que se inserte directamente en el array 'layout'
};

// ==============================================================
// 3. FUNCIÓN DE RENDERIZADO PÚBLICO
// ==============================================================
function renderBlock(block, themeSettings) {
    const Component = componentMap[block.type];

    if (!Component) {
        console.warn(`Componente de layout no reconocido: ${block.type}`);
        return (
            <div key={block.id} className="text-center text-red-500 p-4">
                Error: Componente de layout "{block.type}" no reconocido.
            </div>
        );
    }
    
    // Se pasan todas las props, incluyendo themeSettings
    const publicProps = {
        comp: block,
        themeSettings: themeSettings, 
        isPreview: false,
        getStyles: (c) => c.styles || {},
        onEdit: () => {},
        onDelete: () => {},
        setComponents: () => {},
        hoveredComponentId: null,
        setHoveredComponentId: () => {},
    };

    return <Component key={block.id} {...publicProps} />;
}

// ==============================================================
// 4. LÓGICA DE CARGA DE FUENTES Y VISTA PRINCIPAL
// ==============================================================
export default function Index({ page, themeSettings }) {
    
    // console.log("--- DEBUG DE TIPOGRAFÍA ---");
    // console.log("themeSettings (raw):", themeSettings);
    // console.log("Fuente de encabezado (heading_font):", themeSettings?.heading_font);
    // console.log("Fuente de cuerpo (body_font):", themeSettings?.body_font);
    // console.log("---------------------------");

    // --- Lógica de Decodificación del Layout (Se mantiene la estabilidad) ---
    let layoutBlocks = [];
    if (typeof page.layout === 'string' && page.layout.trim() !== '') {
        try {
            layoutBlocks = JSON.parse(page.layout);
        } catch (e) {
            console.error("Error al decodificar el layout JSON.", e);
        }
    } else if (Array.isArray(page.layout)) {
        layoutBlocks = page.layout;
    }
    layoutBlocks = Array.isArray(layoutBlocks) ? layoutBlocks : []; 
    // --------------------------------------------------------

    // --- LÓGICA CLAVE: CARGA DINÁMICA DE FUENTES ---
    
    const getGoogleFontUrl = (settings) => {
        const themeSettings = settings || {}; 

        // 1. Recolectar las fuentes utilizando las claves de theme_settings
        const rawFonts = [
            themeSettings.heading_font, 
            themeSettings.body_font,
            themeSettings.subheading_font,
            themeSettings.accent_font,
        ]
        // Filtrar solo las cadenas válidas
        .filter(font => font && typeof font === 'string' && font.trim() !== ''); 

        // 2. Extraer solo el nombre de la fuente principal y eliminar duplicados.
        const uniqueFontNames = new Set();
        
        rawFonts.forEach(fullFontString => {
            // Limpia: elimina comillas y toma solo el primer nombre (ej: 'Playfair Display')
            const cleaned = fullFontString.replace(/['"]/g, ''); 
            const name = cleaned.split(',')[0].trim(); 
            
            if (name) {
                // EXCLUSIÓN: Ignorar fuentes estándar que no necesitan carga de Google
                const systemFonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'sans-serif', 'serif', 'monospace'];
                if (!systemFonts.includes(name)) {
                     uniqueFontNames.add(name);
                }
            }
        });

        const fontsToLoad = [...uniqueFontNames];

        if (fontsToLoad.length === 0) {
            // Si solo se usan fuentes del sistema o no hay fuentes definidas, no se necesita URL
            return null;
        }
        
        // 3. Construir el URL de Google Fonts
        const families = fontsToLoad.map(fontName => 
            // Se añaden los pesos 300, 400, 600, 700 por defecto
            `family=${encodeURIComponent(fontName)}:wght@300;400;600;700`
        ).join('&');
        
        return `https://fonts.googleapis.com/css2?${families}&display=swap`;
    };

    const fontUrl = getGoogleFontUrl(themeSettings);
    // --------------------------------------------------------

    return (
        <>
            {/* 5. USO DEL COMPONENTE <Head> PARA CARGAR EL CSS DE LAS FUENTES */}
            {/* Si fontUrl es null, Inertia no renderizará el <link> */}
            <Head>
                <title>{page.title}</title>
                {fontUrl && (
                    <link 
                        rel="stylesheet"
                        href={fontUrl} 
                    />
                )}
            </Head>
            
            {/* Título para SEO/Accesibilidad */}
            <h1 className="sr-only">{page.title}</h1>
            
            {/* Recorrer y renderizar cada bloque del layout */}
            {layoutBlocks.map(block => renderBlock(block, themeSettings))}
        </>
    );
}