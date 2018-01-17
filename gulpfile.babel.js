/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import preprocess from 'gulp-preprocess';
import dotenv from 'dotenv';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import { output as pagespeed } from 'psi';
import pkg from './package.json';
import foreach from 'gulp-foreach';
import xml2json from 'gulp-xml2json';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import fs from 'fs';
import styleInject from 'gulp-style-inject';
import data from 'gulp-data';
import template from 'gulp-template';
import download from 'gulp-download-stream';
import sitemap from 'gulp-sitemap';
import purify from 'gulp-purifycss';
import stripCode from 'gulp-strip-code';
import karma from 'karma';
import ignore from 'gulp-ignore';
var KarmaServer = karma.Server;

//var parseString = require().parseString;
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const cdnUrl = 'https://d2zvnoea48f2cl.cloudfront.net';
const localUrl = 'http://localhost:3000';
dotenv.config();

// create site map

function handleError(e)  {
	console.info(e);
}


gulp.task('test', function (done) {
		var server = new KarmaServer({
				configFile: __dirname + '/karma.conf.js',
				browsers: ['Chrome'],
				singleRun: true
		}, done);
		server.start();
});

gulp.task('sitemap', () =>
		gulp.src(['app/*.html','!app/google*.html'], {
						read: false
				})
				.pipe(sitemap({
						siteUrl: 'https://www.luckyape.com'
				}))
				.pipe(gulp.dest('dist/public'))
				.pipe($.size({ title: 'sitemap' })));



