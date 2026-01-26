import React from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';

export default function SubscriptionPlanCard({ 
    plan, 
    billingCycle = 'monthly',
    isSelected = false,
    isCurrentPlan = false,
    onSelect,
    processing = false,
    showSelectButton = true,
    buttonText = null,
    buttonVariant = null
}) {
    const formatPrice = (price, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const getPlanPrice = (plan, cycle) => {
        return cycle === 'yearly' && plan.yearly_price ? plan.yearly_price : plan.price;
    };

    const getPlanIcon = (planSlug) => {
        switch (planSlug) {
            case 'trial':
                return <Zap className="h-6 w-6 text-green-500" />;
            case 'basic':
                return <Star className="h-6 w-6 text-blue-500" />;
            case 'professional':
                return <Crown className="h-6 w-6 text-purple-500" />;
            case 'enterprise':
                return <Crown className="h-6 w-6 text-gold-500" />;
            default:
                return <Star className="h-6 w-6 text-gray-500" />;
        }
    };

    const getButtonStyle = () => {
        if (buttonVariant) return buttonVariant;
        
        if (isCurrentPlan) return 'bg-gray-400 cursor-not-allowed';
        if (plan.is_featured) return 'bg-purple-600 hover:bg-purple-700';
        if (plan.is_trial) return 'bg-green-600 hover:bg-green-700';
        return 'bg-blue-600 hover:bg-blue-700';
    };

    const getButtonText = () => {
        if (buttonText) return buttonText;
        
        if (processing) return 'Procesando...';
        if (isCurrentPlan) return 'Plan Actual';
        if (plan.is_trial) return 'Activar Prueba';
        return 'Seleccionar Plan';
    };

    const handleCardClick = () => {
        if (onSelect && !isCurrentPlan && !processing) {
            onSelect(plan);
        }
    };

    return (
        <Card 
            className={`relative transition-all duration-200 hover:shadow-lg ${
                isSelected 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : ''
            } ${isCurrentPlan 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : ''
            } ${plan.is_featured ? 'border-purple-500 shadow-lg' : ''} ${
                onSelect && !showSelectButton ? 'cursor-pointer' : ''
            }`}
            onClick={!showSelectButton ? handleCardClick : undefined}
        >
            {/* Badge de plan destacado */}
            {plan.is_featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">
                        Más Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    {getPlanIcon(plan.slug)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                    {plan.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
                <div className="mb-6">
                    <div className="text-4xl font-bold mb-1">
                        {plan.is_trial ? 'Gratis' : formatPrice(getPlanPrice(plan, billingCycle), plan.currency)}
                    </div>
                    {!plan.is_trial && (
                        <div className="text-sm text-gray-600">
                            por {billingCycle === 'yearly' ? 'año' : 'mes'}
                        </div>
                    )}
                    {plan.is_trial && (
                        <div className="text-sm text-gray-600">
                            {plan.trial_days} días de prueba
                        </div>
                    )}
                </div>

                <ul className="space-y-3 mb-6 text-left">
                    {plan.features?.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {showSelectButton && (
                    <Button
                        className={`w-full ${getButtonStyle()}`}
                        onClick={() => onSelect && onSelect(plan)}
                        disabled={processing || isCurrentPlan}
                    >
                        {getButtonText()}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}