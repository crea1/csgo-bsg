var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {

            $scope.selectedBindnames = [];
            $scope.selectedKey = "";
            $scope.scriptCollection = {};

            $scope.primaryDropDownValues = [];
            $scope.secondaryDropDownValues = [];
            $scope.grenadeSelection = {};

            $http.get('csgoitems.json').success(function(data) {
                $scope.primary = [];
                $scope.secondary = [];
                $scope.grenades = [];
                $scope.equipment = [];

                angular.forEach(data.secondary.pistols.items, function(pistol) {
                    $scope.secondaryDropDownValues.push({name:pistol.name, id:pistol.bindname});
                });
                angular.forEach(data.primary, function(primary){
                    angular.forEach(primary.items, function(item) {
                        $scope.primaryDropDownValues.push({name: item.name, id: item.bindname});
                    });
                });
                angular.forEach(data.grenades, function(grenades){
                    $scope.grenades.push(grenades)
                });
                angular.forEach(data.equipment, function(equipment){
                    $scope.equipment.push(equipment)
                });
            });

            $scope.generateScript = function() {
                var buyScript ="";
                angular.forEach($scope.scriptCollection, function(keyBindObject, key) {
                    if (!key) {
                        //return "";
                    }

                    buyScript += "bind \"" + key + "\" \"";
                    if (keyBindObject.primary) {
                        buyScript += "buy " + keyBindObject.primary + ";";
                    }
                    if (keyBindObject.secondary) {
                        buyScript += "buy " + keyBindObject.secondary + ";";
                    }
                    if (keyBindObject.grenades) {
                        angular.forEach($scope.grenades, function(grenade) {
                            if (keyBindObject.grenades[grenade.bindname]) {
                                buyScript += "buy " + grenade.bindname + ";";
                            }
                        });
                    }
                    if (keyBindObject.equipment) {
                        angular.forEach($scope.equipment, function(equipment) {
                            if (keyBindObject.equipment[equipment.bindname]) {
                                buyScript += "buy " + equipment.bindname + ";";
                            }
                        });
                    }
                    buyScript += "\"\n";
                });
                console.log($scope.scriptCollection);
                return buyScript;
            };

            $scope.updateDropDown = function(bindname) {
                console.log("updateDropDown(" + bindname + ")");
                if ($scope.selectedKey == bindname) {
                    $("#" + bindname).removeClass("selected");
                    $scope.selectedKey = undefined;
                } else {
                    $("#" + $scope.selectedKey).removeClass("selected");
                    $scope.selectedKey = bindname;
                    $("#" + bindname).addClass("selected");
                }
            }
        }
    ]);

