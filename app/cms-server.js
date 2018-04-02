const express = require('express');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const form = require('express-form');
const field = form.field;
const port = process.env.PORT || 3003;
const domain = process.env.DOMAIN || 'localhost';
const mime = require('mime-types');
const jsonfile = require('jsonfile');
const fs = require('fs');
var path = require('path');
const depLinker = require('dep-linker');
const jsonPath = './json/';
var crypto = require('crypto');

function ensureDomain(req, res, next) {
  if (!domain || req.hostname === domain) {
    // OK, continue
    return next();
  };
  // handle port numbers if you need non defaults
  res.redirect(`http://${domain}${req.url}`);
};

function shouldCompress(req, res) {
  return true
};

const app = express();

// at top of routing calls
app.all('*', ensureDomain);
// depLinker.setRoot('../');
// depLinker.linkDependenciesTo('./app/cms/scripts/packages');

// default to .html (you can omit the extension in the URL)
app.use(serveStatic(`${__dirname}/cms`, {
  maxAge: '1209600s',
  extensions: ['html', 'css', 'js']
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/load/:_id',
  function(req, res) {
    var _id = req.params._id;
    fs.readFile(jsonPath + _id + '.json', function(err, load) {
      if (err) {
        console.error("Could not load JSON file.", err);
        process.exit(1);
      }
      var loadJSON = JSON.parse(load);
      res.json(loadJSON);
    });
});

app.get('/list/:type',
  function(req, res) {
    var type = req.params.type;
    fs.readdir(jsonPath, function(err, files) {
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }
      var responseJSON = files.map(function(fileName, index) {
        if(path.extname(files[index]) === '.json') {
          var rawdata = fs.readFileSync(jsonPath + fileName);
          var fileJSON = JSON.parse(rawdata);
          if(fileJSON.type === type) {
            return fileJSON;
          } else {
            return false;
          }
        }
      }).filter(function(item) {
        return item;
      });
      var obj = {};
      obj[type] = responseJSON;
      res.json(obj);
    });
  });
app.post(
  '/submit-blog',
  form(
    field('title').trim().required('', 'required'),
    field('urlSlug').trim().required('', 'required').is(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug'),
    field('body').trim(),
    field('heroUrl').trim().isUrl('url'),
    field('heroRepeat').toBoolean(),
    field('publishState').toBoolean(),
    field('pubDate').isDate('date'),
    field('_id'),
    field('type').is('blog')
  ),
  function(req, res) {
    if (!req.form.isValid) {
      // Handle errors
      res.send({ errors: req.form.getErrors() });
    } else {
      var form = req.form;
      var urlSlug = form.urlSlug;
      if (req.form._id === '') {
        var hashString = urlSlug + Date.now();
        var hash = crypto.createHash('md5').update(hashString).digest('hex');
        req.form._id = hash;
      }
      var filePath = jsonPath + req.form._id +'.json';
      jsonfile.writeFile(filePath, req.form, { spaces: 2 }, (err) => {
        if (err) {
          console.error(err);
          res.json({ error: err });
        }
        res.json({ success: req.form });
      });
    }
  }
);
app.listen(port, () => {
  console.log('Server running...');
});
