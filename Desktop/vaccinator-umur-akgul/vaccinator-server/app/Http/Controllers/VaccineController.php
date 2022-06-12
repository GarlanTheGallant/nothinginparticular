<?php

namespace App\Http\Controllers;

use App\Models\Vaccine;
use Illuminate\Http\Request;

class VaccineController extends Controller
{
    function vaccines() {
        return ["data" => Vaccine::all()];
    }
    
}
