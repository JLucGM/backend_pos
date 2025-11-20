import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const CarouselComponent = ({ products, limit = 5 }) => {
    const displayProducts = products.slice(0, limit);

    if (!displayProducts || displayProducts.length === 0) return <p>No hay productos para mostrar.</p>;

    return (
        <Carousel className="w-full max-w-5xl mx-auto group">  {/* group para hover en hijos */}
            <CarouselContent className="-ml-1">
                {displayProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        {product.media && product.media.length > 0 && (
                            <img src={product.media[0].original_url} alt={product.product_name} className="w-full h-32 object-cover rounded-md mt-4" />
                        )}
                        <h4 className="font-semibold text-lg">{product.product_name}</h4>
                        <p className="text-sm text-muted-foreground">${product.product_price}</p>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="invisible group-hover:visible transition-opacity duration-300" />  {/* invisible por defecto, visible en hover */}
            <CarouselNext className="invisible group-hover:visible transition-opacity duration-300" />  {/* invisible por defecto, visible en hover */}
        </Carousel>
    );
};

export default CarouselComponent;