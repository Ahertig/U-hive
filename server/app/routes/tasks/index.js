'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Task = mongoose.model('Task')
module.exports = router;

router.param('id', function(req, res, next){
  Task.findById(req.params.id)
  .then(function(t){
    req.task = t;
  })
  .then(null, next);
  next();
})

// get all tasks
router.get('/', function(req, res, next){
  Task.find({})
  .then(function(tasks){
    res.json(tasks);
  })
  .then(null, next)
})

//get one by id
router.get('/:id', function(req, res, next){
  res.json(req.task)
});

// post one task
router.post('/', function(req, res, next){
  // assumes req.body has all the required fields from a new-task form
  // req.body = {name, category, price ... etc}
  Task.create(req.body)
  .then(function(newTask){
    res.json(newTask);
  })
  .then(null, next);
});

// update a task
router.put('/:id', function(req, res, next){
  // assumes req.body is includes only the updated fields from an update/edit form
  req.task.update({$set: req.body}, {new: true})
  .then(function(updatedT){
    res.json(updatedT);
  })
})

// delete task by id
router.delete('/:id', function(req, res, next){
  req.task.remove()
  .then(function(){
    res.sendStatus(204)
  })
  .then(null, next);
})
