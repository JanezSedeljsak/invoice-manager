<?php

class Response {

    public static function error404() {
        header('This is not the page you are looking for', true, 404);
        $html404 = sprintf("<!doctype html>\n" .
                            "<title>Error 404: Page does not exist</title>\n" .
                            "<h1>Error 404: Page does not exist</h1>\n".
                            "<p>Error occured on route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $html404;
    }

    public static function error401() {
        header('Unauthorized', true, 401);
        $html401 = sprintf("<!doctype html>\n" .
                            "<title>Error 401: Unauthorized</title>\n" .
                            "<h1>Error 401: Unauthorized</h1>\n".
                            "<p>You don't have permissions to access route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $html401;
    }

    public static function error405() {
        header('Method not allowed (bad request)', true, 405);
        $html405 = sprintf("<!doctype html>\n" .
                            "<title>Error 405: Method not allowed!</title>\n" .
                            "<h1>Error 405: Method not allowed!</h1>\n".
                            "<p>Error occured on route: <i>%s</i>.</p>", $_SERVER["REQUEST_URI"]);

        echo $html405;
    }

    public static function ok($results = array()) {
        header('Request parsed and returned response with status code 200!', true, 200);
        $response = json_encode($results, JSON_PRETTY_PRINT);
        echo $response;
    }
}
