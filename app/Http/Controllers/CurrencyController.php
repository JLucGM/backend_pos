<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Change the selected currency for the current session.
     */
    public function select(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:currencies,id',
        ]);

        session(['selected_currency_id' => $request->id]);

        return back();
    }
}
