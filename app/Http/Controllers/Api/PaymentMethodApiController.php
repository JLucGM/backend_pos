<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodApiController extends Controller
{
    public function show()
    {
        $paymentMethod = PaymentMethod::with('details')->get();

        return response()->json([
            "message" => "success",
            "paymentMethod" => $paymentMethod
        ], Response::HTTP_OK);
    }
}
