<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->status = 1;
        $user->save();

        return response()->json(['message' => 'registered user'], 200);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        // return response()->json([$credentials], 200);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);

            // return response()->json(['token' => $token], 200);
            return response(["token" => $token], Response::HTTP_OK)->withoutCookie($cookie);
        } else {
            return response(["message" => "credentials invalid"], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    public function profile(Request $request)
    {
        return response()->json([
            "message" => "success",
            "userData" => auth()->user()
        ], Response::HTTP_OK);
    }

    public function logout()
    {
        $cookie = Cookie::forget('cookie_token');
        return response(["message" => "cierre de sesion ok"], Response::HTTP_OK)->withCookie($cookie);
    }
}
