<?php

require_once "api/model/DBInit.php";

class GroupModel {

    public static function get_all() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, name, created_at FROM `group` ORDER BY name");
        $statement->execute();

        return $statement->fetchAll();
    }

    public static function get_invoices($group_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, fullname, email FROM invoices WHERE group_id = :group_id");
        $statement->execute(array("group_id" => $group_id));

        return $statement->fetchAll();
    }

    public static function get_members($group_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT u.id, u.fullname, u.email
            FROM `user` u
            INNER JOIN `group_user` gu ON gu.user_id = u.id
            WHERE gu.group_id = :group_id 
            ORDER BY u.fullname
        ");
        $statement->execute(array('group_id' => $group_id));

        return $statement->fetchAll();  
    }

    public static function get($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, name FROM `group` WHERE id = :id");
        $statement->execute(array("id" => $id));

        return $statement->fetch();
    }

    public static function insert($name, $user_id) {
        $db = DBInit::connect();

        $statement = $db->prepare("INSERT INTO `group` (`name`) VALUES (:name)");
        $statement->execute(array("name" => $name));

        $group_id = $db->lastInsertId();
        $statement = $db->prepare("INSERT INTO `group_user` (group_id, user_id) VALUES (:group_id, :user_id)");
        $statement->execute(array("group_id" => $group_id, "user_id" => $user_id));
        return true;
    }

    public static function edit($id, $name, $user_id) {

    }

    public static function delete($id, $user_id) {}
}
