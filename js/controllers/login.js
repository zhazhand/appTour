app.controller('loginCtrl', function($scope) {
    $scope.pass = true;

    $scope.test = function() {
        if ($scope.login.name) {
            for (var i = 0; i < $scope.items.length; i++) {
                var name = $scope.login.name;
                name = new RegExp('^' + name + '$', 'i');
                if ($scope.items[i].login.search(name) != -1) { //проверка введенного логина (без учета регистра) на наличие в базе
                    $scope.login.state = true;
                    $scope.current.member = $scope.items[i];
                    break;
                } else {
                    $scope.login.state = false;
                }
            }
        }
    };

    $scope.toOpenData = function() {
        var tmp = $scope.current.member;
        if (tmp.login == 'admin') {
            $scope.current.page = 2;
        } else {
            if (tmp.admission) {
                $scope.current.page = 4;
            } else {
                $scope.current.page = 3;
            }
            $scope.login.name = '';
            $scope.login.pass = '';
        }
    };

});