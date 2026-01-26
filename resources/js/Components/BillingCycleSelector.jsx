import React from 'react';
import { Badge } from '@/Components/ui/badge';

export default function BillingCycleSelector({ 
    billingCycle, 
    onCycleChange, 
    showSavingsBadge = true,
    savingsText = "Ahorra 2 meses"
}) {
    return (
        <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
                <button
                    type="button"
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                        billingCycle === 'monthly'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => onCycleChange('monthly')}
                >
                    Mensual
                </button>
                <button
                    type="button"
                    className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                        billingCycle === 'yearly'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => onCycleChange('yearly')}
                >
                    Anual
                    {showSavingsBadge && (
                        <Badge variant="secondary" className="ml-2">
                            {savingsText}
                        </Badge>
                    )}
                </button>
            </div>
        </div>
    );
}