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
                    console.log("inside hasGrenades");
                    if (!grenades) {
                        return false;
                    } else {
                        var hasGrenade = false;
                        angular.forEach($scope.scriptCollection[bindname].grenades, function (grenade) {
                            if (grenade) {
                                console.log("GRENADE TRUE")
                                hasGrenade = true;
                            }
                        });
                    }
                    return hasGrenade;
                }

                function hasEquipment(equipment) {
                    console.log("inside hasEquipment");
                    if (!equipment) {
                        return false;
                    } else {
                        var hasEquipment = false;
                        angular.forEach($scope.scriptCollection[bindname].equipment, function (eq) {
                            if (eq) {
                                console.log("EQUIPMENT TRUE")
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
                        console.log("hasEquioment")
                        return true;
                    } else {
                        console.log("else " + bindname)
                        return false;
                    }
                }
            };
        }
    ]);

