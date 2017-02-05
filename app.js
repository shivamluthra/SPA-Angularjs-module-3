(function(){
    'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
    .directive('listFoundItems', ListFoundItems);

    function ListFoundItems() {
      var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          menu: '=foundItems',
          badRemove: '=',
          onRemove: '&'
        },
        // controller: NarrowItDownController,
        // controllerAs: 'menu',
        // bindToController: true
      };
      return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var menu = this;
        //menu.itemName = "";
        menu.searchItems = function () {
          console.log("Searching for "+menu.itemName);
          MenuSearchService.getMatchedMenuItems(menu.itemName)
      .then(function (response){
        menu.found = response;
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });
    };
        menu.removeItem = function (itemIndex) {
          console.log("Removing...");
          menu.found.splice(itemIndex,1);
        };
    }

    MenuSearchService.$inject = ['$http','ApiBasePath'];
    function MenuSearchService($http,ApiBasePath){
        var service = this;

        service.getMatchedMenuItems = function(itemName){

            return $http({
                method : "GET",
                url : (ApiBasePath + "/menu_items.json")
            }).then(function success(result) {
              var founditems = [];
              for (var item in result.data.menu_items){
         if (result.data.menu_items[item].description.includes(itemName)){
           foundItems.push(result.data.menu_items[item])
           //console.log(result.data.menu_items[item]);
         }
              }
              return founditems;
            },
            function error(response) {
              console.log("ERROR");
            });
          };

        }
})();
