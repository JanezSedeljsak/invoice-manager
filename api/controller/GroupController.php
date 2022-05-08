<?php

require_once("api/model/GroupModel.php");
require_once("api/utils/Response.php");

class GroupController {

    public static function all() {
        $groups = GroupModel::getAll();
        Response::ok($groups);
    }
    
}