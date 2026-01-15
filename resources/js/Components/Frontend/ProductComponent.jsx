// // Lista de productos en una cuadrícula
// import React from 'react';
// import FrontendProductCard from './ProductCardComponent';

// const FrontendProductComponent = ({ comp, products = [], themeSettings }) => {
//     const productConfig = comp.content || {};
//     const children = productConfig.children || [];
    
//     // Configuración del grid
//     const columns = productConfig.columns || 3;
//     const gapX = productConfig.gapX || '10px';
//     const gapY = productConfig.gapY || '10px';
//     const limit = productConfig.limit || 8;
//     const backgroundColor = productConfig.backgroundColor || '#ffffff';
    
//     // Encontrar los componentes hijos
//     const titleComponent = children.find(child => child.type === 'productTitle');
//     const cardComponent = children.find(child => child.type === 'productCard');
//     const cardConfig = cardComponent?.content || {};
//     const cardChildren = cardComponent?.children || [];
    
//     // Aplicar estilos del componente principal (si existen)
//     const componentStyles = comp.styles || {};
    
//     // Limitar productos a mostrar
//     const productsToShow = products.slice(0, limit);

//     return (
//         <div 
//             className="product-grid-container" 
//             style={{
//                 ...componentStyles, // Estilos del componente principal
//                 backgroundColor: backgroundColor,
//                 padding: componentStyles.padding || '20px 0',
//             }}
//         >
//             {/* Título del grid */}
//             {titleComponent && (
//                 <h2 
//                     className="product-grid-title"
//                     style={{
//                         ...titleComponent.styles,
//                         textAlign: titleComponent.styles?.alignment || 'center',
//                         marginBottom: '2rem',
//                         display: 'block',
//                         width: '100%',
//                     }}
//                 >
//                     {titleComponent.content}
//                 </h2>
//             )}
            
//             {/* Grid de productos */}
//             <div 
//                 className="product-grid" 
//                 style={{
//                     display: 'grid',
//                     gridTemplateColumns: `repeat(${columns}, 1fr)`,
//                     gap: `${gapY} ${gapX}`,
//                     maxWidth: '1200px',
//                     margin: '0 auto',
//                     padding: '0 20px',
//                 }}
//             >
//                 {productsToShow.map((product) => (
//                     <FrontendProductCard
//                         key={product.id}
//                         product={product}
//                         cardConfig={cardConfig}
//                         cardChildren={cardChildren} // Pasamos los children de la card
//                         themeSettings={themeSettings}
//                     />
//                 ))}
//             </div>
            
//             {products.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                     No hay productos disponibles
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FrontendProductComponent;