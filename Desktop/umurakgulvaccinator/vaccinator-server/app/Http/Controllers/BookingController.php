<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Booking;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    function processBooking(Request $request) {
        $rules = $this -> writeRules();

        $validator = Validator::make($request -> all(), $rules);

        if ($validator -> fails()) {
            return response() -> json(["errors" => $validator -> errors()],
                Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            $data = $validator -> validated();
            
            $booking = $this -> buildBooking($data);
            $booking -> save();

            return $booking;
        }
    }

    function writeRules(){
        return ["patientname" => "required|string|max:50",
                "vaccine" => "required",
                "date" => "required|date|after:today",
                "allergies" => "nullable|string"];
    }

    function buildBooking($data) {
        $booking = new Booking();

        $booking -> patientname = $data["name"];
        $booking -> vaccine = $data["vaccine"];
        $booking -> date = $data["date"];
        $booking -> allergies = $data["allergies"];

        return $booking;
    }
}
