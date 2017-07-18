/**
 * Created by zied on 18/07/2017.
 */
var express = require('express');
var router = express.Router();

router.get('/tasks', function(req, res, next) {
    res.render('tasks');
});

module.exports = router;
