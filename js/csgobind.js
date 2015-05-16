var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {

            $scope.selectedBindnames = [];
            $scope.buyScript = "";

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

            $scope.selectAddToScript = function(newBind, oldBind) {
                console.log(newBind + " " + oldBind);
                $scope.addToScript(oldBind, false);
                $scope.addToScript(newBind, true);
                console.log($scope.selectedBindnames);
            };

            $scope.addToScript = function(bindname, selected) {
                if (selected ) {
                    $scope.selectedBindnames.push(bindname);
                } else if (!selected && bindname){
                    console.log("remove " + bindname);
                    var index = $scope.selectedBindnames.indexOf(bindname);
                    $scope.selectedBindnames.splice(index, 1);
                }
                $scope.generateScript();
            };

            $scope.generateScript = function() {
                $scope.buyScript = "bind \"q\" \"";
                angular.forEach($scope.selectedBindnames, function(bindname){
                    $scope.buyScript += "buy " + bindname + "; ";
                })
                $scope.buyScript += "\"";
            };
        }
    ]);