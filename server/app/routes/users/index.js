'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var BaseUser = mongoose.model('baseUser');
var Task = mongoose.model('Task');
var College = mongoose.model('College');
var Cart = mongoose.model('Cart');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/topten', function(req, res, next) {
    User.top10Users()
    .then(function(users){
        res.json(users)
    })
    .then(null, next);
})

router.param('id', function(req, res, next){
    User.findById(req.params.id).populate('college').exec()
    .then(function(user){
        if(!user) {
            return BaseUser.findById(req.params.id)
        }else{
            return user;
        }
    })
    .then(function(user){
        req.reqUser = user;
        next();
    })
    .then(null, next);
});

router.get('/:id/averagerating', function(req, res, next) {
    req.reqUser.getAggregateScore()
    .then(function(score){
        res.json(score);
    })
    .then(null, next)
})

router.get('/guest', function(req, res, next){
    console.log('in req users/guest', req.session.guest);
    BaseUser.findById(req.session.guest)
    .then(function(user){
        res.json(user);
    });
});

router.get('/', function(req, res, next) {
    User.find({})
    .then(function(users){
        res.json(users);
    })
    .then(null, next);
})


router.get('/:id', function(req, res, next) {
    res.json(req.reqUser);
})

router.get('/:id/reviews', function(req, res, next) {
    req.reqUser.getReviews()
    .then(function(reviews){
        res.json(reviews);
    })
    .then(null, next)
})


router.get('/:id/cart', function(req, res, next){
    console.log('in user/cart', req.reqUser);
    req.reqUser.getCart()
    .then(function(cart){
        res.json(cart);
    })
    .then(null, next);
})

router.get('/:id/guestcart', function(req, res, next){
    req.reqUser.getCart()
    .then(function(cart){
        console.log(cart)
        res.json(cart);
    })
    .then(null, next);
});

router.get('/:id/purchasehistory', function(req, res, next){
    req.reqUser.getPurchaseHistory()
    .then(function(purchaseHistory){
        res.json(purchaseHistory);
    })
    .then(null, next)
})

router.get('/:id/saleshistory', function(req, res, next){
    req.reqUser.getSalesHistory()
    .then(function(salesHistory){
        res.json(salesHistory);
    })
    .then(null, next)
})



//create new baseUser, with no data
// router.post('/guest', function(req, res, next){
//     var guestUser;
//     if(!req.session.guest){
//         BaseUser.create({})
//         .then(function(user){
//             guestUser = user;
//             req.session.guest = user._id;
//             return Cart.create({guest: user._id})
//         })
//         .then(function(cart){
//             console.log('created cart,', cart);
//             req.session.cart = cart._id;
//             res.status(201).json(guestUser);
//         })
//         .then(null, next);
//     }else{
//         BaseUser.findById(req.session.guest)
//         .then(function(user){
//             res.json(user);
//         })
//         .then(null, next);
//     }
// });


router.post('/', function(req, res, next) {
    User.create(req.body)
    .then(function(user) {
        res.status(201).json(user)
    })
    .then(null, next)
})

router.put('/:id', function(req, res, next){
    req.reqUser.set(req.body);
    req.reqUser.save(function(user){
        res.json(user);
    })
    .then(null, next);
})

router.delete('/:id', function(req, res, next){
    //can we check on findByIdAndRemove and any extra validation that might be necessary?
    req.reqUser.remove()
    .then(function(){
        res.sendStatus(204)
    })
    .then(null, next)
})

// router.get('/:id/history', function(req, res, next) {
//     User.findById(req.params.id)
//     .populate(Task)

// })
