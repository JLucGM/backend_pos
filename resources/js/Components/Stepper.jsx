// @/Components/Stepper.jsx
import React from 'react';

export default function Stepper({ steps, activeStep, onStepChange }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={index}>
                            {/* Paso */}
                            <div className="flex flex-col items-center">
                                {/* Círculo del paso */}
                                <button
                                    type="button"
                                    onClick={() => onStepChange(index)}
                                    disabled={!isCompleted && !isActive}
                                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                        isActive
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : isCompleted
                                            ? 'border-green-600 bg-green-50 text-green-600'
                                            : 'border-gray-300 bg-white text-gray-400'
                                    } ${isCompleted || isActive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="font-semibold">{index + 1}</span>
                                    )}
                                </button>
                                
                                {/* Etiqueta del paso */}
                                <span className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                            
                            {/* Línea entre pasos (excepto el último) */}
                            {!isLast && (
                                <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}