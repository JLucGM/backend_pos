// import React from 'react';

// const FrontendProductCard = ({ product, cardConfig, cardChildren = [], themeSettings }) => {
//     const handleProductClick = (e, productSlug) => {
//         e.preventDefault();
//         window.location.href = `/detalles-del-producto?product=${productSlug}`;
//     };

//     // Extraer los componentes hijos específicos
//     const imageChild = cardChildren.find(child => child.type === 'productImage');
//     const nameChild = cardChildren.find(child => child.type === 'productName');
//     const priceChild = cardChildren.find(child => child.type === 'productPrice');

//     // Estilos para cada parte
//     const imageStyles = imageChild?.styles || {};
//     const nameStyles = nameChild?.styles || {};
//     const priceStyles = priceChild?.styles || {};

//     // Configuración de la tarjeta
//     const cardStyle = {
//         // Estilos del contenedor de la tarjeta
//         paddingTop: cardConfig.cardPaddingTop || '0px',
//         paddingRight: cardConfig.cardPaddingRight || '0px',
//         paddingBottom: cardConfig.cardPaddingBottom || '0px',
//         paddingLeft: cardConfig.cardPaddingLeft || '0px',
//         border: cardConfig.cardBorder === 'solid' 
//             ? `${cardConfig.cardBorderThickness || '1px'} solid rgba(0, 0, 0, ${cardConfig.cardBorderOpacity || 1})` 
//             : 'none',
//         borderRadius: cardConfig.cardBorderRadius || '0px',
//         backgroundColor: cardConfig.cardBackgroundColor || 'transparent',
//         cursor: 'pointer',
//         transition: 'box-shadow 0.3s ease',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//     };

//     // Estilos del contenedor de imagen
//     const imageContainerStyle = {
//         aspectRatio: imageStyles.aspectRatio === 'portrait' ? '3/4' : 
//                     imageStyles.aspectRatio === 'landscape' ? '4/3' : '1/1',
//         position: 'relative',
//         overflow: 'hidden',
//         borderRadius: imageStyles.imageBorderRadius || '0px',
//         marginBottom: '12px',
//         width: '100%',
//     };

//     // Estilos de la imagen
//     const imageStyle = {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//         border: imageStyles.imageBorder === 'solid' 
//             ? `${imageStyles.imageBorderThickness || '1px'} solid rgba(0, 0, 0, ${imageStyles.imageBorderOpacity || 1})` 
//             : imageStyles.imageBorder === 'none' ? 'none' : undefined,
//         borderRadius: imageStyles.imageBorderRadius || '0px',
//         display: 'block',
//     };

//     // Estilos del nombre del producto
//     const nameStyle = {
//         fontSize: nameStyles.fontSize || '16px',
//         fontWeight: nameStyles.fontWeight || '600',
//         color: nameStyles.color || '#000000',
//         textAlign: nameStyles.alignment || 'left',
//         marginBottom: '8px',
//         lineHeight: nameStyles.lineHeight || '1.4',
//         fontFamily: nameStyles.fontFamily || 'inherit',
//         textTransform: nameStyles.textTransform || 'none',
//         flexGrow: 1,
//     };

//     // Estilos del precio
//     const priceStyle = {
//         fontSize: priceStyles.fontSize || '14px',
//         fontWeight: priceStyles.fontWeight || 'normal',
//         color: priceStyles.color || '#666666',
//         textAlign: priceStyles.alignment || 'left',
//         lineHeight: priceStyles.lineHeight || '1.4',
//         fontFamily: priceStyles.fontFamily || 'inherit',
//         marginTop: 'auto',
//     };

//     return (
//         <div 
//             className="product-card hover:shadow-lg"
//             onClick={(e) => handleProductClick(e, product.slug)}
//             style={cardStyle}
//         >
//             {/* Imagen del producto */}
//             <div className="product-image-container" style={imageContainerStyle}>
//                 <img 
//                     src={product.media?.[0]?.original_url || 'https://yadakcenter.ir/wp-content/uploads/2016/07/shop-placeholder.png'}
//                     alt={product.product_name}
//                     style={imageStyle}
//                 />
//             </div>
            
//             {/* Nombre del producto */}
//             <h3 className="product-name" style={nameStyle}>
//                 {product.product_name}
//             </h3>
            
//             {/* Precio */}
//             <div className="product-price" style={priceStyle}>
//                 {product.product_price_discount ? (
//                     <>
//                         <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
//                             ${parseFloat(product.product_price).toFixed(2)}
//                         </span>
//                         <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
//                             ${parseFloat(product.product_price_discount).toFixed(2)}
//                         </span>
//                     </>
//                 ) : (
//                     <span>${parseFloat(product.product_price).toFixed(2)}</span>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FrontendProductCard;