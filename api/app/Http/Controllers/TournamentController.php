<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    public function index()
    {
        return response()->json(Tournament::with('club')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'club_id' => 'required|exists:clubs,id',
            'date' => 'required|date',
        ]);

        $tournament = Tournament::create($validated);
        return response()->json($tournament->load('club'), 201);
    }

    public function show($id)
    {
        return response()->json(Tournament::with(['club', 'matches.athletes', 'registrations.athlete.user'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tournament = Tournament::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'club_id' => 'sometimes|required|exists:clubs,id',
            'date' => 'sometimes|required|date',
        ]);

        $tournament->update($validated);
        return response()->json($tournament->load('club'));
    }

    public function destroy($id)
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->delete();
        return response()->json(null, 24);
    }
}
