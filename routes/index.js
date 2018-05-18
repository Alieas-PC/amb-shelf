var express = require('express');
var path = require('path');
var fs = require('fs');
var childp = require('child_process');

var {
  writeStyle,
  writeScript,
  writeTag,
  writeTagStart,
  writeTagEnd
} = require('../util/writeTag');

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

var isRunning = false;

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
router.get('/make-amiibo-card', function(req, res, next) {
  res.set('Content-Type', 'text/html');
  dataTemp = [];

  writeStyle(res, '/stylesheets/reset.css');

  writeTagStart(res, 'ul');

  isRunning = true;

  const exec = childp.execFile(makingProgramPath);

  exec.stdout.on('data', data => {
    data = data.replace(/\n/g, '<br>');
    writeTag(res, 'li', data, { style: 'color:#444' });

    const group = data.match(
      /Writing to (\d+): (\d+) (\d+) (\d+) (\d+) \.\.\.Done/
    );

    if (group) {
      dataTemp.push(group[2], group[3], group[4], group[5]);
    }
  });
  exec.stderr.on('data', data => {
    writeTag(res, 'li', data, { style: 'color:#444' });
  });
  exec.on('close', code => {
    console.log('All data', dataTemp, 'with code', code);

    if (code === null) {
      writeTag(res, 'li', 'The working process has just been terminated.', {
        style: 'color:#F00'
      });
    }
    writeTagEnd(res, 'ul');

    isRunning = false;

    res.end();
  });
});

/** kill running making process  */
router.get('/kill-other-makerp', function(req, res, next) {
  childp.exec(
    `ps -ef|grep "/bin/bash ${makingProgramPath}"|awk 'END { print NR }'`,
    (err, stdout, stderr) => {
      if (err) {
        next(err);
        return;
      }

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

/** check if there's making process running */
router.get('/check-if-any-making-process', function(req, res, next) {
  childp.exec(
    `ps -ef|grep "/bin/bash ${makingProgramPath}"|awk 'END { print NR }'`,
    (err, stdout, stderr) => {
      if (err) {
        next(err);
        return;
      }

      res.json({
        processNum: stdout.trim()
      });
    }
  );
});

/** get progres of the making execution  */
router.get('/progress', function(req, res, next) {
  res.json({
    progress: isRunning
      ? (dataTemp.length / MAX_DATA_LEN * 100).toFixed(1)
      : 100
  });
});

module.exports = router;
