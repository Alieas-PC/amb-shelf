var express = require('express');
var path = require('path');
var fs = require('fs');
var childp = require('child_process');

var router = express.Router();

var amiiBinDirPath = path.resolve(
  __dirname,
  '..',
  process.env.npm_package_config_amiiBinDirPath
);

var makingProgramPath = path.resolve(
  __dirname,
  '..',
  process.env.npm_package_config_makingProgramPath
);

var dataTemp = [];

const MAX_DATA_LEN = 540;

function filterHiddenStuff(filesArr) {
  return filesArr.filter(function({ name }) {
    return name.indexOf('.') !== 0;
  });
}

router.get('/', function(req, res, next) {
  const filesArr = fs.readdirSync(amiiBinDirPath);

  const list = filesArr.map(e => ({
    name: e,
    imgSrc: '/images/bin-img/image1.png'
  }));
  res.render('index', { title: 'Express', list: filterHiddenStuff(list) });
});

/** spwan a child process to execute amiibo making program */
router.get('/makeAmiiboCard', function(req, res, next) {
  res.set('Content-Type', 'text/html');
  dataTemp = [];
  
  const exec = childp.execFile(makingProgramPath);
  exec.stdout.on('data', data => {
    res.write(`<li style="color:#444">${data}</li>`);

    const group = data.match(
      /Writing to (\d+): (\d+) (\d+) (\d+) (\d+) \.\.\.Done/
    );

    if (group) {
      dataTemp.push(group[2], group[3], group[4], group[5]);
    }
  });
  exec.stderr.on('data', data => {
    res.write(`<li style="color:#F00">${data}</li>`);
  });
  exec.on('close', code => {
    console.log('All data', dataTemp, 'with code', code);

    if (code === null) {
      res.write(
        `<li style="color:#F00">The working process has just been terminated.</li>`
      );
    }

    res.end();
  });
});

router.get('/kill-other-makerp', function(req, res, next) {
  childp.exec(
    `ps -ef|grep "/bin/bash ${makingProgramPath}"|awk 'END { print NR }'`,
    (err, stdout, stderr) => {
      if (err) {
        next(err);
        return;
      }

      console.log('stdout', stdout);

      console.log('stderr', stderr);

      if (stdout && stdout.trim() > '2') {
        console.log('more than one processes are running, kill anothor one!');

        childp.exec(
          `ps -ef|grep '/bin/bash ${makingProgramPath}'|awk ' NR == 1 { print $2 }'|xargs kill -9`
        );
      }
      res.end('Done');
    }
  );
});

/** get progres of the making execution  */
router.get('/progress', function(req, res, next) {
  res.json({
    progress: ((dataTemp.length / MAX_DATA_LEN) * 100).toFixed(1)
  });
});

module.exports = router;
