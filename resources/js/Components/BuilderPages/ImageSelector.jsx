// components/BuilderPages/ImageSelector.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Search } from 'lucide-react';

const ImageSelector = ({ 
  open, 
  onOpenChange, 
  onSelectImage, 
  products = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleImageSelect = (product, media) => {
    // Aquí puedes copiar la imagen al modelo Page o usar la URL directamente
    const imageUrl = media.original_url || media.url;
    const imageData = {
      src: imageUrl,
      alt: product.product_name,
      product_id: product.id,
      media_id: media.id,
      is_from_product: true,
      product_name: product.product_name
    };
    onSelectImage(imageData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Seleccionar imagen de productos</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 gap-4 p-2">
              {filteredProducts.map((product) => (
                <div key={product.id} className="space-y-2">
                  {/* <h4 className="font-medium text-sm truncate">{product.product_name}</h4> */}
                  <div className="grid grid-cols-2 gap-2">
                    {product.media && product.media.length > 0 ? (
                      product.media.map((media) => (
                        <Button
                          key={media.id}
                          variant="outline"
                          className="p-1 h-auto overflow-hidden rounded-sm border"
                          onClick={() => handleImageSelect(product, media)}
                        >
                          <img
                            src={media.original_url || media.url}
                            alt={product.product_name}
                            className="w-full h-24 object-cover"
                          />
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-400 py-8">
                        No hay imágenes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;