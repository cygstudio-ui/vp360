<?php

namespace App\Http\Controllers;

use App\Models\Athlete;
use Illuminate\Http\Request;

class AthleteController extends Controller
{
    public function index()
    {
        return response()->json(Athlete::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'nullable|string|in:1,2,3,4,5,6,7,OPEN,MASTER,JUNIOR',
            'ranking' => 'nullable|integer',
            'bio' => 'nullable|string',
            'stats' => 'nullable|array',
        ]);

        $athlete = Athlete::create($validated);
        return response()->json($athlete, 201);
    }

    public function show($id)
    {
        return response()->json(Athlete::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $athlete = Athlete::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'nullable|string|in:1,2,3,4,5,6,7,OPEN,MASTER,JUNIOR',
            'ranking' => 'nullable|integer',
            'bio' => 'nullable|string',
            'stats' => 'nullable|array',
        ]);

        $athlete->update($validated);
        return response()->json($athlete);
    }

    public function destroy($id)
    {
        $athlete = Athlete::findOrFail($id);
        $athlete->delete();
        return response()->json(null, 204);
    }
}
