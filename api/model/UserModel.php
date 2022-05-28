<?php

require_once "api/model/DBInit.php";
require_once "api/model/AuthModel.php";

require_once "api/utils/Service.php";

class UserModel {

    public static function validate_credentials($user_id, $email, $password) {
        $db = DBInit::connect();

        $query = "SELECT id FROM user WHERE email = :email AND password = :password AND id = :user_id";
        $stmt = $db->prepare($query);
        $pwd = Service::hash($email, $password);
        $stmt->execute(array('email' => $email, 'password' => $pwd, 'user_id' => $user_id));
        if ($user = $stmt->fetch()) {
            return true;
        }

        return false;
    }

    public static function update_credentials($user_id, $fullname, $email, $password) {
        $db = DBInit::connect();

        $query = "
                UPDATE `user`
                    SET fullname = :fullname,
                        email = :email,
                        password = :password
                WHERE id = :user_id;";
        
        $stmt = $db->prepare($query);
        $pwd = Service::hash($email, $password);
        $stmt->execute(array('fullname' => $fullname, 'email' => $email, 'password' => $pwd, 'user_id' => $user_id));
        return true;
    }

    private static function update_login($user_id) {
        $db = DBInit::connect();

        $stmt = $db->prepare("UPDATE `user` SET last_logged_in = NOW() WHERE id = :user_id;");
        $stmt->execute(array('user_id' => $user_id));

        return true;
    }

    public static function login($email, $password) {
        $db = DBInit::connect();

        $query = "SELECT id FROM user WHERE email = :email AND password = :password";
        $stmt = $db->prepare($query);
        $pwd = Service::hash($email, $password);

        $stmt->execute(array('email' => $email, 'password' => $pwd));
        if ($user = $stmt->fetch()) {
            $token = Service::uuid();
            AuthModel::create($user['id'], $token);
            UserModel::update_login($user['id']);
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

        $statement = $db->prepare("
            SELECT i.id, i.image, i.date, i.amount, i.notes, i.group_id, g.name AS group_name, s.name AS store
            FROM invoice i
            INNER JOIN store s ON i.store_id = s.id
            INNER JOIN `group` g ON i.group_id = g.id
            WHERE i.user_id = :user_id 
            ORDER BY i.date
        ");
        $statement->execute(array('user_id' => $user_id));

        return $statement->fetchAll();  
    }

    public static function get_user_by_email($email) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT email, fullname, registered_at FROM user
            WHERE email = :email;
        ");
        $statement->execute(array('email' => $email));

        return $statement->fetch();  
    }

    public static function get_groups($user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT g.id, g.name, g.created_at
            FROM `group` g
            INNER JOIN `group_user` gu ON gu.group_id = g.id
            WHERE gu.user_id = :user_id 
            ORDER BY g.name
        ");
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

        $statement = $db->prepare("SELECT id, fullname, email, registered_at, last_logged_in FROM user ORDER BY fullname");
        $statement->execute();

        $users = $statement->fetchAll();
        
        return $users;
    }
}
