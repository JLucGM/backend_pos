<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $company = Company::find($user->company_id);

        // Obtener media de la librería global de la empresa
        $libraryMedia = $company->getMedia('library')->map(function ($media) {
            $thumbUrl = $media->getUrl();
            try {
                if ($media->hasGeneratedConversion('thumb')) {
                    $thumbUrl = $media->getUrl('thumb');
                }
            } catch (\Exception $e) {}

            // Contar uso basado en el nombre del archivo
            $usageProducts = \Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $media->file_name)
                ->where('model_type', \App\Models\Product::class)->count();
            $usageCollections = \Spatie\MediaLibrary\MediaCollections\Models\Media::where('file_name', $media->file_name)
                ->where('model_type', \App\Models\Collection::class)->count();

            return [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->human_readable_size,
                'url' => $media->getUrl(),
                'thumb' => $thumbUrl,
                'usage_products' => $usageProducts,
                'usage_collections' => $usageCollections,
                'collection_name' => $media->collection_name,
                'created_at' => $media->created_at->diffForHumans(),
            ];
        });

        // Opcionalmente, podemos incluir imágenes de productos para tener una vista unificada
        $productMedia = Media::where('model_type', \App\Models\Product::class)
            ->whereHasMorph('model', [\App\Models\Product::class], function ($query) use ($user) {
                $query->where('company_id', $user->company_id);
            })
            ->get()
            ->map(function ($media) {
                $thumbUrl = $media->getUrl();
                try {
                    if ($media->hasGeneratedConversion('thumb')) {
                        $thumbUrl = $media->getUrl('thumb');
                    }
                } catch (\Exception $e) {}

                return [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'url' => $media->getUrl(),
                    'thumb' => $thumbUrl,
                    'collection_name' => 'products',
                    'model_id' => $media->model_id,
                    'product_name' => $media->model->product_name ?? 'Producto',
                    'created_at' => $media->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Media/Index', [
            'libraryMedia' => $libraryMedia,
            'productMedia' => $productMedia,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:10240', // 10MB
        ]);

        $user = Auth::user();
        $company = Company::find($user->company_id);

        $media = $company->addMedia($request->file('file'))
            ->toMediaCollection('library');

        return back()->with('success', 'Imagen subida a la librería correctamente.');
    }

    public function destroy(Media $media)
    {
        $user = Auth::user();
        
        // Verificar que el media pertenece a la empresa del usuario
        // Si el modelo es Company, verificar ID
        if ($media->model_type === Company::class && $media->model_id !== $user->company_id) {
            abort(403);
        }

        // Si el modelo es Product, Page o Collection, verificar que el modelo pertenece a la empresa
        if (in_array($media->model_type, [\App\Models\Product::class, \App\Models\Page::class, \App\Models\Collection::class])) {
            $model = $media->model;
            if ($model && $model->company_id !== $user->company_id) {
                abort(403);
            }
        }

        $media->delete();

        return back()->with('success', 'Imagen eliminada correctamente.');
    }

    /**
     * API para el MediaPicker (JSON)
     */
    public function apiIndex(Request $request)
    {
        $user = Auth::user();
        $company = Company::find($user->company_id);

        $media = $company->getMedia('library')->map(function ($media) {
            return [
                'id' => $media->id,
                'src' => $media->getUrl(),
                'alt' => $media->name,
                'media_id' => $media->id,
                'is_page_image' => true, // Tratamos la librería como "propias"
                'is_from_product' => false,
            ];
        });

        return response()->json($media);
    }
}
