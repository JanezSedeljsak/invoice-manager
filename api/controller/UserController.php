<?php

require_once "api/model/UserModel.php";
require_once "api/utils/Response.php";

class UserController {

    public static function login() {
       if (UserDB::validLoginAttempt($_POST["username"], $_POST["password"])) {
            $vars = [
                "username" => $_POST["username"],
                "password" => $_POST["password"]
            ];

            Response::ok($vars);
       } else {
            Response::error401();
       }
    }
}