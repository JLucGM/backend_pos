import { Head, Link } from '@inertiajs/react';
import React from 'react';
import {
    ChevronRight,
    Check,
    Store,
    Zap,
    Shield,
    BarChart3,
    Globe,
    Smartphone,
    Layers,
    Users,
    Paintbrush,
    TicketPercent,
    Gift,
    Coins,
    LayoutGrid,
    Search,
    ClipboardList,
    Facebook,
    Instagram,
    Linkedin
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, subscriptionPlans = [] }) {
    const benefits = [
        {
            title: 'Diseño a tu Medida',
            description: 'Personaliza cada rincón de tu tienda con nuestro constructor visual. Sin códigos, solo tu estilo.',
            icon: <Paintbrush className="w-6 h-6 text-indigo-500" />
        },
        {
            title: 'Promociones que Venden',
            description: 'Potencia tus ventas creando Cupones de descuento y Gift Cards personalizadas para tus clientes.',
            icon: <TicketPercent className="w-6 h-6 text-amber-500" />
        },
        {
            title: 'Vende en Cualquier Moneda',
            description: 'Gestión multimoneda con reconversión automática. Acepta pagos globales sin complicaciones financieras.',
            icon: <Coins className="w-6 h-6 text-emerald-500" />
        },
        {
            title: 'Análisis y Reportes',
            description: 'KPIs en tiempo real. Entiende qué se vende, quién compra y cómo escalar tu rentabilidad.',
            icon: <BarChart3 className="w-6 h-6 text-rose-500" />
        },
        {
            title: 'SEO que te hace Visible',
            description: 'Tus productos brillan en Google. Meta tags dinámicos para atraer tráfico orgánico automáticamente.',
            icon: <Search className="w-6 h-6 text-sky-500" />
        },
        {
            title: 'Catálogo Organizado',
            description: 'Crea Colecciones inteligentes para guiar a tus clientes y simplificar su experiencia de compra.',
            icon: <LayoutGrid className="w-6 h-6 text-violet-500" />
        },
        {
            title: 'Gestión de Pedidos Pro',
            description: 'Control absoluto del flujo de ventas, desde la orden en línea hasta el despacho final.',
            icon: <ClipboardList className="w-6 h-6 text-orange-500" />
        },
        {
            title: 'Inversión Segura',
            description: 'Toda la potencia de Audaz respaldada por una infraestructura robusta y segura para tu negocio.',
            icon: <Shield className="w-6 h-6 text-slate-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Head title="Audaz - El Futuro del Ecommerce" />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-auto" />
                            {/* <span className="text-2xl font-black tracking-tighter text-slate-900">AUDAZ</span> */}
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href={route('pricing')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Planes
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button variant="ghost" className="font-medium">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')}>
                                    <Button variant="ghost" className="font-medium">Iniciar Sesión</Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button className="bg-indigo-600 font-medium hover:bg-indigo-700">Comenzar Gratis</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative overflow-hidden bg-white pb-24 pt-16 lg:pb-32 lg:pt-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                        <div className="col-span-12 lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                                Nueva Versión 2.0 disponible
                            </div>
                            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                                La plataforma <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">todo en uno</span> para tu negocio
                            </h1>
                            <p className="mt-8 text-lg leading-8 text-slate-600 lg:text-xl">
                                Crea, gestiona y escala tu tienda online con las herramientas más potentes del mercado. Diseñado para ofrecer una experiencia premium a tus clientes y una gestión eficiente para ti con <strong>Audaz</strong>.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="h-14 px-8 bg-indigo-600 text-lg font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700">
                                        Crear mi tienda ahora <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                {/* <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2">
                                    Ver Demo en Vivo
                                </Button> */}
                            </div>
                            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 ring-2 ring-slate-100"></div>
                                    ))}
                                </div>
                                <span>Únete a más de <strong>1,000+</strong> comercios activos</span>
                            </div>
                        </div>
                        <div className="relative mt-16 lg:col-span-5 lg:mt-0 flex items-center justify-center">
                            <div className="relative group">
                                {/* Decorative Background Glows */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                                {/* Mockup Container */}
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 lg:rotate-2 transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
                                    {/* Browser-like Header */}
                                    <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
                                    </div>

                                    {/* Actual Image */}
                                    <div className="relative overflow-hidden bg-slate-50">
                                        <img
                                            src="/dashboard-audaz.jpeg"
                                            alt="Panel de Control Audaz"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Floating Elements/Badges */}
                                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 hidden xl:block animate-bounce-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                            <Check className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Ventas en vivo</p>
                                            <p className="text-xs text-slate-500">Sincronización instantánea</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Benefits Section */}
            <section className="relative bg-slate-50 py-24 sm:py-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-200 blur-[120px]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 relative z-10">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center rounded-full bg-white px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-slate-200">
                            ✨ Características Premium
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Todo lo que necesitas para <span className="text-indigo-600">dominar</span> tu mercado
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Hemos fusionado tecnología de vanguardia con una experiencia de usuario excepcional para que escales sin límites con <strong>Audaz</strong>.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
                            {benefits.map((benefit, idx) => (
                                <div
                                    key={benefit.title}
                                    className="group relative flex flex-col p-8 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:ring-indigo-500/50"
                                >
                                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${idx === 0 ? 'from-indigo-500 to-indigo-600 shadow-indigo-200' :
                                        idx === 1 ? 'from-amber-500 to-orange-600 shadow-amber-200' :
                                            idx === 2 ? 'from-emerald-500 to-teal-600 shadow-emerald-200' :
                                                idx === 3 ? 'from-rose-500 to-pink-600 shadow-rose-200' :
                                                    idx === 4 ? 'from-sky-500 to-blue-600 shadow-sky-200' :
                                                        'from-violet-500 to-purple-600 shadow-violet-200'
                                        } shadow-lg text-white`}>
                                        {React.cloneElement(benefit.icon, { className: 'w-7 h-7 text-white' })}
                                    </div>
                                    <h3 className="text-xl font-bold leading-7 text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="flex-auto text-base leading-7 text-slate-600">
                                        {benefit.description}
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                                        Saber más <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* For Everyone Section (Shopify Style) */}
            <section className="bg-white py-24 sm:py-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-end gap-12 mb-16">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-2xl">
                            Para todos, desde emprendedores hasta empresas
                        </h2>
                        <div className="text-slate-500 text-lg lg:text-right border-l-2 lg:border-l-0 lg:border-r-2 border-indigo-500 pl-6 lg:pl-0 lg:pr-6 py-2">
                            Comercios de todos los tamaños han procesado colectivamente más de <span className="text-indigo-600 font-bold">$1,000,000,000</span> en ventas con nuestra tecnología.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            {
                                title: 'Comienza con rapidez',
                                description: 'Julieth y Mariangel, emprendedoras artesanales, pusieron en marcha Audaz para vender sus productos decorativos tanto en línea como en mercados locales de forma sincronizada.',
                                image: '/creative-owner.jpeg',
                                badge: 'Emprendedores'
                            },
                            {
                                title: 'Crece todo lo que quieras',
                                description: 'Marcas de rápido crecimiento han pasado de vender en un garaje a convertirse en referentes regionales, procesando miles de pedidos al día.',
                                image: '/creative-logo.jpg',
                                badge: 'Scale-ups'
                            },
                            {
                                title: 'Aumenta las expectativas',
                                description: 'Grandes corporaciones confían en nuestra infraestructura para manejar picos de tráfico masivos y operaciones multicanal complejas sin interrupciones.',
                                image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                                badge: 'Grandes Empresas'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-3xl mb-8 aspect-[4/5] shadow-xl transition-all duration-500 group-hover:shadow-indigo-200">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-slate-100 uppercase tracking-widest">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Easy to Start Section (Shopify Style) */}
            <section className="bg-black py-24 sm:py-32 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center mb-16">
                    <h2 className="text-4xl font-light tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
                        Es muy <span className="font-extrabold italic">fácil</span> comenzar a vender
                    </h2>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Imageries */}
                        <div className="lg:col-span-7 grid grid-cols-2 gap-6 relative">
                            <div className="space-y-6 pt-12">
                                <img
                                    src="/laptop-girl.jpg"
                                    className="rounded-3xl shadow-2xl h-[450px] w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                    alt="Work on laptop"
                                />
                                <div className="absolute -bottom-10 -right-10 w-64 h-36 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-4 shadow-2xl hidden lg:block">
                                    <p className="text-white text-xs font-bold mb-2 uppercase tracking-widest text-indigo-400">Empresas Reales</p>
                                    <p className="text-white/80 text-sm">"Gestionar mi boutique nunca fue tan sencillo como ahora con Audaz."</p>
                                </div>
                            </div>
                            <div className="space-y-6 pt-0">
                                <img
                                    src="/creative-club.jpg"
                                    className="rounded-3xl shadow-2xl h-[350px] w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 shadow-indigo-500/20"
                                    alt="Successful owners"
                                />
                            </div>
                        </div>

                        {/* Steps List */}
                        <div className="lg:col-span-5 space-y-12">
                            {[
                                { num: '01', title: 'Agrega tu primer producto', detail: 'Sube fotos, define precios y configura tu stock en segundos.' },
                                { num: '02', title: 'Personaliza tu tienda', detail: 'Dale tu toque personal con nuestro constructor de páginas sin código.' },
                                { num: '03', title: 'Configura pagos', detail: 'Acepta tarjetas y efectivo con integración total y segura.' }
                            ].map((step, idx) => (
                                <div key={idx} className="group flex items-start gap-8 py-8 border-b border-white/10 last:border-0 hover:bg-white/[0.02] transition-colors rounded-xl px-4">
                                    <span className="text-indigo-400 font-extrabold text-2xl group-hover:scale-125 transition-transform duration-300">{step.num}</span>
                                    <div>
                                        <h3 className="text-white text-3xl font-bold mb-2 group-hover:text-indigo-400 transition-colors tracking-tight">{step.title}</h3>
                                        <p className="text-slate-400 text-lg leading-relaxed">{step.detail}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8">
                                <Link href={route('register')}>
                                    <Button size="lg" className="h-16 px-12 bg-white text-black text-xl font-bold rounded-full hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                                        Comienza ya
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* No-Code Page Builder Section */}
            <section className="bg-white py-24 sm:py-32 overflow-hidden border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 mb-6">
                                Page Builder
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                Tu tienda, <span className="text-indigo-600">tú diseño</span>. Sin una sola línea de código.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Nuestra potente herramienta de construcción visual te permite personalizar cada pixel de tu tienda con <strong>Audaz</strong>. Arrastra, suelta y observa los cambios en tiempo real.
                            </p>
                            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-slate-600 lg:max-w-none">
                                {[
                                    { name: 'Personalización Total', description: 'Cambia fuentes, colores, espaciados y estructuras con un clic.', icon: <Layers className="absolute left-1 top-1 h-5 w-5 text-indigo-600" /> },
                                    { name: 'Plantillas Profesionales', description: 'Comienza con diseños de clase mundial y hazlos tuyos.', icon: <Zap className="absolute left-1 top-1 h-5 w-5 text-indigo-600" /> },
                                    { name: 'Vista Previa en Vivo', description: 'Asegúrate de que todo se vea perfecto antes de publicar.', icon: <Smartphone className="absolute left-1 top-1 h-5 w-5 text-indigo-600" /> }
                                ].map((feature) => (
                                    <div key={feature.name} className="relative pl-9 group">
                                        <dt className="inline font-bold text-slate-900">
                                            {feature.icon}
                                            {feature.name}
                                        </dt>{' '}
                                        <dd className="inline">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="relative">
                            <img
                                src="/builder.jpeg"
                                alt="Visual Page Builder"
                                className="w-[48rem] max-w-none rounded-2xl shadow-2xl ring-1 ring-slate-400/10 lg:w-[50rem] transition-all hover:scale-[1.02] duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Dark Device Section (Shopify Style) */}
            <section className="bg-black py-24 sm:py-32 overflow-hidden text-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16">
                        <p className="text-emerald-400 font-bold mb-4 tracking-widest uppercase text-sm">Computadoras y dispositivos móviles</p>
                        <h2 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                            Cuida tu negocio
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1: Desktop/Dashboard */}
                        <div className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 transition-all duration-500 hover:border-emerald-500/30">
                            <img
                                src="/laptop.jpg"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                alt="Dashboard experience"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            <div className="absolute bottom-12 left-12 right-12 z-10">
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">Gestiona todo en un solo lugar</h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                    Desde la oficina administrativa hasta la tienda física, siempre tendrás el poder con el panel de control de <span className="text-white font-bold underline decoration-emerald-500">Audaz</span> totalmente centralizado.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Mobile/Flexibility */}
                        <div className="group relative h-[400px] md:h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 transition-all duration-500 hover:border-indigo-500/30">
                            <img
                                src="/laptop-cafe.jpg"
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                alt="Mobile experience"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            <div className="absolute bottom-12 left-12 right-12 z-10">
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">Gestiona tu tienda desde cualquier lugar</h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                    Haz todo desde tu bolsillo con la completa adaptabilidad móvil de <span className="text-white font-bold underline decoration-indigo-500">Audaz</span>. Tu negocio siempre está contigo, donde quieras que estés.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-widest">Precios</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Planes que crecen contigo</p>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Encuentra el plan perfecto para el tamaño actual de tu negocio y escala cuando estés listo.
                        </p>
                    </div>

                    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
                        {subscriptionPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all duration-300 hover:shadow-2xl ${plan.is_featured
                                    ? 'bg-slate-900 text-white ring-slate-900 shadow-xl scale-105 z-10'
                                    : 'bg-white text-slate-900 ring-slate-200'
                                    }`}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold leading-8">{plan.name}</h3>
                                    <p className={`mt-4 text-sm leading-6 ${plan.is_featured ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {plan.description}
                                    </p>
                                    <div className="mt-6 flex items-baseline gap-x-1">
                                        <span className="text-4xl font-bold tracking-tight">
                                            {plan.is_trial ? '0' : new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: plan.currency,
                                            }).format(plan.price)}
                                        </span>
                                        <span className={`text-sm font-semibold leading-6 ${plan.is_featured ? 'text-slate-300' : 'text-slate-600'}`}>
                                            / mes
                                        </span>
                                    </div>
                                    <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${plan.is_featured ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {plan.features?.map((feature, idx) => (
                                            <li key={idx} className="flex gap-x-3">
                                                <Check className={`h-6 w-5 flex-none ${plan.is_featured ? 'text-indigo-400' : 'text-indigo-600'}`} aria-hidden="true" />
                                                {feature}
                                            </li>
                                        ))}
                                        {plan.limits && Object.entries(plan.limits).map(([key, value], idx) => (
                                            <li key={`limit-${idx}`} className="flex gap-x-3 text-sm italic">
                                                <Layers className={`h-6 w-5 flex-none ${plan.is_featured ? 'text-indigo-400' : 'text-indigo-600'}`} aria-hidden="true" />
                                                Límite de {key.replace('_', ' ')}: {value === -1 ? 'Ilimitado' : value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link
                                    href={route('register')}
                                    className="mt-8"
                                >
                                    <Button
                                        className={`w-full h-12 text-md font-bold rounded-xl transition-all ${plan.is_featured
                                            ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                            : 'bg-slate-900 hover:bg-slate-800'
                                            }`}
                                    >
                                        Comenzar con {plan.name}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        ¿Listo para llevar tu negocio al siguiente nivel con Audaz?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                        Únete hoy mismo y comienza a disfrutar de la mejor experiencia de usuario para tu comercio.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link href={route('register')}>
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 font-bold px-8 h-14 text-lg">
                                Registrarse Ahora
                            </Button>
                        </Link>
                        <Link href={route('login')} className="text-md font-bold leading-6 text-white hover:text-indigo-100 transition-colors">
                            Iniciar Sesión <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        {/* Brand Section */}
                        <div className="space-y-8">
                            <Link href="/" className="flex items-center gap-3">
                                <ApplicationLogo className="h-10 w-auto" />
                            </Link>
                            <p className="text-sm leading-6 text-slate-600 max-w-xs">
                                Potenciando la próxima generación de emprendedores digitales con herramientas de clase mundial.
                            </p>
                        </div>

                        {/* Links Sections */}
                        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Plataforma</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><Link href={route('pricing')} className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Planes</Link></li>
                                        <li><Link href={route('login')} className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Iniciar Sesión</Link></li>
                                        <li><Link href={route('register')} className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Crear Tienda</Link></li>
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Legal</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><Link href="#" className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Privacidad</Link></li>
                                        <li><Link href="#" className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Términos</Link></li>
                                        <li><Link href="#" className="text-sm leading-6 text-slate-600 hover:text-indigo-600 transition-colors">Cookies</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-start space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Síguenos</h3>
                                <div className="flex gap-6">
                                    <a href="https://www.facebook.com/profile.php?id=61587188022464&mibextid=wwXIfr&rdid=9rYdEayyihYlWcAA&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DMaeeTrSJ%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
                                        <Facebook className="h-7 w-7" />
                                    </a>
                                    <a href="https://www.instagram.com/knots.agency?igsh=ZXJicjBjcTFwOG92" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
                                        <Instagram className="h-7 w-7" />
                                    </a>
                                    <a href="https://www.linkedin.com/showcase/knotsagencyfp/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
                                        <Linkedin className="h-7 w-7" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-16 border-t border-slate-100 pt-8 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <p className="text-xs leading-5 text-slate-400">
                                &copy; {new Date().getFullYear()} Audaz Platform. Todos los derechos reservados.
                            </p>
                            {/* <span className="hidden md:block h-4 w-px bg-slate-200"></span> */}
                            <p className="text-xs text-slate-400">
                                Desarrollado por{' '}
                                <a
                                    href="https://knots.agency/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                                >
                                    Knots Agency
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
