import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextAreaRich = forwardRef(({ initialValue = '', onChange, name }, ref) => {
    const [text, setText] = useState(initialValue);

    const handleChange = (value) => {
        setText(value);
        if (onChange) {
            onChange(value); // Llama al callback con el nuevo valor
        }
    };

    useImperativeHandle(ref, () => ({
        getValue: () => text,
    }));
    


    return (
        <div className='rounded-3xl'>
            <ReactQuill
                value={text}
                onChange={handleChange}
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['link', 'image'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                    ],
                }}
            />
            <input type="hidden" name={name} value={text} />
        </div>
    );
});

export default TextAreaRich;