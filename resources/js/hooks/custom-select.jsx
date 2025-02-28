
export const customStyles = {
        control: (base, { isFocused }) => ({
            ...base,
            borderRadius: '30px',
            borderColor: isFocused ? '#9ca3af' : '#9ca3af',
            
        }),
        option: (base, { isSelected, hover }) => ({
            ...base,
            backgroundColor: isSelected ? '#F7F7F7' : 'white', // Cambia el fondo de la opción seleccionada
            color: isSelected ? 'black' : 'black', // Cambia el color de la opción seleccionada
            '&.dark': {
                backgroundColor: isSelected ? 'gray-700' : 'gray-900', // Cambia el fondo de la opción seleccionada en dark mode
                color: isSelected ? 'white' : 'gray-300', // Cambia el color de la opción seleccionada en dark mode
            },
        }),
    };
