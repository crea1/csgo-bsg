var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {
            $http.get('csgoitems.json').success(function(data) {
                $scope.primary = [];
                $scope.secondary = [];
                $scope.grenades = [];
                $scope.equipment = [];
                angular.forEach(data.secondary, function(secondary) {
                    $scope.secondary.push(secondary);
                });
                angular.forEach(data.primary, function(primary){
                    $scope.primary.push(primary)
                });
                angular.forEach(data.grenades, function(grenades){
                    $scope.grenades.push(grenades)
                });
                angular.forEach(data.equipment, function(equipment){
                    $scope.equipment.push(equipment)
                });
            });


            $scope.selectedBindnames = [];
            $scope.addToScript = function(bindname, selected) {
                if (selected ) {
                    $scope.selectedBindnames.push(bindname);
                } else {
                    var index = $scope.selectedBindnames.indexOf(bindname);
                    $scope.selectedBindnames.splice(index, 1);

                }
                $scope.generateScript();
            };
            $scope.buyScript = "";
            $scope.generateScript = function() {
                $scope.buyScript = "bind \"q\" \"";
                angular.forEach($scope.selectedBindnames, function(bindname){
                    $scope.buyScript += "buy " + bindname + "; ";
                })
                $scope.buyScript += "\"";
            };
        }
    ]);