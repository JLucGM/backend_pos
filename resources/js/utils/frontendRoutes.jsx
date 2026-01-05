// utils/frontendRoutes.js
export const getFrontendRoute = (routeBaseName) => {
    const hostname = window.location.hostname;
    
    if (hostname.endsWith('.pos.test')) {
        // Subdominio (pepsi.pos.test)
        return routeBaseName;
    } else {
        // Dominio personalizado (pepsi.test, mitienda.com)
        return `${routeBaseName}.custom`;
    }
};

// Ejemplo de uso:
// const loginRoute = getFrontendRoute('frontend.login');
// const checkoutRoute = getFrontendRoute('frontend.checkout');