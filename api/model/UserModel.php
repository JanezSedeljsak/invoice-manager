<?php

require_once "api/model/DBInit.php";

class UserDB {

    public static function validLoginAttempt($username, $password) {
        $db = DBInit::get();

        $query = "SELECT COUNT(id) FROM user WHERE username = :username AND password = :password";
        $stmt = $db->prepare($query);

        $stmt->execute(array('username' => $username, 'password' => $password));
        return $stmt->fetchColumn(0) == 1;
    }
}
