<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Asegúrate de incluir las rutas necesarias
    'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, etc.)
    'allowed_origins' => ['http://localhost:3000'], // Especifica el origen permitido
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Permite todos los encabezados
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Habilita el soporte para credenciales
];