<?php

require_once "api/model/DBInit.php";
require_once "api/utils/Service.php";

class AuthModel {
    public static function create($user_id, $token) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            INSERT INTO auth (user_id, token)
            VALUES (:user_id, :token)
        ");

        $statement->bindParam(":user_id", $user_id);
        $statement->bindParam(":token", $token);
        $statement->execute();
        return true;
    }

    // returns boolean (valid token exists) and sets superglobal _REQUEST['user_id']
    public static function validate($token) {
        $db = DBInit::connect();

        $query = "SELECT user_id FROM auth WHERE token = :token AND expiration > NOW()";
        $stmt = $db->prepare($query);

        $stmt->execute(array('token' => $token));
        if ($result = $stmt->fetch()) {
            $_REQUEST['user_id'] = $result['user_id'];
            return true;
        }

        return false;
    }
}

?>