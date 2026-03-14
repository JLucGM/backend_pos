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
    Users
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Welcome({ auth, subscriptionPlans = [] }) {
    const benefits = [
        {
            title: 'Multi-Tienda Increíble',
            description: 'Gestiona múltiples establecimientos desde un solo panel administrativo con aislamiento total de datos.',
            icon: <Store className="w-6 h-6 text-indigo-500" />
        },
        {
            title: 'Rendimiento Superior',
            description: 'Arquitectura optimizada con Laravel 11 y React para una velocidad de carga ultrarrápida.',
            icon: <Zap className="w-6 h-6 text-amber-500" />
        },
        {
            title: 'Seguridad Empresarial',
            description: 'Protección de datos garantizada y aislamiento lógico por empresa (Multi-tenancy).',
            icon: <Shield className="w-6 h-6 text-emerald-500" />
        },
        {
            title: 'Análisis Detallado',
            description: 'Reportes en tiempo real y análisis de ventas para tomar decisiones basadas en datos.',
            icon: <BarChart3 className="w-6 h-6 text-rose-500" />
        },
        {
            title: 'SEO Dinámico',
            description: 'Meta tags inyectados automáticamente para que tus productos brillen en los buscadores.',
            icon: <Globe className="w-6 h-6 text-sky-500" />
        },
        {
            title: 'Diseño Adaptativo',
            description: 'Tu tienda se verá perfecta en cualquier dispositivo, desde móviles hasta desktops.',
            icon: <Smartphone className="w-6 h-6 text-violet-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Head title="Bienvenido al Futuro del Ecommerce" />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-200">
                                P
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-800">POS SaaS</span>
                        </div>
                        
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
                                Crea, gestiona y escala tu tienda online con las herramientas más potentes del mercado. Diseñado para ofrecer una experiencia premium a tus clientes y una gestión eficiente para ti.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                <Link href={route('register')}>
                                    <Button size="lg" className="h-14 px-8 bg-indigo-600 text-lg font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700">
                                        Crear mi tienda ahora <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2">
                                    Ver Demo en Vivo
                                </Button>
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
                        <div className="relative mt-16 lg:col-span-5 lg:mt-0">
                            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                                <div className="relative overflow-hidden rounded-2xl bg-indigo-600/5 p-8 ring-1 ring-inset ring-indigo-600/10 shadow-2xl">
                                    <div className="space-y-6">
                                        <div className="h-4 w-1/3 rounded-full bg-indigo-200/50"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-full rounded-full bg-slate-200/50"></div>
                                            <div className="h-4 w-full rounded-full bg-slate-200/50"></div>
                                            <div className="h-4 w-2/3 rounded-full bg-slate-200/50"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-24 rounded-xl bg-white shadow-sm ring-1 ring-slate-200"></div>
                                            <div className="h-24 rounded-xl bg-white shadow-sm ring-1 ring-slate-200"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
                                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl"></div>
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
                            Hemos fusionado tecnología de vanguardia con una experiencia de usuario excepcional para que escales sin límites.
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
                                    src="/C:/Users/HOGAR/.gemini/antigravity/brain/c8382803-d6d2-45ea-b9e7-3172e6c5df0a/laptop_work_close_up_1773454077554.png"
                                    className="rounded-3xl shadow-2xl h-[400px] w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                    alt="Work on laptop"
                                />
                                <div className="absolute -bottom-10 -right-10 w-64 h-36 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-4 shadow-2xl hidden lg:block">
                                    <p className="text-white text-xs font-bold mb-2 uppercase tracking-widest text-indigo-400">Empresas Reales</p>
                                    <p className="text-white/80 text-sm">"Gestionar mi boutique nunca fue tan sencillo como ahora con POS SaaS."</p>
                                </div>
                            </div>
                            <div className="space-y-6 pt-0">
                                <img
                                    src="/C:/Users/HOGAR/.gemini/antigravity/brain/c8382803-d6d2-45ea-b9e7-3172e6c5df0a/boutique_owners_smiling_1773454044369.png"
                                    className="rounded-3xl shadow-2xl h-[500px] w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 shadow-indigo-500/20"
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
                                Nuestra potente herramienta de construcción visual te permite personalizar cada pixel de tu tienda. Arrastra, suelta y observa los cambios en tiempo real. Es tan fácil que cualquiera puede hacerlo.
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
                                src="/C:/Users/HOGAR/.gemini/antigravity/brain/c8382803-d6d2-45ea-b9e7-3172e6c5df0a/web_builder_mockup_1773454014597.png"
                                alt="Visual Page Builder"
                                className="w-[48rem] max-w-none rounded-2xl shadow-2xl ring-1 ring-slate-400/10 lg:w-[57rem] transition-all hover:scale-[1.02] duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Any Device Section */}
            <section className="bg-slate-900 py-24 sm:py-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
                        <div className="lg:order-last">
                            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                                Vende en <span className="text-indigo-400">cualquier lugar</span>. Desde cualquier dispositivo.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-slate-300">
                                Tu negocio no tiene fronteras. Nuestra plataforma está optimizada para smartphones, tablets y desktops, asegurando que nunca pierdas una venta, ya sea en tu local físico o en línea.
                            </p>
                            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                                    <Smartphone className="h-8 w-8 text-indigo-400" />
                                    <h3 className="text-xl font-bold text-white">Mobile First</h3>
                                    <p className="text-slate-400">Checkout optimizado para una experiencia móvil fluida.</p>
                                </div>
                                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                                    <Users className="h-8 w-8 text-indigo-400" />
                                    <h3 className="text-xl font-bold text-white">Sync en Tiempo Real</h3>
                                    <p className="text-slate-400">Inventario y ventas sincronizados al instante en todos tus equipos.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="/C:/Users/HOGAR/.gemini/antigravity/brain/c8382803-d6d2-45ea-b9e7-3172e6c5df0a/multi_device_pos_1773454029171.png"
                                alt="Multi-device support"
                                className="w-full max-w-none rounded-2xl shadow-2xl shadow-indigo-500/10 lg:w-[50rem] transition-all duration-700 hover:rotate-2"
                            />
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
                        ¿Listo para llevar tu negocio al siguiente nivel?
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
            <footer className="bg-white py-12 border-t">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                                P
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-800">POS SaaS</span>
                        </div>
                        <p className="text-sm text-slate-500">
                            &copy; {new Date().getFullYear()} POS SaaS Platform. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600">Privacidad</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600">Términos</Link>
                            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600">Contacto</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
