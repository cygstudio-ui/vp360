<?php

namespace App\Http\Controllers;

use App\Models\Apparel;
use App\Models\Game;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ApparelController extends Controller
{
    public function index()
    {
        return Apparel::with('athlete')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shirt_id' => 'required|string|unique:apparels,shirt_id',
            'athlete_id' => 'nullable|exists:athletes,id|unique:apparels,athlete_id',
        ]);

        $apparel = Apparel::create($validated);
        return response()->json($apparel->load('athlete'), 201);
    }

    public function update(Request $request, $id)
    {
        $apparel = Apparel::findOrFail($id);

        $validated = $request->validate([
            'shirt_id' => 'required|string|unique:apparels,shirt_id,' . $id,
            'athlete_id' => 'nullable|exists:athletes,id|unique:apparels,athlete_id,' . $id,
        ]);

        $apparel->update($validated);
        return response()->json($apparel->load('athlete'));
    }

    public function destroy($id)
    {
        $apparel = Apparel::findOrFail($id);
        $apparel->delete();
        return response()->json(null, 204);
    }

    public function check($shirt_id)
    {
        $apparel = Apparel::with(['athlete'])->where('shirt_id', $shirt_id)->first();

        if (!$apparel) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Franela no encontrada'
            ], 404);
        }

        if (!$apparel->athlete_id) {
            return response()->json([
                'status' => 'unassigned',
                'message' => 'Hola, Campeón. Registra tu armadura para acceder al mundo VP.'
            ]);
        }

        // Si está asignada, buscar el próximo partido del atleta
        $athlete = $apparel->athlete;

        // Buscar en match_players a través de la relación de athlete (esto depende de cómo estén los modelos)
        // Por simplicidad en este endpoint, buscaremos los partidos donde el atleta esté registrado
        $nextMatch = \DB::table('matches')
            ->join('match_players', 'matches.id', '=', 'match_players.match_id')
            ->where('match_players.athlete_id', $athlete->id)
            ->where('matches.start_time', '>', Carbon::now())
            ->where('matches.status', 'Pendiente')
            ->orderBy('matches.start_time', 'asc')
            ->select('matches.*')
            ->first();

        return response()->json([
            'status' => 'assigned',
            'athlete' => $athlete,
            'next_match' => $nextMatch ? [
                'day' => Carbon::parse($nextMatch->start_time)->translatedFormat('l'),
                'time' => Carbon::parse($nextMatch->start_time)->format('h:i A'),
                'raw_date' => $nextMatch->start_time
            ] : null
        ]);
    }
}
