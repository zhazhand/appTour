app.controller("tableCtrl", function($scope) {
    // обработка события messageClient на текущем scope
    $scope.$on("messageClient", function(event, args) {
        $scope.tourist = args.message;
    });
});