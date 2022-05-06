<?php

require_once("api/model/InvoiceModel.php");
require_once("api/utils/Response.php");

class InvoiceController {

    public static function all() {
        Response::ok(array("1", "2", 3));
    }
    
}