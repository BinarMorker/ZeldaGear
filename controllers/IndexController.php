<?php

namespace Apine\Controllers\User;

use Apine\MVC\Controller;
use Apine\MVC\HTMLView;

class IndexController extends Controller {

    public function index($params) {
        return new HtmlView('index');
    }

}