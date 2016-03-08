app.factory('UserFactory', function($http) {

  var UserFactory = {};

  UserFactory.create = function(newUser){
    return $http.post('/api/users/', newUser)
    .then(response => response.data);
  }

  UserFactory.fetchById = function(id) {
    return $http.get('/api/users/' + id)
    .then(response => response.data)
  }

  UserFactory.fetchAvgRating = function(id) {
  	return $http.get('/api/users/' + id + '/averagerating')
  	.then(response => response.data)
  }

  UserFactory.getAllReviews = function(id) {
  	return $http.get('/api/users/' + id + '/reviews')
  	.then(response => response.data)
  }

  UserFactory.getCart = function(id) {
    return $http.get('/api/users/' + id + '/cart')
    .then(response => response.data)
  }

  UserFactory.getPurchaseHistory = function(id) {
    return $http.get('/api/users/' + id + '/purchasehistory')
    .then(response => response.data)
  }

  UserFactory.getSalesHistory = function(id) {
    return $http.get('/api/users/' + id + '/saleshistory')
    .then(response => response.data)
  }

  UserFactory.removeItemFromCart = function(cartId, taskId) {
    return $http.put('/api/cart/' + cartId + '/remove/' + taskId)
    .then(response => response.data)
  }

  UserFactory.deleteTaskForSale = function(taskId) {
    return $http.delete('/api/tasks/' + taskId)
    .then(response => response.data)
  }

  UserFactory.updateTaskForSale = function(taskId, updatedTask) {
    return $http.put('/api/tasks/' + taskId, updatedTask)
    .then(response => response.data)
  }

  UserFactory.updatePersonalInfo = function(userId, updatedUser) {
    return $http.put('/api/users/' + userId, updatedUser)
    .then(response => response.data);
  }

  UserFactory.topTenBees = function() {
    return $http.get('/api/users/topten')
    .then(response => response.data);
  }

  return UserFactory;
})