// Lint JavaScript
gulp.task('lint', () =>
	gulp.src(['app/scripts/*.js', '!node_modules/**'])
	.pipe($.eslint())
	.pipe($.eslint.format())
	.pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

// move fonts
gulp.task('copy-fonts', () =>
	gulp.src('./app/fonts/*/*')
	.pipe(gulp.dest('./dist/public/fonts'))
);

// Optimize images
gulp.task('images', () =>
	gulp.src('app/images/**/*')
	.pipe($.cache($.imagemin({
		progressive: true,
		interlaced: true
	})))
	.pipe(gulp.dest('dist/public/images'))
	.pipe($.size({ title: 'images' }))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
	gulp.src([
		'app/manifest.{json,webapp} ',
		'app/*.txt',
		'app/favicon.ico',
		'node_modules/apache-server-configs/dist/public/.htaccess',
	], {
		dot: true
	}).pipe(gulp.dest('dist/public'))
	.pipe($.size({ title: 'copy' }))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
	const AUTOPREFIXER_BROWSERS = [
		'ie >= 10',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	];

	// For best performance, don't add Sass partials to `gulp.src`
	return gulp.src([
			'./app/styles/**/*.scss',
			'./app/styles/**/*.css'
		])
		.pipe($.newer('.tmp/styles'))
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			precision: 10
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(replace('%%CDNURL%%', localUrl))
		.pipe(purify(['app/scripts/*.js', 'app/*.html', 'app/includes/*.html']))
		.pipe($.if('*.css', $.cssnano({ minifyFontValues: false, discardUnused: false })))
		.pipe(gulp.dest('.tmp/styles'))
		// Concatenate and minify styles
		.pipe($.size({ title: 'styles' }))
		.pipe($.sourcemaps.write('./'))
		.pipe(replace(localUrl, cdnUrl))
		.pipe(gulp.dest('dist/public/styles'));

});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', ['viewerScripts', 'aboutScripts'], () =>
	gulp.src([
		// Note: Since we are not using useref in the scripts build pipeline,
		//       you need to explicitly list your scripts here in the right order
		//       to be correctly concatenated
		'./app/scripts/main.js',
		'./app/scripts/init.js'    
		// Other scripts
	])
	.pipe($.newer('.tmp/scripts'))
	.pipe($.sourcemaps.init())
	.pipe($.babel())
	.pipe($.sourcemaps.write())
	.pipe(gulp.dest('.tmp/scripts'))
	.pipe($.concat('main.min.js'))
	.pipe($.uglify({ preserveComments: 'some' }))
	// Output files
	.pipe($.size({ title: 'scripts' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('dist/public/scripts'))
	.pipe(gulp.dest('.tmp/scripts'))
	.on('error', function(e) { handleError(e) })
	// move fonts
);

gulp.task('viewerScripts', () =>

	gulp.src(['./app/scripts/main.js', './app/scripts/viewer.js', './app/scripts/init.js'])
	.pipe($.concat('viewer.min.js'))
	.pipe($.uglify({ preserveComments: 'some' }))
	// Output files
	.pipe($.sourcemaps.init())
	.pipe($.babel())
	.pipe($.size({ title: 'viewerScripts' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('dist/public/scripts')) 
	.on('error', function(e) { handleError(e) })

);

gulp.task('aboutScripts', () =>

	gulp.src(['./app/scripts/main.js', './app/scripts/about.js', './app/scripts/init.js'])
	.pipe($.concat('about.min.js'))
	.pipe($.uglify({ preserveComments: 'some' }))
	// Output files
	.pipe($.sourcemaps.init())
	.pipe($.babel())
	.pipe($.size({ title: 'vaboutScripts' }))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('dist/public/scripts'))
	.on('error', function(e) { handleError(e) })
);
gulp.task('copyLibs', () =>
	gulp.src('./app/scripts/lib/**')
	.pipe(gulp.dest('./dist/public/scripts/lib'))
);

gulp.task('copySW', () =>
	gulp.src('./app/scripts/sw/**')
		.pipe(gulp.dest('./dist/public/scripts/sw'))
);


// html includes
gulp.task('htmlIncludes', function() {
	return gulp.src(['app/*.html', 'app/includes/*.html'])
		.pipe(foreach(function(stream, file) {
			return stream
				.pipe(preprocess())
				.on('error', function(e) { handleError(e) });
		}))
		.pipe(replace('%%CDNURL%%', localUrl))
		.pipe(gulp.dest('./.tmp/'))
		.pipe(replace(localUrl, cdnUrl))
		.pipe(gulp.dest('dist/public'))

		.on('error', function(e) { handleError(e) });
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
	return gulp.src(['app/*.html'])
		.pipe(foreach(function(stream, file) {
			var items = function() {
				x
			};
			// console.info(file.relative.slice(0, -5));
			return stream
				.pipe(preprocess())
				.on('error', function(e) { handleError(e) });
		}))

		.pipe($.useref({
			searchPath: '{.tmp,app}',
			noAssets: true
		}))
		.pipe($.if('*.html', $.size({ title: 'html', showFiles: true })))
		.pipe(styleInject())
		.pipe(stripCode({
			start_comment: "start-dev-css",
			end_comment: "end-dev-css"
		}))
		// Minify any HTML
		.pipe($.if('*.html', $.htmlmin({
			minifyJS: true,
			removeComments: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeOptionalTags: true
		})))
		// Output files
		.pipe(replace('%%CDNURL%%', cdnUrl))
		.pipe(replace(localUrl, cdnUrl))
		.pipe(gulp.dest('dist/public'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/public/*', '!dist/public/.git'], { dot: true }));


gulp.task('buildStoreItems', ['convertStoreXML', 'getStoreXML'], () => {
	return gulp
		.src('app/includes/store-items.tmpl', { base: "./" })
		.pipe(data(() => (JSON.parse(
			fs.readFileSync('docs/zazzle.json')
		))))
		.pipe(template())
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest('./'))
		.pipe(gulp.dest('dist/public'))
		.on('error', function(e) { handleError(e) });
});

gulp.task('buildWorkItems', () => {
	return gulp
		.src('app/includes/work-items.tmpl', { base: "./" })
		.pipe(data(() => (JSON.parse(
			fs.readFileSync('docs/work.json')
		))))
		.pipe(template())
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest('./'))
		.pipe(gulp.dest('dist/public'))
		.on('error', function(e) { handleError(e) });
});




// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles', 'buildStoreItems', 'buildWorkItems', 'htmlIncludes'], () => {
	browserSync({
		notify: false,
		// Customize the Browsersync console logging prefix
		logPrefix: 'WSK',
		// Allow scroll syncing across breakpoints
		scrollElementMapping: ['main', '.mdl-layout'],
		// Run as an https by uncommenting 'https: true'
		// Note: this uses an unsigned certificate which on first access
		//       will present a certificate warning in the browser.
		https: false,
		server: ['.tmp', 'app'],
		port: 3001
	});

	gulp.watch(['.tmp/styles/inline-header.css', 'app/**/*.html'], ['htmlIncludes', reload]);
	gulp.watch(['app/includes/store-products.tmpl'], ['buildStoreItems', reload]);
	gulp.watch(['app/includes/work-items.tmpl', 'docs/work.json'], ['buildWorkItems', reload]);
	gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['app/scripts/*.js'], ['lint', 'scripts', reload]);
	gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
	browserSync({
		notify: false,
		logPrefix: 'WSK',
		// Allow scroll syncing across breakpoints
		scrollElementMapping: ['main', '.mdl-layout'],
		// Run as an https by uncommenting 'https: true'
		// Note: this uses an unsigned certificate which on first access
		//       will present a certificate warning in the browser.
		// https: true,
		server: 'dist',
		port: 3002
	})
);
gulp.task('getStoreXML', () => {
	console.info('getStoreXML');
	return download({
			file: "zazzle.xml",
			url: 'https://feed.zazzle.com/luckyape/rss'
		})
		.pipe(gulp.dest('docs'))
		.on('error', function(e) { handleError(e) });
});

gulp.task('convertStoreXML', ['getStoreXML'], () => {
	console.info('convertStoreXML');
	gulp.src('docs/zazzle.xml')
		.pipe(xml2json())
		.on('error', function(e) { console.info(e) })
		.pipe(rename({ extname: '.json' }))
		.pipe(gulp.dest('docs'))
		.on('error', function(e) { handleError(e) });
});

// Build production files, the default tas
gulp.task('default', ['clean'], cb => {
	runSequence(
		'styles', ['lint', 'html', 'scripts', 'images', 'copy', 'copy-fonts', 'copy-sw-scripts', 'sitemap', 'generate-service-worker'],
		cb
	)
});
// Compile and automatically prefix stylesheets
gulp.task('cdn-styles', () => {
	const AUTOPREFIXER_BROWSERS = [
		'ie >= 10',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	];

	// For best performance, don't add Sass partials to `gulp.src`
	return gulp.src([
			'app/styles/**/*.scss',
			'app/styles/**/*.css'
		])

		.pipe($.newer('.tmp/styles'))

		.pipe($.sourcemaps.init())

		.pipe($.sass({
			precision: 10
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(purify(['app/scripts/*.js', 'app/*.html', 'app/includes/*.html']))
		.pipe(gulp.dest('.tmp/styles'))
		// Concatenate and minify styles
		.pipe($.if('*.css', $.cssnano({ minifyFontValues: false, discardUnused: false })))
		.pipe($.size({ title: 'styles' }))
		.pipe($.sourcemaps.write('./'))
		.pipe(gulp.dest('dist/public/styles'))
		.pipe(gulp.dest('.tmp/styles'));
});

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
	// Update the below URL to the public URL of your site
	pagespeed('www.luckyape.com', {
		strategy: 'mobile'
		// By default we use the PageSpeed Insights free (no API key) tier.
		// Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
		// key: 'YOUR_API_KEY'
	}, cb)
);

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
gulp.task('copy-sw-scripts', () => {
	return gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/scripts/sw/runtime-caching.js'])
		.pipe(gulp.dest('dist/public/scripts/sw'));
});


// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
//  ['copy-sw-scripts'],
gulp.task('generate-service-worker', () => {
	const rootDir = 'dist/public';
	const filepath = path.join(rootDir, 'service-worker.js');
	console.info('generate-service-worker');
	return swPrecache.write(filepath, {
		// Used to avoid cache conflicts when serving on localhost.
		cacheId: pkg.name || 'la-website',
		// sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
		importScripts: [
			cdnUrl + '/scripts/sw/sw-toolbox.js',
			cdnUrl + '/scripts/sw/runtime-caching.js'
		],
		staticFileGlobs: [
			// Add/remove glob patterns to match your directory setup.
			`${rootDir}/images/**/*`,
			`${rootDir}/scripts/*.js`,
			`${rootDir}/scripts/sw/*.js`,
			`${rootDir}/styles/style.css`,
			` ${rootDir}/styles/social-font.css`,
			`${rootDir}/fonts/**/*.{woff2,eot}`,
			`${rootDir}/*.{html,json}`
		],
		runtimeCaching: [{
			urlPattern: /^https:\/\/d2zvnoea48f2cl\.cloudfront\.net\//,
			handler: 'cacheFirst'
		}],
		// Translates a static file path to the relative URL that it's served from.
		// This is '/' rather than path.sep because the paths returned from
		// glob always use '/'.
		stripPrefix: rootDir + '/'
	});
});

// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
