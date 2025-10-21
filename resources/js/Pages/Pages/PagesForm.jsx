import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DivSection from '@/Components/ui/div-section';
import TextAreaRich from '@/Components/ui/TextAreaRich';
import { customStyles } from '@/hooks/custom-select';
import { useRef } from 'react';
import Select from 'react-select';

export default function CategoriesForm({ data, setData, errors }) {
    const textAreaRef = useRef();

    const statusOptions = [
        { value: false, label: 'Borrador' },
        { value: true, label: 'Publicar' }
    ];

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-full md:col-span-2 order-2 md:order-1">
                    <DivSection>

                        <div>
                            <InputLabel htmlFor="title" value="Nombre" />
                            <TextInput
                                id="title"
                                type="text"
                                name="title"
                                value={data.title}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Contenido" />
                            <TextAreaRich
                                initialValue={data.content || ''}
                                ref={textAreaRef}
                                name="content"
                                onChange={(newText) => setData('content', newText)}
                            />
                            <InputError message={errors.content} />
                        </div>
                    </DivSection>
                </div>

                <div className="col-span-full md:col-span-1 order-1 md:order-2">
                    <DivSection>


                        <div className='md:col-span-2 lg:col-span-1'>
                            <InputLabel htmlFor="is_published" value="Publicar" />
                            <Select
                                name="is_published"
                                id="is_published"
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === data.is_published)}
                                onChange={(selectedOption) => setData('is_published', selectedOption.value)}
                                styles={customStyles}
                            />
                            <InputError message={errors.is_published} className="mt-2" />
                        </div>
                    </DivSection>
                </div>
            </div>
        </>
    );
}