<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear Roles
        $superAdmin = Role::create(['name' => 'Super Administrador']);
        $admin = Role::create(['name' => 'Administrador']);
        $operator = Role::create(['name' => 'Operador']);
        $athlete = Role::create(['name' => 'Atleta']);

        // Crear Usuario SuperAdmin Inicial
        User::create([
            'name' => 'Admin VP360',
            'email' => 'admin@vp360.com',
            'password' => Hash::make('admin123'),
            'role_id' => $superAdmin->id,
        ]);
    }
}
