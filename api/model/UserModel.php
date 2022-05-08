<?php

require_once "api/model/DBInit.php";

class UserModel {

    private static function hash($password, $email) {
        $pepper = 'travel_manger' . $email;
        $hashed = hash_hmac('sha256', $password, $pepper);
        return $hashed;
    }

    public static function login($email, $password) {
        $db = DBInit::connect();

        $query = "SELECT COUNT(id) FROM user WHERE email = :email AND password = :password";
        $stmt = $db->prepare($query);

        $stmt->execute(array('email' => $email, 'password' => UserModel::hash($password)));
        return $stmt->fetchColumn(0) == 1;
    }

    public static function userExists($email) {
        $db = DBInit::connect();

        $query = "SELECT COUNT(id) FROM user WHERE email = :email";
        $stmt = $db->prepare($query);

        $stmt->execute(array('email' => $email));
        return $stmt->fetchColumn(0) == 1;
    }

    public static function getAll() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, fullname, email FROM user ORDER BY fullname");
        $statement->execute();

        return $statement->fetchAll();
    }

    public static function getInvoices($user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, fullname, email FROM user");
        $statement->execute();

        return $statement->fetchAll();
    }
}
