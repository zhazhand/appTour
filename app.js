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

    $scope.send = function() {
        // $broadcast - отправка события всем scope от rootScope
        $rootScope.$broadcast("messageCurrent", {
            message: $scope.current
        });
        $rootScope.$broadcast("messageCountries", {
            message: $scope.countries
        });
    }
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("managerCtrl", function($scope) {

    // обработка события messageCurrent на текущем scope
    $scope.$on("messageCurrent", function(event, args) {
        $scope.current = args.message;
    });

    $scope.$on("messageCountries", function(event, args) {
        $scope.countries = args.message;
    });

    $scope.client = {};

    function toSetRegion() {
        var country = $scope.client.country;
        for (var i = 0; i < $scope.countries.length; i++) {
            var arrayCountry = $scope.countries[i].name;
            if (country.toLowerCase() == arrayCountry.toLowerCase()) {
                $scope.client.region = $scope.countries[i].region;
                break;
            }
        }
    }

    $scope.toInp = function() {
        toSetRegion();
    };

    $scope.invis = false;
    $scope.toSelect = function() {
        $scope.client.country = '';
        if ($scope.selected == $scope.countries[$scope.countries.length - 1]) {
            $scope.invis = true;
        } else {
            $scope.invis = false;
            $scope.client.country = $scope.selected.name;
        }
        toSetRegion();
        /*после выбора страны передаем в созданный объект (client) свойство manager - менеджер прикрепленный к клиенту*/
        $scope.client.manager = $scope.current.member.name;
        var manName = $scope.client.manager;
        manName = manName.split(' ');
        $scope.current.member.firstName = manName[0];
    }

    $scope.comf = 0;
    $scope.newClient = 0;
    $scope.newStep = function() {
        $scope.newClient = $scope.newClient + 1;
    };
    $scope.oldStep = function() {
        $scope.newClient = $scope.newClient - 1;
    };

    $scope.comfort = function(par) {
        $scope.comf = par;
    };

    $scope.selectCountries = "";
    $scope.client.earlyCountries = [];
    $scope.toSelectCountries = function() {
        $scope.client.earlyCountries.length = 0;
        for (var i = 0; i < $scope.selectCountries.length; i++) {
            $scope.client.earlyCountries.push($scope.selectCountries[i].name);
        }
        return $scope.client.earlyCountries;
    };

    $scope.airports = ["Киев", "Днепр", "Запорожье", "Кривой Рог", "Харьков", "Одесса", "Львов"];
    $scope.client.airports = [];
    $scope.toSelectAirport = function() {
        $scope.client.airports.length = 0;
        for (var i = 0; i < $scope.client.selectAirport.length; i++) {
            $scope.client.airports.push($scope.client.selectAirport[i]);
        }
        return $scope.client.airports;
    };


    $scope.client.countryRegions = [];
    $scope.toSelectRegion = function() {
        $scope.client.countryRegions.length = 0;
        for (var i = 0; i < $scope.client.selectRegion.length; i++) {
            $scope.client.countryRegions.push($scope.client.selectRegion[i]);
        }
        return $scope.client.countryRegions;
    };

    $scope.client.hotelStars = [];
    $scope.client.hotelTypes = [];
    $scope.toStar = function(par, result) {
        var str = par;
        str = str.split('-');
        if (+str[1]) {
            result.push(str[0]);
        } else {
            result.splice(result.indexOf(str[0]), 1);
        }
        return result;
    };

    $scope.client.restMotiv = "u";
    $scope.client.selectDefaulte = function(main, par, def) {
        //        var main;
        if (par) {
            main = par;
        } else {
            if (def) {
                main = def;
            }
        }
        /*$scope.client.restMotivation = main;*/
    }

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller("tableCtrl", function($scope) {
    // обработка события messageClient на текущем scope
    $scope.$on("messageClient", function(event, args) {
        $scope.tourist = args.message;
    });
});