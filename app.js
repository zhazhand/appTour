var app = angular.module("app", []);
app.controller('mainCtrl', function($scope, $http) {

    $http.get("office.json") //получаем JSON файл (список менеджеров и туристов) с помощью сервиса $http
    .success(function(response) {
        $scope.result = response;
        $scope.items = $scope.result[0];//массив менеджеров
        $scope.trsts = $scope.result[1];//массив туристов
    });
    

    $scope.currentMember; //текущий менеджер
    $scope.page = {
        current: 1 //текущая страница представления
    };
    $scope.login = {
        state: true,
        name: '',
        entry: false
    };
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller('loginCtrl', function($scope) {
    $scope.pass = true;

    $scope.test = function() {
        if ($scope.login.name) {
            for (var i = 0; i < $scope.items.length; i++) {
                var name = $scope.login.name;
                name = new RegExp('^' + name + '$', 'i');
                if ($scope.items[i].login.search(name) != -1) { //проверка введенного логина (без учета регистра) на наличие в базе
                    $scope.login.state = true;
                    $scope.$parent.currentMember = $scope.items[i];
                    break;
                } else {
                    $scope.login.state = false;
                }
            }
        }
    };

    $scope.toOpenData = function(param) {
        var log = $scope.login.name.toLowerCase();
        if (log == 'admin') {
            $scope.page.current = 2;
        } else {
            $scope.page.current = 3;
        }
    };
    
    $scope.addManager = function(par) {
        var newItem = {};
        newItem.name = 'Новенький';
        newItem.login = par.name;
        newItem.passward = par.pass;
        newItem.admission = false;
        $scope.items.push(newItem);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller('adminCtrl', function($scope) {
    $scope.backToStartPage = function() {
        $scope.page.current = 1;
        $scope.login.name = '';
        $scope.login.pass = '';
    };
    
    $scope.editTr = function(parametr1, parametr2) {
        for (var i=0; i<parametr1.length; i++) {
            parametr1[i].edit = false;
        }
        parametr2.edit = true;
    }
    
});






function guestMessage() {
    
}