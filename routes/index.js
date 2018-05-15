var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

var p = path.resolve(__dirname, "..", "..", "amiibo-bin");

function filterHiddenStuff(filesArr) {
  return filesArr.filter(function({ name }) {
    return name.indexOf(".") !== 0;
  });
}

/* GET home page. */
router.get("/", function(req, res, next) {
  const filesArr = fs.readdirSync(p);

  const list = filesArr.map(e => ({
    name: e,
    imgSrc: "/images/bin-img/image1.png"
  }));
  res.render("index", { title: "Express", list: filterHiddenStuff(list) });
});

module.exports = router;
