var app = angular.module("app", []);
app.controller('mainCtrl', function($scope, $http, $rootScope) {

    $http.get("office.json") //получаем JSON файл (список менеджеров и туристов) с помощью сервиса $http
    .success(function(response) {
        $scope.result = response;
        $scope.items = $scope.result[0]; //массив менеджеров
        $scope.trsts = $scope.result[1]; //массив туристов
        $scope.countries = $scope.result[2]; //массив стран
    });

    $scope.current = {
        page: 1, //текущая страница представления
        member: '' //текущий менеджер
    };

    $scope.login = {
        state: true,
        name: '',
        entry: false
    };

    /*$scope.send = function() {
        // $broadcast - отправка события всем scope от rootScope
        $rootScope.$broadcast("messageCurrent", {
            message: $scope.current
        });
        $rootScope.$broadcast("messageCountries", {
            message: $scope.countries
        });
    }*/
});