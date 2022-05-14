<?php

require_once "api/model/DBInit.php";

class GroupModel {

    public static function get_all() {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, name, created_at FROM `group` ORDER BY name");
        $statement->execute();

        return $statement->fetchAll();
    }

    public static function has_members_permissions($group_id, $user_id) {
        $members = GroupModel::get_members($group_id);
        foreach ($members as $member) {
            if ($member['id'] == $user_id) {
                return true;
            }
        }

        return false;
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
            SELECT u.id, u.fullname, u.email, u.registered_at, u.last_logged_in, gu.added_by, gu.joined_at, u2.fullname added_by_fullname, u2.email added_by_email
            FROM `user` u
            INNER JOIN `group_user` gu ON gu.user_id = u.id
            LEFT OUTER JOIN `user` u2 ON u2.id = gu.added_by 
            WHERE gu.group_id = :group_id 
            ORDER BY u.fullname
        ");
        $statement->execute(array('group_id' => $group_id));

        return $statement->fetchAll();  
    }

    public static function add_user($user_id, $group_id, $added_by) {
        $db = DBInit::connect();

        $statement = $db->prepare("INSERT INTO `group_user` (`group_id`, `user_id`, `added_by`) VALUES (:group_id, :user_id, :added_by)");
        $statement->execute(array("group_id" => $group_id, "user_id" => $user_id, "added_by" => $added_by));
        return true;
    }

    public static function get($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("SELECT id, name, created_at FROM `group` WHERE id = :id");
        $statement->execute(array("id" => $id));

        return $statement->fetch();
    }

    public static function insert($name, $user_id) {
        $db = DBInit::connect();

        $group_id = Service::uuid();
        $statement = $db->prepare("INSERT INTO `group` (`id`, `name`) VALUES (:group_id, :name)");
        $statement->execute(array("name" => $name, "group_id" => $group_id));

        $statement = $db->prepare("INSERT INTO `group_user` (group_id, user_id, added_by) VALUES (:group_id, :user_id, :added_by)");
        $statement->execute(array("group_id" => $group_id, "user_id" => $user_id, "added_by" => $user_id));
        return true;
    }

    public static function edit($id, $name) {
        $db = DBInit::connect();

        $stmt = $db->prepare("UPDATE `group` SET name = :name WHERE id = :id;");
        $stmt->execute(array('name' => $name, 'id' => $id));
        return true;
    }

    public static function delete($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("DELETE FROM `group` WHERE id = :id");
        $statement->execute(array("id" => $id));
        return true;
    }

    public static function users_not_int_group($id) {
        $db = DBInit::connect();

        $statement = $db->prepare("
            SELECT id, fullname, email, registered_at, last_logged_in FROM `user` WHERE id NOT IN (
                SELECT user_id FROM `group_user` WHERE group_id = :id
            )
        ");
        $statement->execute(array("id" => $id));
        
        return $statement->fetchAll();
    }
}
