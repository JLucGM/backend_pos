import React, { useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import DivSection from '@/Components/ui/div-section';
import { Input } from '@/Components/ui/input';
import { TrashIcon } from '@heroicons/react/24/outline';
import TextAreaRich from '@/Components/ui/TextAreaRich';
import { customStyles } from '@/hooks/custom-select';

export default function ProductBasicInfo({ data, setData, errors, categoryOptions, handleCategoryChange, handleDeleteImage, product }) {
    const animatedComponents = makeAnimated();
    const textAreaRef = useRef();

    return (
        <DivSection className='space-y-4'>
            <div>
                <InputLabel htmlFor="product_name" value="Nombre" />
                <TextInput
                    id="product_name"
                    type="text"
                    name="product_name"
                    value={data.product_name || ''}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('product_name', e.target.value)}
                />
                <InputError message={errors.product_name} />
            </div>

            <div>
                <InputLabel htmlFor="product_description" value="Descripción" />
                <TextAreaRich
                    initialValue={data.product_description || ''}
                    ref={textAreaRef}
                    name="product_description"
                    onChange={(newText) => setData('product_description', newText)}
                />
                <InputError message={errors.product_description} />
            </div>

            <div>
                <InputLabel htmlFor="images" value="Media" />
                <Input
                    id="images"
                    type="file"
                    name="images[]"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('images', Array.from(e.target.files))}
                    multiple
                />
                <InputError message={errors.images} className="mt-2" />
            </div>

            <div className="my-4">
                <div className="flex flex-wrap">
                    {product && product.media && product.media.length > 0 ? (
                        product.media.map((image) => (
                            <div key={image.id} className="relative mr-2 mb-2">
                                <img
                                    src={image.original_url}
                                    alt={image.name}
                                    className="w-44 h-44 object-cover rounded-xl aspect-square"
                                />
                                <Button
                                    variant="link"
                                    onClick={() => handleDeleteImage(image.id)}
                                    type="button"
                                    className="text-red-600"
                                >
                                    <TrashIcon className='size-5' /> Eliminar
                                </Button>
                            </div>
                        ))
                    ) : null}
                </div>
            </div>

            <div>
                <InputLabel value="Categorías" />
                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    styles={customStyles}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    components={animatedComponents}
                    value={categoryOptions.filter(option => data.categories.includes(option.value))}
                />
                <InputError message={errors.categories} />
            </div>
        </DivSection>
    );
}