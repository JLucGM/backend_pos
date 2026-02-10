
export const customStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
        borderWidth: '1px',
        borderRadius: '30px',
        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
        minHeight: '32px',
        minWidth: '200px',
        '&:hover': {
            borderColor: '#3b82f6'
        }
    }),
    option: (base, { isSelected, hover }) => ({
        ...base,
        backgroundColor: isSelected ? '#d6d4d4' : 'white', // Cambia el fondo de la opción seleccionada
        color: isSelected ? 'black' : 'black', // Cambia el color de la opción seleccionada
        borderRadius: '8px',
        margin: '5px',
        width: 'auto',
        '&.dark': {
            backgroundColor: isSelected ? 'gray-700' : 'gray-900', // Cambia el fondo de la opción seleccionada en dark mode
            color: isSelected ? 'white' : 'gray-300', // Cambia el color de la opción seleccionada en dark mode
        },
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
        width: 'auto',
        minWidth: '100%',
        marginTop: '4px',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999
    }),
    indicatorsContainer: (base) => ({
        ...base,
        padding: '0 4px'
    })
};
