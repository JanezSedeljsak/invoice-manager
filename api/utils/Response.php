<?php

class Response {

    public static function error400() {
        http_response_code(400);
        $response = sprintf("<!doctype html>\n" .
                            "<title>Error 400: Bad Request</title>\n" .
                            "<h1>Error 400: Bad Request</h1>\n".
                            "<p>Route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);
        echo $response;
    }

    public static function error401() {
        http_response_code(401);
        $response = sprintf("<!doctype html>\n" .
                            "<title>Error 401: Unauthorized</title>\n" .
                            "<h1>Error 401: Unauthorized</h1>\n".
                            "<p>You don't have permissions to access route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $response;
    }

    public static function error403() {
        http_response_code(403);
        $response = sprintf("<!doctype html>\n" .
                            "<title>Error 405: Method Forbidden!</title>\n" .
                            "<h1>Error 405: Method not allowed!</h1>\n".
                            "<p>Error occured on route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $response;
    }

    public static function error404() {
        http_response_code(404);
        $response = sprintf("<!doctype html>\n" .
                            "<title>Error 404: Page does not exist</title>\n" .
                            "<h1>Error 404: Page does not exist</h1>\n".
                            "<p>Error occured on route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $response;
    }

    public static function error405($message="...") {
        http_response_code(405);
        $response = sprintf("<!doctype html>\n" .
                            "<title>Error 405: Method not allowed!</title>\n" .
                            "<h1>Error 405: Method not allowed!</h1>\n".
                            "<div><b>%s</b></div>\n".
                            "<p>Error occured on route: <i>%s</i>.</p>", $message, $_SERVER["REQUEST_URI"]);

        echo $response;
    }

    public static function ok($results = array()) {
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        $response = json_encode($results, JSON_PRETTY_PRINT);
        echo $response;
    }
}
