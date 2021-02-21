var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
    console.log(`Post request received for URL: ${req.url}`);
    next();
});

router.route('/addcategory')
.post((req, res) => {
    res.send("/addcategory get called.");
});

router.route('/addinterestedskill')
.post((req, res) => {
    res.send("/addinterestedskill get called.");

});

module.exports = router;