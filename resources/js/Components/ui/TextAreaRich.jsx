import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DEFAULT_TOOLBAR = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean']
];

const TextAreaRich = forwardRef(({ initialValue = '', onChange, name, toolbar = DEFAULT_TOOLBAR }, ref) => {
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
        <div className='rounded-xl overflow-hidden border border-input'>
            <ReactQuill
                value={text}
                onChange={handleChange}
                modules={{
                    toolbar: toolbar,
                }}
            />
            <input type="hidden" name={name} value={text} />
        </div>
    );
});

export default TextAreaRich;