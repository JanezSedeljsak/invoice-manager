<?php

require_once "api/model/DBInit.php";

class ShoppingItemModel {

    public static function get($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT id, name, created_at, added_by, group_id
            FROM `shopping_item` 
            WHERE id = :id"
        );
        $statement->execute(array("id" => $id));

        return $statement->fetch();
    }

    public static function insert($user_id, $group_id, $name) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            INSERT INTO `shopping_item` (added_by, group_id, name) 
            VALUES (:user_id, :group_id, :name)");
        $statement->execute(array("user_id" => $user_id, "group_id" => $group_id, "name" => $name));
        return true;
    }

    public static function delete($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("DELETE FROM `shopping_item` WHERE id = :id");
        $statement->execute(array("id" => $id));
        return true;
    }
}

?>