// resources/js/utils/dateFormatter.js

const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  // Verificar si la cadena es una fecha válida antes de procesar
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return date.toLocaleDateString('es-ES', options);
};

export { formatDate };
