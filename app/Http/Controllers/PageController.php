<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends RoutingController
{
    public function __construct()
    {
        $this->middleware('can:admin.pages.index')->only('index');
        $this->middleware('can:admin.pages.create')->only('create', 'store');
        $this->middleware('can:admin.pages.edit')->only('edit', 'update');
        $this->middleware('can:admin.pages.delete')->only('destroy');
    }
    /**
     * Display a listing of the resource.s
     */
    public function index()
    {
        $pages = Page::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Index', compact('pages', 'role', 'permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Create', compact('role', 'permission'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        Page::create(array_merge(
            $request->only(
                'title',
                'content',
                // 'is_default',
                'is_published',
                // 'is_homepage',
            ),
            ['company_id' => $user->company_id]
        ));

        return to_route('pages.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Pages/Edit', compact('page', 'role', 'permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        $data = $request->only(
            'title',
            'content',
            // 'is_default',
            'is_published',
            // 'is_homepage',
            // 'sort_order',
        );

        $page->update($data);

        return to_route('pages.edit', $page);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        $page->delete();
    }
}
