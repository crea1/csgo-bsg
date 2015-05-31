var app = angular.module('csgoBindApp', []);
    app.controller('bindController', ['$scope', '$http',
        function($scope, $http) {

            $scope.selectedBindnames = [];
            $scope.buyScript = "";
            $scope.selectedKey = "";
            $scope.scriptCollection = {};

            $scope.primaryDropDownValues = [];
            $scope.secondaryDropDownValues = [];

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

            $scope.selectAddToScript = function(newBind, oldBind) {
                console.log("selectAddToScript:" + newBind + " " + oldBind);
                //$scope.addToScript(oldBind, false);
                //$scope.addToScript(newBind, true);
                $scope.scriptCollection[$scope.selectedKey] = {
                    primary:$scope.primarySelected,
                    secondary:$scope.secondarySelected,
                    bindkey:$scope.selectedKey
                };
                $scope.generateScript();
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
                $scope.buyScript ="";
                angular.forEach($scope.scriptCollection, function(keyBindObject) {

                    $scope.buyScript += "bind \"" + keyBindObject.bindkey + "\" \"";
                    if (keyBindObject.primary) {
                        $scope.buyScript += "buy " + keyBindObject.primary + ";";
                    }
                    if (keyBindObject.secondary) {
                        $scope.buyScript += "buy " + keyBindObject.secondary + ";";
                    }
                    $scope.buyScript += "\"\n" + String.fromCharCode(13);
                });
                console.log($scope.scriptCollection);
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
                    if ($scope.scriptCollection[$scope.selectedKey]) {
                        console.log("collection: " + $scope.scriptCollection+ " selected: " + $scope.scriptCollection[$scope.selectedKey]);
                        $scope.primarySelected = $scope.scriptCollection[$scope.selectedKey].primary;
                        $scope.secondarySelected = $scope.scriptCollection[$scope.selectedKey].secondary;
                    } else {
                        $scope.primarySelected = undefined;
                        $scope.secondarySelected = undefined;
                    }
                }
            }
        }
    ]);

