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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller("managerCtrl", function($scope, $rootScope) {

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

    $scope.toInp = function() { //выбор региона при вводе страны через input
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
        if ($scope.comf == 1) {
            $scope.client.startTalk = new Date();
            var clTime = $scope.client.startTalk.getHours() - 1;
            if (clTime < 10) {
                $scope.client.time = 10;
            } else {
                $scope.client.time = clTime;
            }
        }
    };
    $scope.client.endTalkRequirements = function(par) {
        $scope.client.dateShow = par;
        var tmp = new Date();
        var seconds = (tmp - $scope.client.startTalk) / 1000;
        var minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        $scope.client.requirements = minutes + ' минут ' + seconds + ' секунд'; //время, которое клиент затратил на высказывание своих первичных ожиданий
    };

    $scope.client.changeCountryVisited = function() {
        $scope.client.countryVisitedEarly = 'Никакие (в первый раз)'; //дефолтное значение для посещенных стран
        $scope.client.dateShow = true;
    };

    $scope.client.earlyCountries = [];
    $scope.toSelectCountries = function() {
        $scope.client.earlyCountries.length = 0;
        for (var i = 0; i < $scope.client.selectCountries.length; i++) {
            $scope.client.earlyCountries.push($scope.client.selectCountries[i].name);
        }
        $scope.client.countryVisitedEarly = toSelect($scope.client.earlyCountries.join(', '), 'Никакие (в первый раз)');
        return $scope.client.earlyCountries;
    };

    $scope.client.changeAirport = function() {
        $scope.client.favoriteAirports = 'Любой'; //дефолтное значение для города вылета
    };

    $scope.client.changeRegion = function() {
        $scope.client.favoriteRegion = 'Любой'; //дефолтное значение для региона отдыха
    };

    $scope.client.peopleAmount = (function() {
        var amount = [];
        for (var i = 0; i < 15; i++) {
            amount[i] = i + 1;
        }
        amount.push('>15');
        return amount;
    }());

    $scope.client.childrenAmount = $scope.client.peopleAmount.filter(function(number) {
        return parseInt(number) < 16;
    });

    $scope.client.setChildrenQuantity = function(par) {
        var childrenArr = [];
        for (var i = 0; i < par; i++) {
            childrenArr[i] = i + 1;
        }
        return $scope.client.setChildrenArray = childrenArr; //длина массива - выбранное количество детей
    };

    $scope.client.childrenList = [];
    $scope.client.childrenListFlag = false;

    $scope.client.countChildren = function(ind, val, len) {
        $scope.client.childrenListFlag = false;
        var sum = 0;

        $scope.client.childrenList.length = len;
        $scope.client.childrenList[ind] = +ind + 1 + '-й ребёнок - возраст ' + val+'лет';
        for (var i = 0; i < len; i++) {
            if ($scope.client.childrenList[i]) {
                sum += 1;
            }
        }
        if (sum == len) {
            $scope.client.childrenListFlag = true;
        } else {
            $scope.client.childrenListFlag = false;
        }
    };

    $scope.airports = ["Киев", "Днепр", "Запорожье", "Кривой Рог", "Харьков", "Одесса", "Львов"];
    $scope.client.airports = [];
    $scope.toSelectAirport = function() {
        $scope.client.airports.length = 0;
        for (var i = 0; i < $scope.client.selectAirport.length; i++) {
            $scope.client.airports.push($scope.client.selectAirport[i]);
        }
        $scope.client.favoriteAirports = toSelect($scope.client.airports.join(', '), 'Любой');
        return $scope.client.airports;
    };


    $scope.client.countryRegions = [];
    $scope.toSelectRegion = function() {
        $scope.client.countryRegions.length = 0;
        for (var i = 0; i < $scope.client.selectRegion.length; i++) {
            $scope.client.countryRegions.push($scope.client.selectRegion[i]);
        }
        $scope.client.favoriteRegion = toSelect($scope.client.countryRegions.join(', '), 'Любой');
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

    $scope.goTable = function() {
        $scope.current.page = 5;
        $scope.client.endTalk = new Date();
        var seconds = ($scope.client.endTalk - $scope.client.startTalk) / 1000;
        var minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        $scope.client.talkDuration = minutes + ' минут ' + seconds + ' секунд'; //время разговора (всего)
        $rootScope.$broadcast("messageClient", {
            message: $scope.client
        });
    };

    $scope.client.selectMotiv = function(par, def) {
        $scope.client.restMotiv = toSelect(par, def);
    }

    function toSelect(par, def) { //функция выбора (def - дефолтное значение (может не быть))
        if (par) {
            return par;
        } else {
            if (def) {
                return def;
            }
        }
    }

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller("tableCtrl", function($scope) {
    // обработка события messageClient на текущем scope
    $scope.$on("messageClient", function(event, args) {
        $scope.tourist = args.message;
    });
});