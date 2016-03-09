'use strict';

app.controller('ForSaleCtrl', function($scope, forsale, $state, TaskFactory, UserFactory){
  $scope.forsale = forsale; //this is the list of tasks from the resolve block of tasksForSale

  // $scope.categoryFilter = {
  //   food: false,
  //   tutoring: false,
  //   cleaning: false
  // }

  $scope.filters = {}

  $scope.categories = ['food', 'tutoring', 'cleaning']

  $scope.detailTransfer = function(id){
    TaskFactory.getDetail(id)
    .then(function(task){

      $state.go('taskDetail', {id:task._id});

    })

  }

   $scope.sellerTransfer = function(id){
    // console.log("ID FROM SELLER TRANSFER", id)
    UserFactory.fetchById(id)
    .then(function(user){

      $state.go('publicProfile', {personId: user._id});

    })

  }


})

// app.filter('categoryFilter', function(category) {
//   return function(items) {
//     var filtered = [];
//     for(var i = 0; i < items.length; i++) {
//       if(item.category === category) filtered.push(item)
//     }
//     return filtered;
//   }
// })


app.controller('ItemCtrl', function($scope, task, $state, TaskFactory){

  $scope.task = task;



})
