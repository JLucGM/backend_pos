<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ClientApiController extends Controller
{
    // public function register(Request $request)
    // {

    //     $user = new User();
    //     $user->name = $request->name;
    //     $user->email = $request->email;
    //     $user->password = $request->password;
    //     $user->status = 1;
    //     $user->save();

    //     return response()->json(['message' => 'registered user'], 200);
    // }

    public function show()
    {
        $client = Client::all();

        return response()->json([
            "message" => "success",
            "client" => $client
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
{
    // Validar los datos de entrada
    $validator = Validator::make($request->all(), [
        'client_name' => 'required|string|max:255',
        'client_identification' => 'required|string|unique:clients,client_identification',
        'client_phone' => 'required|string', // Asegúrate de que sea un número de 10 dígitos
    ]);

    // Si la validación falla, devolver un error
    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Crear un nuevo cliente
    $client = new Client();
    $client->client_name = $request->client_name;
    $client->client_identification = $request->client_identification;
    $client->client_phone = $request->client_phone;
    $client->save();

    return response()->json(['message' => 'registered client'], 201);
}
}
