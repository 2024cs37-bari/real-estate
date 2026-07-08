<?php

namespace Zerp\RealEstate\Http\Requests;

class UpdatePropertyRequest extends StorePropertyRequest
{
    // Same rules as store; reference_no is system-generated, not user input.
}
