const express = require('express');
const serveStatic = require('serve-static');
var sslRedirect = require('heroku-ssl-redirect');
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
app.use(sslRedirect());
app.use(compression({   threshold: 0,
	filter: shouldCompress,
	level: 9  }));

// default to .html (you can omit the extension in the URL)
app.use(serveStatic(`${__dirname}/public`, {
	maxAge: '1209600s', 
	extensions: ['html','css','js'],
	setHeaders: function (res, path) {
		res.setHeader('Cache-Control', 'public, max-age=1209600s')
	}
	}));

app.listen(port, () => {
	console.log('Server running...');
});