<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Athlete;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        $query = Team::with(['athlete1', 'athlete2', 'tournament']);

        if ($request->has('tournament_id')) {
            $query->where('tournament_id', $request->tournament_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tournament_id' => 'required|exists:tournaments,id',
            'athlete1_id' => 'required|exists:athletes,id',
            'athlete2_id' => 'required|exists:athletes,id',
            'category' => 'required|string',
            'status' => 'nullable|string',
        ]);

        // Evitar que un atleta sea su propia pareja
        if ($validated['athlete1_id'] == $validated['athlete2_id']) {
            return response()->json(['message' => 'Un atleta no puede formar una dupla consigo mismo.'], 422);
        }

        $team = Team::create($validated);
        return response()->json($team->load(['athlete1', 'athlete2']), 201);
    }

    public function show($id)
    {
        return response()->json(Team::with(['athlete1', 'athlete2', 'tournament'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $validated = $request->validate([
            'tournament_id' => 'sometimes|required|exists:tournaments,id',
            'athlete1_id' => 'sometimes|required|exists:athletes,id',
            'athlete2_id' => 'sometimes|required|exists:athletes,id',
            'category' => 'sometimes|required|string',
            'status' => 'nullable|string',
        ]);

        $team->update($validated);
        return response()->json($team->load(['athlete1', 'athlete2']));
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(null, 204);
    }
}
