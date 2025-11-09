// src/hooks/useGiftCards.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook personalizado para manejar gift cards en órdenes.
 * @param {Object} data - Datos de la orden (total, etc.).
 * @param {Object} selectedUser - Usuario seleccionado (con gift_cards).
 * @param {Function} setData - Función para actualizar data.
 * @returns {Object} Estados y funciones para gift cards.
 */
export const useGiftCards = (data, selectedUser, setData) => {
    const [giftCardCode, setGiftCardCode] = useState(data.gift_card_code || '');
    const [appliedGiftCard, setAppliedGiftCard] = useState(null);
    const [giftCardError, setGiftCardError] = useState('');

    // Limpia error al cambiar código
    useEffect(() => {
        setGiftCardError('');
    }, [giftCardCode]);

    // handleGiftCardApply: Valida y aplica la gift card
    const handleGiftCardApply = useCallback(() => {
        if (!giftCardCode.trim() || !selectedUser || !selectedUser.gift_cards) {
            setGiftCardError('Selecciona un usuario y ingresa un código válido.');
            return;
        }

        setGiftCardError(''); // Limpia error previo

        const giftCard = selectedUser.gift_cards.find(gc => gc.code === giftCardCode.trim());
        if (!giftCard) {
            setGiftCardError('Código de gift card no encontrado para este usuario.');
            setAppliedGiftCard(null);
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        if (!giftCard.is_active) {
            setGiftCardError('Esta gift card no está activa.');
            setAppliedGiftCard(null);
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        const now = new Date();
        const expiration = new Date(giftCard.expiration_date);
        if (now > expiration) {
            setGiftCardError('Esta gift card ha expirado.');
            setAppliedGiftCard(null);
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        const currentBalance = parseFloat(giftCard.current_balance);
        if (currentBalance <= 0) {
            setGiftCardError('Esta gift card no tiene balance disponible.');
            setAppliedGiftCard(null);
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        // Calcula el monto a aplicar: mínimo entre balance y total restante (subtotal + tax + shipping - descuentos)
        const remainingTotal = parseFloat(data.total) || 0; // Usa el total actual (ya incluye descuentos)
        const amountToApply = Math.min(currentBalance, remainingTotal);

        if (amountToApply <= 0) {
            setGiftCardError('El total de la orden ya está cubierto o es cero.');
            setAppliedGiftCard(null);
            setData('gift_card_id', null);
            setData('gift_card_amount', 0);
            return;
        }

        // Aplica la gift card
        setAppliedGiftCard({ ...giftCard, amount_used: amountToApply });
        setData('gift_card_id', giftCard.id);
        setData('gift_card_amount', amountToApply);
        toast.success(`Gift card aplicada: ${giftCard.code} - Monto usado: $${amountToApply.toFixed(2)}`);
    }, [giftCardCode, selectedUser, data.total, setData]);

    return {
        giftCardCode,
        setGiftCardCode,
        appliedGiftCard,
        handleGiftCardApply,
        giftCardError,
    };
};