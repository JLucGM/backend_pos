import { Head, Link } from '@inertiajs/react';
import React from 'react';
import {
    Check,
    X,
    ChevronLeft,
    Zap,
    Shield,
    Smartphone,
    Layers,
    Users,
    BarChart3,
    Store,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function PricingComparison({ auth, subscriptionPlans = [] }) {
    // Definimos las características que queremos comparar de forma explícita
    const comparisonFeatures = [
        { name: 'Multi-Tienda', key: 'multi_store', description: 'Capacidad para gestionar múltiples locales.' },
        { name: 'Soporte 24/7', key: 'support', description: 'Atención prioritaria en cualquier momento.' },
        { name: 'Análisis Avanzado', key: 'analytics', description: 'Reportes detallados y predicciones de ventas.' },
        { name: 'SEO Personalizado', key: 'seo', description: 'Control total sobre meta tags y visibilidad.' },
        { name: 'Backups Diarios', key: 'backups', description: 'Tus datos siempre seguros y respaldados.' },
        { name: 'Dominios Personalizados', key: 'custom_domains', description: 'Usa tu propia URL para cada tienda.' },
        { name: 'API de Integración', key: 'api', description: 'Accede a tus datos mediante nuestra robusta API.' },
    ];

    // Función para verificar si un plan tiene una característica basada en su descripción o límites
    const hasFeature = (plan, featureKey) => {
        const desc = plan.description.toLowerCase();
        const features = plan.features?.map(f => f.toLowerCase()) || [];
        
        switch (featureKey) {
            case 'multi_store': return plan.limits?.shops > 1 || plan.limits?.shops === -1;
            case 'support': return desc.includes('soporte') || features.some(f => f.includes('soporte'));
            case 'analytics': return desc.includes('análisis') || features.some(f => f.includes('análisis')) || plan.price > 50;
            case 'seo': return features.some(f => f.includes('seo')) || plan.price > 20;
            case 'backups': return plan.price > 10;
            case 'custom_domains': return plan.price > 40;
            case 'api': return plan.price > 60;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Head title="Compara nuestros planes - POS SaaS" />

            {/* Navigation (Consistent with Welcome.jsx) */}
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-200">
                                P
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-800">POS SaaS</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
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

            <header className="bg-white py-16 sm:py-24 border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <Link href={route('home')} className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 mb-6 hover:translate-x-[-4px] transition-transform">
                        <ChevronLeft className="h-4 w-4" /> Volver al Inicio
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                        Elige el plan <span className="text-indigo-600">perfecto</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto">
                        Compara las características detalladas de cada plan y encuentra la solución que mejor se adapte a las necesidades de tu negocio.
                    </p>
                </div>
            </header>

            <main className="py-24 sm:py-32" id="comparison-table">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Comparison Table for Large Screens */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 bg-slate-50 py-4 pr-6 text-sm font-semibold text-slate-400">Característica</th>
                                    {subscriptionPlans.map((plan) => (
                                        <th key={plan.id} className="py-4 px-6 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${
                                                    plan.is_featured ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {plan.name}
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: plan.currency,
                                                    }).format(plan.price)}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {/* Limits Section */}
                                <tr className="bg-slate-100/50">
                                    <td colSpan={subscriptionPlans.length + 1} className="py-4 px-4 text-sm font-bold uppercase tracking-widest text-slate-500">
                                        Límites y Capacidades
                                    </td>
                                </tr>
                                <tr>
                                    <td className="sticky left-0 bg-white py-6 pr-6 font-medium text-slate-900">Establecimientos / Tiendas</td>
                                    {subscriptionPlans.map((plan) => (
                                        <td key={plan.id} className="py-6 px-6 text-center text-slate-600">
                                            {plan.limits?.shops === -1 ? 'Ilimitados' : plan.limits?.shops || '1'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="sticky left-0 bg-white py-6 pr-6 font-medium text-slate-900">Productos permitidos</td>
                                    {subscriptionPlans.map((plan) => (
                                        <td key={plan.id} className="py-6 px-6 text-center text-slate-600">
                                            {plan.limits?.products === -1 ? 'Ilimitados' : (plan.limits?.products || '0').toLocaleString()}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="sticky left-0 bg-white py-6 pr-6 font-medium text-slate-900">Usuarios por tienda</td>
                                    {subscriptionPlans.map((plan) => (
                                        <td key={plan.id} className="py-6 px-6 text-center text-slate-600">
                                            {plan.limits?.users === -1 ? 'Ilimitados' : plan.limits?.users || '0'}
                                        </td>
                                    ))}
                                </tr>

                                {/* Features Section */}
                                <tr className="bg-slate-100/50">
                                    <td colSpan={subscriptionPlans.length + 1} className="py-4 px-4 text-sm font-bold uppercase tracking-widest text-slate-500">
                                        Funcionalidades Incluidas
                                    </td>
                                </tr>
                                {comparisonFeatures.map((feature) => (
                                    <tr key={feature.key} className="hover:bg-slate-50 transition-colors">
                                        <td className="sticky left-0 bg-white py-6 pr-6 group">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{feature.name}</span>
                                                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{feature.description}</span>
                                            </div>
                                        </td>
                                        {subscriptionPlans.map((plan) => (
                                            <td key={plan.id} className="py-6 px-6 text-center">
                                                {hasFeature(plan, feature.key) ? (
                                                    <Check className="h-6 w-6 text-emerald-500 mx-auto" />
                                                ) : (
                                                    <X className="h-6 w-6 text-slate-300 mx-auto" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="sticky left-0 bg-slate-50 py-10 pr-6"></td>
                                    {subscriptionPlans.map((plan) => (
                                        <td key={plan.id} className="py-10 px-6 text-center">
                                            <Link href={route('register')}>
                                                <Button className={`w-full py-6 text-lg font-bold rounded-2xl ${
                                                    plan.is_featured ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800'
                                                }`}>
                                                    Elegir {plan.name}
                                                </Button>
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Mobile Comparison View */}
                    <div className="lg:hidden space-y-12">
                        {subscriptionPlans.map((plan) => (
                            <div key={plan.id} className={`rounded-3xl p-8 ring-1 ${
                                plan.is_featured ? 'bg-slate-900 text-white ring-slate-900 shadow-2xl' : 'bg-white text-slate-900 ring-slate-200'
                            }`}>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="text-4xl font-extrabold mb-6">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: plan.currency,
                                    }).format(plan.price)}
                                    <span className={`text-sm font-medium ${plan.is_featured ? 'text-slate-400' : 'text-slate-500'}`}>/ mes</span>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="pt-6 border-t border-current/10">
                                        <h4 className="font-bold mb-4 flex items-center gap-2">
                                            <Layers className="h-5 w-5" /> Límites del Plan
                                        </h4>
                                        <ul className="space-y-3 text-sm opacity-80">
                                            <li className="flex justify-between"><span>Tiendas:</span> <strong>{plan.limits?.shops === -1 ? 'Ilimitadas' : plan.limits?.shops || '1'}</strong></li>
                                            <li className="flex justify-between"><span>Productos:</span> <strong>{plan.limits?.products === -1 ? 'Ilimitados' : (plan.limits?.products || '0').toLocaleString()}</strong></li>
                                            <li className="flex justify-between"><span>Usuarios:</span> <strong>{plan.limits?.users === -1 ? 'Ilimitados' : plan.limits?.users || '0'}</strong></li>
                                        </ul>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-current/10">
                                        <h4 className="font-bold mb-4">Funciones Destacadas</h4>
                                        <ul className="space-y-3">
                                            {comparisonFeatures.map((feature) => (
                                                <li key={feature.key} className="flex items-center gap-3 text-sm">
                                                    {hasFeature(plan, feature.key) ? (
                                                        <Check className={`h-5 w-5 ${plan.is_featured ? 'text-indigo-400' : 'text-emerald-500'}`} />
                                                    ) : (
                                                        <X className="h-5 w-5 opacity-30" />
                                                    )}
                                                    <span className={hasFeature(plan, feature.key) ? 'font-medium' : 'opacity-50'}>{feature.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <Link href={route('register')} className="mt-8 block">
                                    <Button className={`w-full h-14 text-lg font-bold rounded-2xl ${
                                        plan.is_featured ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800'
                                    }`}>
                                        Comenzar Ahora
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* FAQ Section */}
            <section className="bg-slate-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Preguntas Frecuentes</h2>
                        <p className="mt-4 text-lg text-slate-400">Todo lo que necesitas saber antes de elegir tu plan.</p>
                    </div>
                    <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { q: '¿Puedo cambiar de plan después?', a: 'Sí, puedes subir o bajar de nivel tu suscripción en cualquier momento. Los cambios se reflejarán en tu próxima factura.' },
                            { q: '¿Ofrecen periodos de prueba?', a: 'Sí, contamos con un plan gratuito de prueba para que explores nuestras funciones antes de comprometerte.' },
                            { q: '¿Qué formas de pago aceptan?', a: 'Aceptamos todas las tarjetas de crédito principales y transferencias bancarias directas.' },
                            { q: '¿Hay algún costo de instalación?', a: 'No. El registro y la configuración inicial son totalmente gratuitos y autogestionables.' }
                        ].map((faq, i) => (
                            <div key={i} className="space-y-3">
                                <h4 className="text-lg font-bold text-white">{faq.q}</h4>
                                <p className="text-slate-400 leading-relaxed text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t">
                <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                            P
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-800">POS SaaS</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} POS SaaS Platform.
                    </p>
                </div>
            </footer>
        </div>
    );
}
