<?php

require_once "api/model/UserModel.php";
require_once "api/utils/Response.php";

class UserController {

    public static function all() {
        $users = UserModel::getAll();
        Response::ok($users);
    }

    public static function login() {
        $token = UserModel::login($_POST["username"], $_POST["password"]);
        if ($token) {
            Response::ok(array("token" => $token));
        } else {
            Response::error401();
        }
    }

    public static function register() {

    }
}