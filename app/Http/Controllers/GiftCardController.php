<?php

namespace App\Http\Controllers;

use App\Http\Requests\GiftCards\StoreRequest;
use App\Http\Requests\GiftCards\UpdateRequest;
use App\Models\GiftCard;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GiftCardController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.giftCards.index')->only('index');
        $this->middleware('can:admin.giftCards.create')->only('create', 'store');
        $this->middleware('can:admin.giftCards.edit')->only('edit', 'update');
        $this->middleware('can:admin.giftCards.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $giftCards = GiftCard::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('GiftCards/Index', compact('giftCards', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::role('client')->get();

        return Inertia::render('GiftCards/Create', compact('users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        // Asignar el valor de initial_balance a current_balance
        $data = $request->all();
        $data['current_balance'] = $data['initial_balance'];

        // Convertir expiration_date a formato Y-m-d
        if (isset($data['expiration_date'])) {
            $data['expiration_date'] = \Carbon\Carbon::parse($data['expiration_date'])->format('Y-m-d');
        }

        $giftCard = GiftCard::create($data + ['company_id' => Auth::user()->company_id]);

        return to_route('giftCards.edit', $giftCard);
    }


    /**
     * Display the specified resource.
     */
    public function show(GiftCard $giftCard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GiftCard $giftCard)
    {
        $users = User::role('client')->get();

        return Inertia::render('GiftCards/Edit', compact('giftCard', 'users'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, GiftCard $giftCard)
    {
        // Asignar el valor de initial_balance a current_balance
        $data = $request->all();
        $data['current_balance'] = $data['initial_balance'];

        // Convertir expiration_date a formato Y-m-d
        if (isset($data['expiration_date'])) {
            $data['expiration_date'] = \Carbon\Carbon::parse($data['expiration_date'])->format('Y-m-d');
        }

        $giftCard->update($data);

        return to_route('giftCards.edit', $giftCard);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GiftCard $giftCard)
    {
        $giftCard->delete();

        // return to_route('giftCards.index');
    }
}
