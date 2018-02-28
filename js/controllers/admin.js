app.controller('adminCtrl', function($scope) {
    $scope.backToStartPage = function() {
        $scope.current.page = 1;
        $scope.login.name = '';
        $scope.login.pass = '';
    };

    $scope.editTr = function(parametr1, parametr2) {
        for (var i = 0; i < parametr1.length; i++) {
            parametr1[i].edit = false;
        }
        parametr2.edit = true;
    };

    $scope.addNewManager = function() {
        var flag = 0;
        $scope.newManager = {
            name: 'Новый',
            login: 'new',
            passward: 'new',
            admission: false
        };
        for (var i = 0; i < $scope.items.length; i++) {
            if ($scope.items[i].login == $scope.newManager.login) {
                flag++;
            }
        }
        if (!flag) {
            $scope.items.push($scope.newManager);
        } else {
            alert('Такой менеджер уже существует!');
        }
    };

    $scope.delete = function(par) {
        $scope.items.splice($scope.items.indexOf(par), 1);
    }

});