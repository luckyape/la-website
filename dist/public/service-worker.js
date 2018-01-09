/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';




importScripts("scripts/sw/sw-toolbox.js","scripts/sw/runtime-caching.js");


/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["about.html","06a33fb287592d4bf73a20856a2feeb2"],["fonts/oswald/OFL.txt","e132480a9971602c298f51a74ddfd429"],["fonts/oswald/Oswald-Bold.ttf","e98cc209f00b204ad986d69244e93115"],["fonts/oswald/Oswald-ExtraLight.ttf","6dc7d6eb1433ef36ee3a811b0c78fe9f"],["fonts/oswald/Oswald-Light.ttf","583702db6f3ca09f0ca7b20a0d59df31"],["fonts/oswald/Oswald-Medium.ttf","9e40533df28b4651219444120d07166e"],["fonts/oswald/Oswald-Regular.ttf","69f4403ef57d4268b2f4dffdf9e7cfe1"],["fonts/oswald/Oswald-SemiBold.ttf","d5d2b3cdec291d126c3746a3cb70cd49"],["fonts/roboto/Roboto-Bold.woff","eed9aab5449cc9c8430d7d258108f602"],["fonts/roboto/Roboto-Bold.woff2","c0f1e4a4fdfb8048c72e86aadb2a247d"],["fonts/roboto/Roboto-Light.woff","ea36cd9a0e9eee97012a67b8a4570d7b"],["fonts/roboto/Roboto-Light.woff2","3c37aa69cd77e6a53a067170fa8fe2e9"],["fonts/roboto/Roboto-Medium.woff","cf4d60bc0b1d4b2314085919a00e1724"],["fonts/roboto/Roboto-Medium.woff2","1561b424aaef2f704bbd89155b3ce514"],["fonts/roboto/Roboto-Regular.woff","3cf6adf61054c328b1b0ddcd8f9ce24d"],["fonts/roboto/Roboto-Regular.woff2","5136cbe62a63604402f2fedb97f246f8"],["fonts/roboto/Roboto-Thin.woff","44b78f142603eb69f593ed4002ed7a4a"],["fonts/roboto/Roboto-Thin.woff2","1f35e6a11d27d2e10d28946d42332dc5"],["fonts/socicon/Socicon-la.eot","70f968691811e0ce155509473dbf902a"],["fonts/socicon/Socicon-la.woff2","068323cb0643a17c5df1e39e71ed7b2e"],["fonts/socicon/Socicon.svg","ae093315991b2099c822c4b9f4afd73e"],["fonts/socicon/Socicon.ttf","dda11cf48bfb60946e54ac19daa04355"],["fonts/socicon/Socicon.woff","90cf6529b42f81a2b6b3830e0d187b29"],["footer.html","b03c04b36a7d741b28c5a04c1b59c15e"],["global-js.html","d3097f3bdc56c50f54f290b877862984"],["google931f7d54e50034cd.html","6be9260f6ce285b5353082da274a2014"],["header.html","3b2d9bd63a942054710c4f652fb66eb7"],["images/ape.svg","dc1a7cfb573e0aaaa32731555eb3f7e3"],["images/bcta-screengrab.png","44ea173b1086150e898990aa72005af5"],["images/br-screengrab.png","03aafcc5625dedf7455fba697e76591e"],["images/ca-screengrab.jpg","9c74eaf1b1df4067dbf045314c6a3f4b"],["images/ca-screengrab.png","8f8353c9bd891f6635f03c8864365d4c"],["images/fl-screengrab.jpg","fb16b2c58d215a1b2d8d896a785c37d7"],["images/fl-screengrab.png","e08997f5344be58fc1ef39cb62a4f0ec"],["images/forrester-a-billion-mobile-sites-spark-no-joy.pdf","e4eae5e18ee40509aca8ef7872a7ab1c"],["images/google-developer.png","d3f44cedb20fc641d99655a23304ed9c"],["images/gp-screengrab.png","24af8468775f604401fe7ba7d2889b16"],["images/gp-screengrab2.png","81077d912650dd58291e2bcc41f5c2ad"],["images/guerilla-gorilla.svg","920fa304c0911dd8a8f3fd45d8eeacac"],["images/hamburger.svg","d2cb0dda3e8313b990e8dcf5e25d2d0f"],["images/headshot-lg.jpg","3cc2e5883d369618a714669e11d72651"],["images/headshot.jpg","28d7112a9449420313f05f29b2c59ffa"],["images/jt-screengrab.png","95840551fbd0607ef67291359977e972"],["images/kits-air.jpg","770399dc08f804a8df5649c609c30d97"],["images/leonids.jpg","c9b2187df805065acdcc6a9a66d9d9eb"],["images/mc-screengrab.jpg","4c64795568e68a6699b16858005fc2e6"],["images/pagespeed-results.png","2ce3dd6affe6aeba83b65a6f2ccc3219"],["images/skeletons.jpg","06b12e1898b39844469708be9558bc5c"],["images/starfield.jpg","27ff1792ce301ea808420f378ccc7885"],["images/touch/apple-touch-icon.png","844266b8f77217896450951dcc6596f0"],["images/touch/chrome-touch-icon-192x192.png","eb151b588f793ac876903ad2d8d2d341"],["images/touch/icon-128x128.png","52ce8dea4713a913cf6667806e8c8839"],["images/touch/ms-touch-icon-144x144-precomposed.png","87a91a6f8137b8a8dbeb038d9e19323d"],["images/trees-mask.png","4c529d80f52968354f2a147698bbad5d"],["images/tt-screengrab.png","a3f398670ea24eebfc39762561075986"],["images/vv-screengrab.png","9fca14638f85519c800268948131fb63"],["images/web-page-performance-test-results.png","58bf00a8e6100e5125647202d4332138"],["index.html","a838efea50f5f3c55a54ccee0ce42aba"],["manifest.json","30d402e280a04e6fe03b32da34c70890"],["navbar.html","afef6b6d9746110ebe6edacac957c73c"],["scripts/about.min.js","90b55b7fa3e15a8f666e2b189e533689"],["scripts/lib/desandro-matches-selector/matches-selector.js","db83f3e370f817bdb00442876aa4d3cb"],["scripts/lib/ev-emitter/ev-emitter.js","1f24a304c1667ce32e7d8e6c91150450"],["scripts/lib/fizzy-ui-utils/utils.js","9317520831e87b6c5752434649e9096e"],["scripts/lib/flickity/dist/flickity.pkgd.js","85561d549a2d8f9745ce75c99e9b9116"],["scripts/lib/flickity/dist/flickity.pkgd.min.js","ca357ff55ab2239f8693e3d22ed7d23d"],["scripts/lib/flickity/js/add-remove-cell.js","c5e26c05c2454d3e136c62fa75529efa"],["scripts/lib/flickity/js/animate.js","9a177fa1ca1746bdf8774b7bbb408bec"],["scripts/lib/flickity/js/cell.js","10ca09b5a77be395d9e46ff50ef6b5cb"],["scripts/lib/flickity/js/drag.js","cb1bc4ced1ca60d7589b043493ec72d7"],["scripts/lib/flickity/js/flickity.js","b8cd3b4d4d09324ab40066173f06ee00"],["scripts/lib/flickity/js/index.js","73e36e95d4eb59adea0db5b14d1a8d9e"],["scripts/lib/flickity/js/lazyload.js","6af8849361f046fd9c731336cb06e802"],["scripts/lib/flickity/js/page-dots.js","5b69c489bf218a3847f6f0bffd0c810f"],["scripts/lib/flickity/js/player.js","1c9b65a21ee1ff273f49ceb207e38d2f"],["scripts/lib/flickity/js/prev-next-button.js","8dcab19a2e778f5cfdf9ce57338b504a"],["scripts/lib/flickity/js/slide.js","87433291c2b29552c939d207d273fd51"],["scripts/lib/get-size/get-size.js","2001e8fa6acdf22298271a764299fd5e"],["scripts/lib/isotope-fit-columns/fit-columns.js","46c33c4017632f096b2cfc58c7489c24"],["scripts/lib/isotope-packery/packery-mode.js","09f7e52141429ff8981fe9c56669a53a"],["scripts/lib/isotope-packery/packery-mode.pkgd.js","e95103f49165f77d2a8a257298430622"],["scripts/lib/isotope-packery/packery-mode.pkgd.min.js","2e704c1f29cbb512e403ffe68315094a"],["scripts/lib/isotope/dist/isotope.pkgd.js","91dfc09634d87c4359d26d95ee346f2e"],["scripts/lib/isotope/dist/isotope.pkgd.min.js","39258d5d7a1a2c1df44cb3a40e494e9a"],["scripts/lib/isotope/gulpfile.js","bc06743659573374f4074abf2d0b5475"],["scripts/lib/isotope/js/isotope.js","41dfcaa4ac144257ae75723237c1842c"],["scripts/lib/isotope/js/item.js","c119fe3be5d4ebc24e53af2aacfc63a1"],["scripts/lib/isotope/js/layout-mode.js","3189b76bd61c4d8234b5f7c8cf7b14e1"],["scripts/lib/isotope/js/layout-modes/fit-rows.js","02f9cd49d28faf7b6788702244b57206"],["scripts/lib/isotope/js/layout-modes/masonry.js","594fa7c64fc18dfaf5457e99b2d43853"],["scripts/lib/isotope/js/layout-modes/vertical.js","505148af08d5ef3034f5066283df444a"],["scripts/lib/masonry/dist/masonry.pkgd.js","a9aa7773ba66b9c75802375641723bb0"],["scripts/lib/masonry/dist/masonry.pkgd.min.js","d94313c3ca257213d724ac82584b97e5"],["scripts/lib/masonry/masonry.js","23f0efa85ac180e04d278f98840744b8"],["scripts/lib/outlayer/item.js","1905185205bf65829685dc0a03244836"],["scripts/lib/outlayer/outlayer.js","f6302b5e5fe985354b982c20952fb0cd"],["scripts/lib/packery/dist/packery.pkgd.js","2b57d429fa048f022eb95a708d043890"],["scripts/lib/packery/dist/packery.pkgd.min.js","9f87f6e78c51bb3b335c5dd03280167f"],["scripts/lib/packery/js/item.js","77bb2cf47636841f4cad04e7d95e0592"],["scripts/lib/packery/js/packer.js","1edbd6f2ab24526f6aaf6063e4d71f79"],["scripts/lib/packery/js/packery.js","b52042418e2303d680afdc9db3f37499"],["scripts/lib/packery/js/rect.js","39d6692de5ec35d07e10545e998f9056"],["scripts/lib/tap-listener/tap-listener.js","261c1dac3f52cab2589077cdf8b723ed"],["scripts/lib/unidragger/unidragger.js","0f004c054e6459aad1173dfa582adaf8"],["scripts/lib/unipointer/unipointer.js","5cba99799818c0bb3633641f553aad4d"],["scripts/main.min.js","81f8ee54c3daa41ead12e5df4b5dd52f"],["scripts/sw/runtime-caching.js","e3e34dcb62b5d62453b9215961585488"],["scripts/sw/sw-toolbox.js","d41d8cd98f00b204e9800998ecf8427e"],["scripts/viewer.min.js","17c115eed6a33e3c8b46d8b45dd9938f"],["store-items.html","28c97ae4c98e208a5dd1772613d7446a"],["store.html","f9b462bbe65a404f7e5bc5866ab3c762"],["styles/inline-header.css","1a232866a4401ae0682e6cf2b65a9376"],["styles/social-font.css","464dcf60d3924cde7fb744f267f32c05"],["styles/style.css","19f36414281bb970026640f3f0b111df"],["tools.html","05ca9e11651510db010126d92f451c6b"],["work-items.html","1c80c27d05b9811e8f71913941459d12"],["work.html","aab6d3dccdd21a50cb6062ab55f81c71"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1-la-website2-' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var getCacheBustedUrl = function (url, param) {
    param = param || Date.now();

    var urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.search += (urlWithCacheBusting.search ? '&' : '') +
      'sw-precache=' + param;

    return urlWithCacheBusting.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var populateCurrentCacheNames = function (precacheConfig,
    cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    // Take a look at each of the cache names we expect for this version.
    Promise.all(Object.keys(CurrentCacheNamesToAbsoluteUrl).map(function(cacheName) {
      return caches.open(cacheName).then(function(cache) {
        // Get a list of all the entries in the specific named cache.
        // For caches that are already populated for a given version of a
        // resource, there should be 1 entry.
        return cache.keys().then(function(keys) {
          // If there are 0 entries, either because this is a brand new version
          // of a resource or because the install step was interrupted the
          // last time it ran, then we need to populate the cache.
          if (keys.length === 0) {
            // Use the last bit of the cache name, which contains the hash,
            // as the cache-busting parameter.
            // See https://github.com/GoogleChrome/sw-precache/issues/100
            var cacheBustParam = cacheName.split('-').pop();
            var urlWithCacheBusting = getCacheBustedUrl(
              CurrentCacheNamesToAbsoluteUrl[cacheName], cacheBustParam);

            var request = new Request(urlWithCacheBusting,
              {credentials: 'same-origin'});
            return fetch(request).then(function(response) {
              if (response.ok) {
                return cache.put(CurrentCacheNamesToAbsoluteUrl[cacheName],
                  response);
              }

              console.error('Request for %s returned a response status %d, ' +
                'so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          }
        });
      });
    })).then(function() {
      return caches.keys().then(function(allCacheNames) {
        return Promise.all(allCacheNames.filter(function(cacheName) {
          return cacheName.indexOf(CacheNamePrefix) === 0 &&
            !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    var navigateFallback = '';
    // Ideally, this would check for event.request.mode === 'navigate', but that is not widely
    // supported yet:
    // https://code.google.com/p/chromium/issues/detail?id=540967
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1209081
    if (!cacheName && navigateFallback && event.request.headers.has('accept') &&
        event.request.headers.get('accept').includes('text/html') &&
        /* eslint-disable quotes, comma-spacing */
        isPathWhitelisted([], event.request.url)) {
        /* eslint-enable quotes, comma-spacing */
      var navigateFallbackUrl = new URL(navigateFallback, self.location);
      cacheName = AbsoluteUrlToCacheName[navigateFallbackUrl.toString()];
    }

    if (cacheName) {
      event.respondWith(
        // Rely on the fact that each cache we manage should only have one entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              if (response) {
                return response;
              }
              // If for some reason the response was deleted from the cache,
              // raise and exception and fall back to the fetch() triggered in the catch().
              throw Error('The cache ' + cacheName + ' is empty.');
            });
          });
        }).catch(function(e) {
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});




