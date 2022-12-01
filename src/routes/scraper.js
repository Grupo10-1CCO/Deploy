var express = require("express");
var router = express.Router();

var scraperControler = require("../controllers/scraperController");

router.get("/scraper/:link", function (req, res){
    scraperControler.chamarApi(req, res);
});

module.exports = router;