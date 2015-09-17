var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {

            $scope.selectedBindnames = [];
            $scope.selectedKey = "";
            $scope.scriptCollection = {};

            $scope.primaryDropDownValues = [];
            $scope.secondaryDropDownValues = [];
            $scope.grenadeSelection = {};

            $http.get('data/primary.json').success(function(data) {
                $scope.primary = [];
                angular.forEach(data.primary, function(primary) {
                    angular.forEach(primary.items, function(item) {
                        $scope.primaryDropDownValues.push({name: item.name, id: item.bindname, group: item.group});
                    });
                });
            });
            $http.get('data/secondary.json').success(function(data) {
                $scope.secondary = [];
                angular.forEach(data.items, function(pistol) {
                    $scope.secondaryDropDownValues.push({name:pistol.name, id:pistol.bindname});
                });
            });
            $http.get('data/grenades.json').success(function(data) {
                $scope.grenades = [];
                angular.forEach(data.grenades, function(grenades){
                    $scope.grenades.push(grenades);
                });
            });
            $http.get('data/equipment.json').success(function(data) {
                $scope.equipment = [];
                angular.forEach(data.equipment, function(equipment){
                    $scope.equipment.push(equipment);
                });
            });

            $scope.generateScript = function() {
                var buyScript ="";
                angular.forEach($scope.scriptCollection, function(keyBindObject, key) {
                    if (!$scope.hasConfiguration(key)) {
                        return "";
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
                            if (keyBindObject.grenades[grenade.id]) {
                                buyScript += "buy " + grenade.bindname + ";";
                            }
                        });
                    }
                    if (keyBindObject.equipment) {
                        angular.forEach($scope.equipment, function(equipment) {
                            if (keyBindObject.equipment[equipment.id]) {
                                buyScript += "buy " + equipment.bindname + ";";
                            }
                        });
                    }
                    buyScript += "\"\n";
                });
                return buyScript;
            };

            $scope.updateDropDown = function(bindname) {
                if ($scope.selectedKey == bindname) {
                    $("#" + bindname).removeClass("selected");
                    $scope.selectedKey = undefined;
                } else {
                    $("#" + $scope.selectedKey).removeClass("selected");
                    $scope.selectedKey = bindname;
                    $("#" + bindname).addClass("selected");
                }
            };

            /**
             * TODO Clean up this horrible method :)
             */
            $scope.hasConfiguration = function(bindname) {

                function hasGrenades(grenades) {
                    if (!grenades) {
                        return false;
                    } else {
                        var hasGrenade = false;
                        angular.forEach($scope.scriptCollection[bindname].grenades, function (grenade) {
                            if (grenade) {
                                hasGrenade = true;
                            }
                        });
                    }
                    return hasGrenade;
                }

                function hasEquipment(equipment) {
                    if (!equipment) {
                        return false;
                    } else {
                        var hasEquipment = false;
                        angular.forEach($scope.scriptCollection[bindname].equipment, function (eq) {
                            if (eq) {
                                hasEquipment = true;
                            }
                        });
                    }
                    return hasEquipment;
                }

                if (jQuery.isEmptyObject($scope.scriptCollection[bindname])) {
                    console.log("Empty object");
                    return false;
                } else {
                    var primary = $scope.scriptCollection[bindname].primary;
                    var secondary = $scope.scriptCollection[bindname].secondary;

                    if (primary && !jQuery.isEmptyObject(primary)) {
                        console.log("found primary");
                        return true;
                    } else if (secondary && !jQuery.isEmptyObject(secondary)) {
                        console.log("found secondary");
                        return true;
                    } else if (hasGrenades($scope.scriptCollection[bindname].grenades)) {
                        console.log("hasGrenades");
                        return true;
                    } else if (hasEquipment($scope.scriptCollection[bindname].equipment)) {
                        console.log("hasEquioment");
                        return true;
                    } else {
                        console.log("else " + bindname);
                        return false;
                    }
                }
            };

            $scope.isKeySelected = function() {
                return ($scope.selectedKey && $scope.selectedKey.length > 0) === true;
            };
        }
    ]);
