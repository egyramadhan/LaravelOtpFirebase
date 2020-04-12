<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use validate;

class HomeController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'name'    => 'required',
            'email'   => 'required|email',
            'phone-number' => 'required'
        ]);

     
        User::create($request->all());
        return json_encode(array(
            "statusCode"=>200
        ));
    }
}
