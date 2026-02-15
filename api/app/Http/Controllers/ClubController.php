<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index()
    {
        return response()->json(Club::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'state' => 'nullable|string',
            'instagram' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $club = Club::create($validated);
        return response()->json($club, 201);
    }

    public function show($id)
    {
        return response()->json(Club::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $club = Club::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'state' => 'nullable|string',
            'instagram' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $club->update($validated);
        return response()->json($club);
    }

    public function destroy($id)
    {
        $club = Club::findOrFail($id);
        $club->delete();
        return response()->json(null, 204);
    }
}
