<?php

require_once "api/model/DBInit.php";
require_once "api/model/AuthModel.php";

require_once "api/utils/Service.php";

class UserModel {

    public static function login($email, $password) {
        $db = DBInit::connect();

        $query = "SELECT id FROM user WHERE email = :email AND password = :password";
        $stmt = $db->prepare($query);
        $pwd = Service::hash($email, $password);

        $stmt->execute(array('email' => $email, 'password' => $pwd));
        if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $token = Service::uuid();
            AuthModel::create($user['id'], $token);
            return $token;
        }

        return false;
    }

    public static function register($fullname, $email, $password) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            INSERT INTO user (fullname, email, password)
            VALUES (:fullname, :email, :password)
        ");

        $pwd = Service::hash($email, $password);

        $statement->bindParam(":fullname", $fullname);
        $statement->bindParam(":email", $email);
        $statement->bindParam(":password", $pwd);
        $statement->execute();

        return true;
    }

    public static function get_invoices($user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, image, date, amount, notes FROM invoice WHERE user_id = :user_id ORDER BY date");
        $statement->execute(array('user_id' => $user_id));

        return $statement->fetchAll();  
    }

    public static function userExists($email) {
        $db = DBInit::connect();

        $query = "SELECT COUNT(id) FROM user WHERE email = :email";
        $stmt = $db->prepare($query);

        $stmt->execute(array('email' => $email));
        return $stmt->fetchColumn(0) == 1;
    }

    public static function get_all() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, fullname, email FROM user ORDER BY fullname");
        $statement->execute();

        return $statement->fetchAll();
    }
}
