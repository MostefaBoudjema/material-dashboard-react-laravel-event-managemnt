<?php

namespace App\Http\Requests\Api\V2;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'date_time' => 'required|date',
            'duration' => 'required|integer|max:2147483647',
            'location' => 'required|string',
            'capacity' => 'required|integer|max:2147483647',
            'waitlist_capacity' => 'required|integer|max:2147483647',
            'status' => 'required|string|in:published,draft',
        ];
    }
}
