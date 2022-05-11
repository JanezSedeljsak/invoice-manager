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

    public static function login($email, $password) {
        $db = DBInit::connect();

        $query = "SELECT id FROM user WHERE email = :email AND password = :password";
        $stmt = $db->prepare($query);
        $pwd = Service::hash($email, $password);

        $stmt->execute(array('email' => $email, 'password' => $pwd));
        if ($user = $stmt->fetch()) {
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

        $statement = $db->prepare("
            SELECT i.id, i.image, i.date, i.amount, i.notes, g.id, g.name
            FROM invoice i
            LEFT OUTER JOIN `group_invoice` gi ON gi.invoice_id = i.id
            LEFT OUTER JOIN `group` g ON gi.group_id = g.id
            WHERE i.user_id = :user_id 
            ORDER BY i.date
        ");
        $statement->execute(array('user_id' => $user_id));

        return $statement->fetchAll();  
    }

    public static function get_groups($user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT g.id, g.name
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

        $statement = $db->prepare("SELECT id, fullname, email FROM user ORDER BY fullname");
        $statement->execute();

        $users = $statement->fetchAll();
        /*$ids = array();

        foreach ($users as $user) {
            $ids[$user['id']] = true;
        }

        $ids = array_keys($ids);
        $joined_ids = implode(", ", $ids);
        
        $query = sprintf("
            SELECT g.id, g.name 
            FROM group_user gu
            INNER JOIN `group` g ON g.id = gu.user_id
            WHERE gu.user_id IN (%s)
            ORDER BY g.name
        ", $joined_ids);


        $statement = $db->prepare($query);
        $statement->execute();
        $user_groups = $statement->fetchAll();
        var_dump($user_groups);*/
        
        return $users;
    }
}
