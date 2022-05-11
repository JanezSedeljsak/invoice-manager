<?php

require_once("api/model/StoreModel.php");
require_once("api/utils/Response.php");

class StoreController {

    public static function all() {
        $stores = StoreModel::getAll();
        Response::ok($stores);
    }
    
}