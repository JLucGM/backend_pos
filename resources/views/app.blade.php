<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERERERERERERAAAAAAAAERAQAAAAAAEBEAEAAAAAEAEQABAAAAEAARAAAQAAEAABEAAAEAEAAAEQAAABEAAAARAAAAEQAAABEAAAEAEAAAEQAAEAABAAARAAEAAAAQABEAEAAAAAEAEQEAAAAAABAREAAAAAAAAREREREREREREAAAAAP/wAAF/6AABv9gAAd+4AAHveAAB9vgAAfn4AAH5+AAB9vgAAe94AAHfuAABv9gAAX/oAAD/8AAAAAAAA" rel="icon" type="image/x-icon">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
