var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

function filterHiddenStuff(filesArr) {
  return filesArr.filter(function(e) {
    return e.indexOf(".") !== 0;
  });
}

/* GET home page. */
router.get("/", function(req, res, next) {
  var p = path.resolve(__dirname, "..", "..", "amiibo-bin");

  const filesArr = fs.readdirSync(p);

  res.render("index", { title: "Express", list: filterHiddenStuff(filesArr) });
});

module.exports = router;
