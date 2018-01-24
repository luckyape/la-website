/* exported initScroller */

/* global  window, document, getComputedStyle, probPhone, requestAnimationFrame, cancelAnimationFrame, isiPad */

(function aboutPage() {
  'use strict';
  var meteorShower = function() {
    var screenH = window.screen.height;
    var screenW = window.screen.width;
    var small = (probPhone) ? 0.5 : 1;
    var deg = Math.PI * 2 * 25;
    var starSel = 'body > canvas.shootingstar';
    var canvasTemplate = document.querySelector(starSel);
    var cL = 6;
    var baseDelay = cL * 1250;
    var canvasW;
    var canvasH;
    var body = document.querySelector('.body');
    var s;
    /*
     * Initiates meteor shower effect
     */
    var init = function() {
      canvasW = canvasTemplate.width;
      canvasH = canvasTemplate.height;
      s = canvasW / canvasH;
      for (var i = 0; i < cL; ++i) {
        var canvas = canvasTemplate.cloneNode();
        body.appendChild(canvas);
        meteorControl(canvas);
      }
    };

    /*
     * Determines starting position and apply style
     * @param {array} canvas - array of canvas dom objects
     */
    function transformCanvas(canvas) {
      var scale = ((Math.random() / 2) + 0.5) * small;
      var rotate = Math.random() * deg;
      var x = ((screenW * Math.random()) / screenW) * 100;
      var y = ((screenH * Math.random()) / screenH) * 80;
      if (y > 60) {
        scale *= 0.6;
      } else if (y < 6) {
        y = 6;
      }
      canvas.style.transform = ' translate(' + x + 'vw, ' + y + 'vh) scale(' + scale + ') rotate(' + rotate + 'deg)';
      canvas.style.display = 'block';
    }

    var clear = function(ctx) {
      ctx.clearRect(0, 0, canvasW, canvasH);
    };

    var tail = function(ctx, i, s, animationId) {
      clear(ctx);
      i += 1 / 10;
      ctx.beginPath();
      ctx.moveTo(i * s, i);
      ctx.lineTo(canvasW, canvasH);
      ctx.stroke();
      if (i < canvasH) {
        animationId = requestAnimationFrame(function() {
          tail(ctx, i, s, animationId);
        });
      } else {
        cancelAnimationFrame(animationId);
        clear(ctx);
        meteorControl(ctx.canvas);
      }
    };
    
    var head = function(ctx, i, s, animationId) {
      clear(ctx);
      i += 1 / 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(i * s, i);
      ctx.stroke();

      if (i < canvasH) {
        animationId = requestAnimationFrame(function() {
          head(ctx, i, s, animationId);
        });
      } else {
        cancelAnimationFrame(animationId);
        ctx.lineWidth = 75 / 100;
        ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
        i = 0;
        setTimeout(function() {
          tail(ctx, i, s);
        }, 100);
      }
    };
    /**
     * Applies canvas draw attributes fires off animatino of meteor head
     * @param {array} canvas - array of canvas dom objects
     */
    function draw(canvas) {
      var ctx = canvas.getContext('2d');
      var i = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      head(ctx, i, s);
    }
    /*
     * Positions meteor and kicks off draw()
     * @param {array} canvas - array of canvas dom objects
     */
    var meteor = function(canvas) {
      transformCanvas(canvas);
      if (canvas.getContext) {
        draw(canvas);
      }
    };
    /*
     * Sets up timeout before meteor fires
     * @param {obj} canvas dom object
     */
    function meteorControl(canvas) {
      var delay = Math.random() * baseDelay;
      canvas.style.display = 'none';
      setTimeout(function() {
        meteor(canvas);
      }, delay);
    }
    init();
  };

  var fadeInScroll = function(isDesktop) {
    /* body tag */
    var overlay = document.getElementById('la-about-overlay');
    /* Container for text */
    var body = document.getElementById('body');
    var starfield = getComputedStyle(body).getPropertyValue('background-image');
    starfield = starfield.substr(4).slice(0, -1).replace(/"/g, '');
    var bgImage = document.createElement('img');
    bgImage.setAttribute('src', starfield);
    var navbar = document.getElementById('la-navbar-flex');
    var panels = document.getElementById('panels');
    /* Clouds are dom objects to be faded in on scroll */
    var clouds = panels.querySelectorAll('.cloud');
    /* Height of viewport */
    var clientH = document.documentElement.clientHeight;
    /* 1 vh value */
    var vH = 100 / clientH;
    /* header text dom object */
    var pHead = document.getElementById('panel-header');
    /* header text dom object position */
    var headPos = null;
    /* 'atached', 'paused' & 'flowed' define 3 states of header text */
    var state = 'attached';
    /* Detach Point - when top cloud reach x vh dettach header */
    var detachVh = 81;
    /* Reattach Point – when header hits x vh reattach to panel */
    var reattachVh = 15;
    /* Capture original postion of header text defined by css */
    var origHeadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('top')) * vH;
    var panelPadTopVh = parseFloat(getComputedStyle(panels).getPropertyValue('padding-top')) * vH;
    var scrollKilled = false;
    /* Capture padding-top for panel to calculate distance scrolled between attached => detached
      panelPadTopVh - detachVh = scrollBeforeDetach
      origHeadTop - scrollBeforeDetach = reattachPoint
    */
    var scrlBeforeDettach = panelPadTopVh - detachVh;
    var reattachPointVh = origHeadTop - scrlBeforeDettach;

    var pHeadPadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('padding-top'));
    var pHeadPadBottom = parseFloat(getComputedStyle(pHead).getPropertyValue('padding-top'));

    var cloudsState = function() {
      for (var i = clouds.length - 1; i >= 0; i--) {
        var cloud = clouds[i];
        var cloudPos = cloud.getBoundingClientRect();
        if (cloudPos.bottom * vH > detachVh) {
          cloud.classList.add('blurred');
        } else if (cloudPos.top * vH < detachVh) {
          cloud.classList.remove('blurred');
        }
      }
    };
    /*
     * Triggered by scroll
     */
    var storyFade = function() {
      /* determine scroll position */
      // var scrollY = window.scrollY * vH;

      /* determine header dom position */
      headPos = pHead.getBoundingClientRect();
      var headTopPos = headPos.top * vH;
      var headerH = headPos.height * vH;
      var cloudsTopPos = clouds[0].getBoundingClientRect().top * vH;
      if (state === 'dettached') {
        /*
         * if the top of the clouds reaches bottom of the
         * dettached header reattach
         */
        if (cloudsTopPos < headerH + headTopPos) {
          reattachHeader();
          console.info('dettached -> reattached');
        } else if (cloudsTopPos - (100 * vH) > detachVh) {
          /*
           * if the top of the clouds drops below
           * the initial attack point return to original state
           * 100px Kludge prevents jankyness in edge cases
           */
          attachHeader();
          console.info('dettached -> attached');
        }
      } else if (state === 'attached') {
        /*
         * if the top of the clouds reaches
         * the detach point set datchVh
         * - 1 smooths out the scroll
         */
        if (scrlBeforeDettach < origHeadTop - headTopPos) {
          dettachHeader();
          console.info('attached -> dettached');
        }
      } else if (state === 'reattached') {
        /*
         * if the top of the attachd header drops
         * below the reattachVh dettach
         */
        if (headTopPos > reattachVh) {
          dettachHeader();
          console.info('reattached -> dettached');
        }
      }

      function dettachHeader() {
        var style = 'position:fixed; top:' + reattachPointVh + 'vh';
        pHead.setAttribute('style', style);
        pHead.classList.remove('bounce');
        state = 'dettached';
      }

      function reattachHeader() {
        var style = 'position: absolute; top:' + (panelPadTopVh - headerH) + 'vh';
        pHead.setAttribute('style', style);
        state = 'reattached';
      }

      function attachHeader() {
        pHead.setAttribute('style', '');
        state = 'attached';
      }
    };
    var desktopAnimationFrames = function() {
      cloudsState();
      storyFade();
      requestAnimationFrame(desktopAnimationFrames);
    };

    function waitForBGToLoad(imageElement) {
      return new Promise(function(resolve) {
        imageElement.onload = resolve;
      });
    }

    function scrollResizeDesktop() {
      window.scrollTo(0, 0);
      clientH = document.documentElement.clientHeight;
      vH = 100 / clientH;
      origHeadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('top')) * vH;
      panelPadTopVh = parseFloat(getComputedStyle(panels).getPropertyValue('padding-top')) * vH;
      scrlBeforeDettach = panelPadTopVh - detachVh;
      reattachPointVh = origHeadTop - scrlBeforeDettach;
    }
    var scrollResizeMobile = function() {
      setVh();
    }

    var setVh = function() {
      clientH = document.documentElement.clientHeight;
      vH = 100 / clientH;
    }

    //    var pos = document.getElementById('pos');

    var stopMotion = function() {
      var navRectTop = document.getElementById('la-content-wrapper').getBoundingClientRect().top;
      if (!scrollKilled && navRectTop > 56) {
        scrollKilled = true;
        setTimeout(killSroll, 300);
        console.info('top');
      }
    }

    var killSroll = function() {

      scrollKilled = true;

      body.classList.remove('mobile-scroll');
      window.removeEventListener('touchstart', stopMotion);
      window.removeEventListener('scroll', stopMotion);
      window.removeEventListener('touchmove', stopMotion);
      setTimeout(function() {
        pHead.classList.add('bounce');
        window.addEventListener('touchstart', startMotion, false);
        window.addEventListener('scroll', preventMotion, false);
        window.addEventListener('touchmove', preventMotion, false);
      }, 500);

    }
    /*
     * Initiats normal scroll
     */
    function startMotion(event) {
      console.info('startMotion');
      if (scrollKilled) {
        scrollKilled = false;
        window.scrollTo(0, 5);
        //body.classList.add('mobile-scroll');
        window.removeEventListener('touchstart', startMotion);
        window.removeEventListener('scroll', preventMotion);
        window.removeEventListener('touchmove', preventMotion);
        console.info('start motion');
        requestAnimationFrame(function(timestamp){
            var startTime = timestamp || new Date().getTime();
            animateHeaderPadding(startTime, 300, 1); // 400px over 1 second
        });
        pHead.classList.remove('bounce');
        /* activateScroll */

        setTimeout(function() {
          window.addEventListener('touchstart', stopMotion);
          window.addEventListener('scroll', stopMotion);
          window.addEventListener('touchmove', stopMotion);
        }, 500);

        event.preventDefault();
        event.stopPropagation();
      }
    }

    // direction is -1 or 1
    function animateHeaderPadding(tasks, startTime,  duration, direction, timestamp, topDist, bottDist) {
      //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:

      var timestamp = timestamp || startTime;
      console.info(startTime,  new Date().getTime());
      var topDist = topDist || pHeadPadTop;
      var bottDist = bottDist || pHeadPadBottom;
      var runtime = timestamp - startTime;
      var progress = runtime / duration;
      progress = Math.min(progress, 1);

      pHead.style.paddingTop = topDist - (topDist * progress * direction).toFixed(2) + 'px';
      pHead.style.paddingBottom = bottDist - (bottDist * progress * direction).toFixed(2) + 'px';
      if (runtime < duration) { // if duration not met yet
        requestAnimationFrame(function(timestamp) { // call requestAnimationFrame again with parameters
          animateHeaderPadding(startTime, duration, direction, timestamp,  topDist, bottDist)
        })
      }
    }
    /*
     * Initiats normal scroll
     */
    function preventMotion(event) {
      console.info('preventMotion');
      window.scrollTo(0, 0);
      event.preventDefault();
      event.stopPropagation();
    }

    function init() {
      // panels.ontouchstart = function() {};
      window.onbeforeunload = function() {
        panels.style.visibility = 'hidden';
        window.scrollTo(0, 0);
      };
      waitForBGToLoad(bgImage).then(function() {
        body.classList.add('bg-loaded');
        setTimeout(function() {
          overlay.remove();
        }, 2000);
      });

      if (isDesktop) {
        window.addEventListener('resize', scrollResizeDesktop, true);
        setTimeout(function() {
          desktopAnimationFrames();
        }, 100);
      } else {
        window.addEventListener('resize', scrollResizeMobile, true);
        killSroll();

      }
    }
    init();
  };

  if (!oldiOS) {
    fadeInScroll((!probPhone && !isiPad));
  }
  meteorShower();
})();
