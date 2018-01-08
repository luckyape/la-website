const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const port = process.env.PORT || 3000;
const domain =  process.env.DOMAIN;
const mime = require('mime-types');

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

app.use(compression({   threshold: 0,
  filter: shouldCompress,
  level: 9  }));

// default to .html (you can omit the extension in the URL)
app.use(serveStatic(`${__dirname}/public`, {
  maxAge: '605400s', 
  extensions: ['html','css','js'],
  setHeaders: function (res, path) {
    if (mime.lookup(path) === 'text/html') {
      res.setHeader('Cache-Control', 'public, max-age=605400ss')
    }
    
  }
  }));

app.listen(port, () => {
  console.log('Server running...');
});