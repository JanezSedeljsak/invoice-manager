<?php

require_once "api/model/DBInit.php";

class UserDB {

    public static function validLoginAttempt($email, $password) {
        $db = DBInit::get();

        $query = "SELECT COUNT(id) FROM user WHERE email = :email AND password = :password";
        $stmt = $db->prepare($query);

        $stmt->execute(array('email' => $email, 'password' => $password));
        return $stmt->fetchColumn(0) == 1;
    }

    public static function userExists($email) {
        $db = DBInit::get();

        $query = "SELECT COUNT(id) FROM user WHERE email = :email";
        $stmt = $db->prepare($query);

        $stmt->execute(array('email' => $email));
        return $stmt->fetchColumn(0) == 1;
    }
}
