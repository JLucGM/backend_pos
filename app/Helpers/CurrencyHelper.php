<?php

namespace App\Helpers;

use App\Models\Setting;
use App\Models\Currency;
use Illuminate\Support\Facades\Auth;

class CurrencyHelper
{
    /**
     * Get the current company's currency
     */
    public static function getCurrentCurrency()
    {
        $user = Auth::user();
        
        if (!$user || !$user->company_id) {
            return Currency::where('code', 'USD')->first();
        }

        $setting = Setting::with('currency')
            ->where('company_id', $user->company_id)
            ->first();

        return $setting && $setting->currency ? $setting->currency : Currency::where('code', 'USD')->first();
    }

    /**
     * Format amount with current currency
     */
    public static function formatAmount($amount, $currency = null)
    {
        if (!$currency) {
            $currency = self::getCurrentCurrency();
        }

        return $currency->symbol . ' ' . number_format($amount, 2);
    }

    /**
     * Get currency symbol
     */
    public static function getCurrencySymbol($currency = null)
    {
        if (!$currency) {
            $currency = self::getCurrentCurrency();
        }

        return $currency->symbol;
    }

    /**
     * Get currency code
     */
    public static function getCurrencyCode($currency = null)
    {
        if (!$currency) {
            $currency = self::getCurrentCurrency();
        }

        return $currency->code;
    }
}