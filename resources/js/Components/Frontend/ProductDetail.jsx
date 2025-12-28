// // components/Frontend/ProductDetail.jsx
// import React from 'react';
// import { Head } from '@inertiajs/react';

// export default function ProductDetail({ page, product, themeSettings }) {
//     return (
//         <>
//             <Head>
//                 <title>{product.product_name} - {page.title} dfdfdf</title>
//             </Head>
            
//             <div className="product-detail-container max-w-6xl mx-auto px-4 py-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Imágenes del producto */}
//                     <div className="product-images">
//                         {product.media.length > 0 ? (
//                             <img 
//                                 src={product.media[0].original_url}
//                                 alt={product.product_name}
//                                 className="w-full rounded-lg shadow-lg"
//                             />
//                         ) : (
//                             <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
//                                 <span className="text-gray-500">Sin imagen</span>
//                             </div>
//                         )}
//                     </div>
                    
//                     {/* Información del producto */}
//                     <div className="product-info">
//                         <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
                        
//                         <div className="price mb-6">
//                             {product.product_price_discount ? (
//                                 <>
//                                     <span className="text-2xl font-bold text-red-600">
//                                         ${parseFloat(product.product_price_discount).toFixed(2)}
//                                     </span>
//                                     <span className="text-lg line-through text-gray-500 ml-2">
//                                         ${parseFloat(product.product_price).toFixed(2)}
//                                     </span>
//                                 </>
//                             ) : (
//                                 <span className="text-2xl font-bold">
//                                     ${parseFloat(product.product_price).toFixed(2)}
//                                 </span>
//                             )}
//                         </div>
                        
//                         <div className="description mb-6">
//                             <h2 className="text-xl font-semibold mb-2">Descripción</h2>
//                             <p className="text-gray-700">{product.product_description}</p>
//                         </div>
                        
//                         <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full">
//                             Agregar al carrito
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }