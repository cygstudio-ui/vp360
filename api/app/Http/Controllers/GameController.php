<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return response()->json(Game::with(['tournament', 'club', 'athletes'])->get());
    }

    public function show($id)
    {
        return response()->json(Game::with(['tournament', 'club', 'athletes'])->findOrFail($id));
    }

    public function updateScore(Request $request, $id)
    {
        $request->validate([
            'score' => 'string',
            'current_points' => 'string',
            'status' => 'in:Pendiente,LIVE,Finalizado',
        ]);

        $game = Game::findOrFail($id);
        $game->update($request->only('score', 'current_points', 'status'));

        return response()->json([
            'message' => 'Marcador actualizado',
            'game' => $game->load('athletes')
        ]);
    }
}
