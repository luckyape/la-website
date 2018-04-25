const express = require('express');
const events = require('events');
const event = new events.EventEmitter();
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const form = require('express-form');
const field = form.field;
const port = process.env.PORT || 3003;
const domain = process.env.DOMAIN || 'localhost';
const mime = require('mime-types');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');
const depLinker = require('dep-linker');
const jsonPath = './json/';
const crypto = require('crypto');
const async = require('async');

const getTagList = function(articles) {
  let tags = [];
  for (var i = 0; i < articles.length; i++) {
    tags = tags.concat(articles[i].tags);
  }
  return tags;
}
const readArticles = function(files) {
  return files.map(function(fileName, index) {
      if (path.extname(files[index]) === '.json') {
        var rawdata = fs.readFileSync(jsonPath + fileName);
        var fileJSON = JSON.parse(rawdata);
        if (fileJSON._id) {
          return fileJSON;
        } else {
          return false;
        }
      }
    }).filter(function(item) {
      return item;
    });
}

const getTagIndexes = function(articles) {
  const tagIndexes = {};
  for (var i = 0; i < articles.length; i++) {
    const article = articles[i];
    const articleTags = article.tags;
    for (var j = 0; j < articleTags.length; j++) {
      const tag = articleTags[j];
      if(!tagIndexes[tag]) {
        tagIndexes[tag] = [];
      }
      tagIndexes[tag].push(article._id);
    }
  }
  return tagIndexes;
}

const updateProps = function() {
  fs.readdir(jsonPath, function(err, files) {
    if (err) {
      console.error('Could not list the directory.', err);
      process.exit(1);
    }
    const articles = readArticles(files);
    const tags = getTagList(articles);
    const tagIndexes = getTagIndexes(articles);
    const props = { 
      props:{
        tags: tags,
        tagIndexes: tagIndexes
    }};
    const propsPath = jsonPath + 'props.json';
    jsonfile.writeFile(propsPath, props, { spaces: 2 }, (err) => {
      if (err) {
        console.error(err);
        res.json({ error: err });
      }
    });
  });
}

event.on('edit', updateProps);

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

app.get('/load/:_id?',
  function(req, res) {
    let files = [jsonPath + 'props.json'];
    let _id = req.params._id;
    if (_id) {
      files.push(jsonPath + _id + '.json');
    }

    async.map(files, fs.readFile, function(err, files) {
      if (err) {
        console.info(err);
        throw err;
      }
      let responseObj = {};
      files.forEach(function(load, i) {
        let loadJSON = JSON.parse(load);
        for (var key in loadJSON) responseObj[key] = loadJSON[key];
      });
      res.json(responseObj);
    });

  });

app.get('/list/:type',
  function(req, res) {
    var type = req.params.type;
    fs.readdir(jsonPath, function(err, files) {
      if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
      }
      var responseJSON = files.map(function(fileName, index) {
        if (path.extname(files[index]) === '.json') {
          var rawdata = fs.readFileSync(jsonPath + fileName);
          var fileJSON = JSON.parse(rawdata);
          if (fileJSON.type === type) {
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
    field('type').is('blog'),
    field('author'),
    field('tags').array()
  ),
  function(req, res) {
    if (!req.form.isValid) {
      // Handle errors
      res.send({ errors: req.form.getErrors() });
    } else {
      var form = req.form;
      var urlSlug = form.urlSlug;
      var isNew = false;
      if (req.form._id === '') {
        var hashString = urlSlug + Date.now();
        var hash = crypto.createHash('md5').update(hashString).digest('hex');
        req.form._id = hash;
        isNew = true;
      }

      var filePath = jsonPath + req.form._id + '.json';
      jsonfile.writeFile(filePath, req.form, { spaces: 2 }, (err) => {
        if (err) {
          console.error(err);
          res.json({ error: err });
        }
        event.emit('edit');
        console.info(req.form);
        res.redirect('/blog.html?edit=' + req.form._id);
        //res.json({ success: req.form, isNew: isNew });
      });
    }
  }
);
app.listen(port, () => {
  console.log('Server running...');
});
