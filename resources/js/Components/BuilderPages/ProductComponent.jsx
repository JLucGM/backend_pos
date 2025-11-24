// components/Builder/ProductComponent.jsx
import React from 'react';

const ProductComponent = ({ products }) => {
    if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {/* titulo */}
            {products.map((product) => (
                <div key={product.id} className="w-48 border rounded">
                    {product.media && product.media.length > 0 && (
                        <img src={product.media[0].original_url} alt={product.product_name} className="w-full h-24 object-cover mt-2" />
                    )}
                    <h4 className="font-semibold">{product.product_name}</h4>
                    <p className="text-sm">${product.product_price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductComponent;