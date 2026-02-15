<?php

use App\Http\Controllers\ClubController;
use App\Http\Controllers\AthleteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ApparelController;

// Rutas Públicas
Route::get('/apparel/check/{shirt_id}', [ApparelController::class, 'check']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/tournaments', [TournamentController::class, 'index']);
Route::get('/tournaments/{id}', [TournamentController::class, 'show']);
Route::get('/clubs', [ClubController::class, 'index']);
Route::get('/clubs/{id}', [ClubController::class, 'show']);
Route::get('/athletes', [AthleteController::class, 'index']);
Route::get('/athletes/{id}', [AthleteController::class, 'show']);
Route::get('/matches', [GameController::class, 'index']);

// Rutas Protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestión Administrativa
    Route::apiResource('clubs', ClubController::class)->except(['index', 'show']);
    Route::apiResource('athletes', AthleteController::class)->except(['index', 'show']);
    Route::apiResource('tournaments', TournamentController::class)->except(['index', 'show']);

    Route::apiResource('teams', TeamController::class);
    Route::apiResource('apparels', ApparelController::class);
    Route::patch('/matches/{id}/score', [GameController::class, 'updateScore']);
});
