var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {

            $scope.selectedBindnames = [];
            $scope.selectedKey = "";
            $scope.scriptCollection = {};

            $scope.primaryDropDownValues = [];
            $scope.secondaryDropDownValues = [];
            $scope.grenadeSelection = {};

            $http.get('data/primary_combined.json').success(function(data) {
                $scope.primaryDropDownValues = data;
            });
            $http.get('data/secondary_combined.json').success(function(data) {
                $scope.secondaryDropDownValues = data;
            });
            $http.get('data/grenades_combined.json').success(function(data) {
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
                        for (var i = 0; i < keyBindObject.primary.bindname.length; i++) {
                            buyScript += "buy " + keyBindObject.primary.bindname[i] + ";";
                        }
                    }
                    if (keyBindObject.secondary) {
                        for (var j = 0; j < keyBindObject.secondary.bindname.length; j++) {
                            buyScript += "buy " + keyBindObject.secondary.bindname[j] + ";";
                        }
                    }
                    if (keyBindObject.grenades) {
                        angular.forEach($scope.grenades, function(grenade) {
                            if (keyBindObject.grenades[grenade.id]) {
                                for (var k = 0; k < grenade.bindname.length; k++) {
                                    buyScript += "buy " + grenade.bindname[k] + ";";
                                }
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

            $scope.onKeyClick = function(bindname) {
                if (!$scope.scriptCollection[bindname]) {
                    $scope.scriptCollection[bindname] = {};
                }
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
                    //console.log("Empty object");
                    return false;
                } else {
                    var primary = $scope.scriptCollection[bindname].primary;
                    var secondary = $scope.scriptCollection[bindname].secondary;

                    if (primary && !jQuery.isEmptyObject(primary)) {
                        //console.log("found primary");
                        return true;
                    } else if (secondary && !jQuery.isEmptyObject(secondary)) {
                        //console.log("found secondary");
                        return true;
                    } else if (hasGrenades($scope.scriptCollection[bindname].grenades)) {
                        //console.log("hasGrenades");
                        return true;
                    } else if (hasEquipment($scope.scriptCollection[bindname].equipment)) {
                        //console.log("hasEquioment");
                        return true;
                    } else {
                        //console.log("else " + bindname);
                        return false;
                    }
                }
            };

            $scope.isKeySelected = function() {
                return ($scope.selectedKey && $scope.selectedKey.length > 0) === true;
            };

            $scope.primarySelected = function (item) {
                if (item) {
                    var primary = {primary: item};
                    $.extend($scope.scriptCollection[$scope.selectedKey], primary);
                } else {
                    $scope.scriptCollection[$scope.selectedKey]['primary'] = null;
                }
            };
            $scope.secondarySelected = function (item) {
                if (item) {
                    var secondary = {secondary: item};
                    $.extend($scope.scriptCollection[$scope.selectedKey], secondary);
                } else {
                    $scope.scriptCollection[$scope.selectedKey]['secondary'] = null;
                }

            };
        }
    ]);

var client = new ZeroClipboard(document.getElementById("copy-button"));
client.on("ready", function (readyEvent) {
    client.on("aftercopy", function (event) {
        $("#copied").animate({opacity: 1}, 200).animate({opacity: 0}, 1500);
    });
});
client.on('error', function (event) {
    event.target.style.display = "none";
    ZeroClipboard.destroy();
});