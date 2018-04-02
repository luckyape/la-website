const express = require('express');
const serveStatic = require('serve-static');

const port = process.env.PORT || 3003;
const domain = process.env.DOMAIN;
const mime = require('mime-types');
const md = require('markdown').markdown

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



// default to .html (you can omit the extension in the URL)

app.use(serveStatic(`${__dirname}/app/public`, {
  maxAge: '1209600s',
  extensions: ['html', 'css', 'js']
}));

app.listen(port, () => {
  console.log('Server running...');
});
