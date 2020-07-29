var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  req.data = "111"
  next()
});

router.get('/', function(req, res, next) {
  console.log(req.data)
  res.send('respond with a resource');
});

module.exports = router;
