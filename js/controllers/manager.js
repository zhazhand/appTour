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
        if ($scope.comf == 1) {
            $scope.client.startTalk = new Date();
        }
    };

    $scope.client.peopleAmount = (function() {
        var result = [];
        for (var i = 0; i < 15; i++) {
            result[i] = +i + 1;
        }
        result.push('>15');
        return result;
    })();

    $scope.client.childrenAmount = (function() {
        var result = [];
        for (var i = 0; i < 15; i++) {
            result[i] = +i + 1;
        }
        return result;
    })();

    $scope.client.setChildrenArray = [];
    $scope.client.setChildrenQuantity = function(par) {
        $scope.client.setChildrenArray.length = 0;
        for (var i = 0; i < par; i++) {
            $scope.client.setChildrenArray[i] = +i + 1;
        }
    };

    $scope.client.childrenListFlag = false;
    $scope.client.childrenList = [];
    $scope.client.countChildren = function(ind, age, len) {
        var sum = 0;
        var str = "";
        if (age == 1) {
            str = " год";
        } else if (age > 1 && age < 5) {
            str = " года";
        } else {
            str = " лет";
        }
        $scope.client.childrenList[ind] = +ind + 1 + " ребенок - возраст " + age + str;
        for (var i = 0; i < len; i++) {
            if ($scope.client.childrenList[i]) {
                sum++;
            }
        }
        if (sum == len) {
            $scope.client.childrenListFlag = true;
        } else {
            $scope.client.childrenListFlag = false;
        }
    };

    $scope.client.earlyCountries = [];
    $scope.toSelectCountries = function() {
        $scope.client.earlyCountries.length = 0;
        for (var i = 0; i < $scope.client.selectCountries.length; i++) {
            $scope.client.earlyCountries.push($scope.client.selectCountries[i].name);
        }
        $scope.client.countryVisitedEarly = $scope.client.earlyCountries.join(', ');
    };

    $scope.client.changeCountryVisited = function(par) {
        if (par) {
            return $scope.client.dateShow = false;
        } else {
            return $scope.client.dateShow = true;
        }
    }

    $scope.airports = ["Киев", "Днепр", "Запорожье", "Кривой Рог", "Харьков", "Одесса", "Львов"];
    $scope.client.airports = [];
    $scope.toSelectAirport = function() {
        $scope.client.airports.length = 0;
        for (var i = 0; i < $scope.client.selectAirport.length; i++) {
            $scope.client.airports.push($scope.client.selectAirport[i]);
        }
        $scope.client.favoriteAirports = $scope.client.airports.join(', ');
    };

    $scope.client.countryRegions = [];
    $scope.toSelectRegion = function() {
        $scope.client.countryRegions.length = 0;
        for (var i = 0; i < $scope.client.selectRegion.length; i++) {
            $scope.client.countryRegions.push($scope.client.selectRegion[i]);
        }
        $scope.client.favoriteRegion = $scope.client.countryRegions.join(', ');
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

    $scope.client.selectMotiv = function(par) {
        if (par) {
            $scope.client.restMotivation = par;
        }else {
            $scope.client.restMotivation = 'что-то другое';
        }
    }

    $scope.goTable = function() {
        $scope.client.endTalk = new Date();
        $scope.setTalkDuration();
        $scope.current.page = 5;
        $scope.send();
    };

    $scope.setTalkDuration = function() {
        var start = $scope.client.startTalk;
        var end = $scope.client.endTalk;
        var result = parseInt((end - start) / 1000);
        result = parseInt(result / 60) + ' минут ' + result % 60 + ' секунд';
        return $scope.client.talkDuration = result;
    };

    $scope.client.endTalkRequirements = function() {
        $scope.client.endRequirements = new Date();
        $scope.setTalkRequirements();
    };

    $scope.setTalkRequirements = function() {
        var start = $scope.client.startTalk;
        var end = $scope.client.endRequirements;
        var result = parseInt((end - start) / 1000);
        result = parseInt(result / 60) + ' минут ' + result % 60 + ' секунд';
        return $scope.client.requirements = result;
    };


    $scope.send = function() {
        $rootScope.$broadcast("messageClient", {
            message: $scope.client
        });
    };

});