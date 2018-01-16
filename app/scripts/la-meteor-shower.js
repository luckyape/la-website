(function aboutPage() {
  'use strict';
  var meteorShower = function() {
    var screenH = window.screen.height;
    var screenW = window.screen.width;
    var small = (probPhone) ? 0.6 : 1;
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
    function init() {
      console.info('init shower', cL);
      canvasW = canvasTemplate.width;
      canvasH = canvasTemplate.height;
      s = canvasW / canvasH;
      for (var i = 0; i < cL; ++i) {
        var canvas = canvasTemplate.cloneNode();
        body.appendChild(canvas);
        meteorControl(canvas);
      }
    }
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
     * Determines starting position and apply style
     * @param {array} canvas - array of canvas dom objects
     */
    function transformCanvas(canvas) {
      var scale = ((Math.random() / 2) * small) + 0.5;
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
    var clear = function(ctx) {
      ctx.clearRect(0, 0, canvasW, canvasH);
    };
    var head = function(ctx, i, s, animationId) {
      clear(ctx);
      i += .1;
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
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
        i = 0;
        setTimeout(function() {
          tail(ctx, i, s)
        }, 100);
      }
    };
    var tail = function(ctx, i, s, animationId) {
      clear(ctx);
      i += .1;
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
    console.info('init meteors');
    init();
  }

  var fadeInScroll = function() {
    /* Container for text */
    var panel = document.getElementById('panels');
    /* Clouds are dom objects to be faded in on scroll */
    var clouds = panel.querySelectorAll('.cloud');
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
    var panelPadTopVh = parseFloat(getComputedStyle(panel).getPropertyValue('padding-top')) * vH;

    /* Capture padding-top for panel to calculate distance scrolled between attached => detached
    	panelPadTopVh - detachVh = scrollBeforeDetach
    	origHeadTop - scrollBeforeDetach = reattachPoint
    */
    var scrlBeforeDettach = panelPadTopVh - detachVh;
    var reattachPointVh = origHeadTop - scrlBeforeDettach;

    function init() {
      window.addEventListener('resize', scrollResize, true);
      window.onbeforeunload = function() {
        panel.style.visibility = 'hidden';
        window.scrollTo(0, 0);
      };
      setTimeout(function() {
      	animationFrames();
      }, 500);
    }
		function scrollResize() {
			window.scrollTo(0, 0);
			clientH = document.documentElement.clientHeight;
			vH = 100 / clientH;
			origHeadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('top')) * vH;
  		panelPadTopVh = parseFloat(getComputedStyle(panel).getPropertyValue('padding-top')) * vH;				
  		scrlBeforeDettach = panelPadTopVh - detachVh;
	    reattachPointVh = origHeadTop - scrlBeforeDettach;
		}
    var animationFrames = function() {
      cloudsState();
      storyFade();
      requestAnimationFrame(animationFrames);
    }

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
    }

    /*
     * Triggered by scroll
     */
    var storyFade = function() {
      /* determine scroll position */
      var scrollY = window.scrollY * vH;

      /* determine header dom position */
      var headPos = pHead.getBoundingClientRect();
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
        }
        /*
         * if the top of the clouds drops below
         * the initial attack point return to original state
         * 100px Kludge prevents jankyness in edge cases
         */
        else if (cloudsTopPos - (100 * vH) > detachVh) {
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
        var style = 'position: absolute; top:' + (panelPadTopVh - headerH) + 'vh'
        pHead.setAttribute('style', style);
        state = 'reattached';
      }

      function attachHeader() {
        pHead.setAttribute('style', '');

        state = 'attached';
      }
    }
    init();
  }


  var initMobileScroll = function () {
    /* header text dom object */
    var pHead = document.getElementById('panel-header');
    /* Container for text */
    var panel = document.getElementById('panels');
    /* Container for navbar */
    var navbar = document.getElementById('la-navbar-flex');

    var body = document.querySelector('.body');
    var scrollKill = true;

  /*  var sheet = document.createElement('style');
    sheet.innerHTML = '.la-about-page.probPhone {background-position: center -400px }.la-about-page.probPhone .panel-header { padding-top: ' + (0.20 * screen.height) + 'px; padding-bottom: ' + (0.80 * screen.height) + 'px; will-change: padding-top,padding-bottom;}';
    document.body.appendChild(sheet);
*/
    panel.style.paddingTop = 0;
    panel.style.marginTop = 0;

    window.addEventListener('touchstart', startMotion, false);
    window.addEventListener('scroll', preventMotion, false);
    window.addEventListener('touchmove', preventMotion, false);
    

    
    /*
     * Initiats normal scroll
     */
    function startMotion() {
      if (scrollKill && window.scrollY === 0) {
        body.classList.add('mobile-scroll');
        pHead.classList.remove('bounce');
        setTimeout(function() {
          scrollKill = false;
          navbar.style.top = '-64px';
        }, 500);
      }
    }
    /*
     * Initiats normal scroll
     */
    function preventMotion(event) {
      if (scrollKill) {
        window.scrollTo(0, 0);
        event.preventDefault();
        event.stopPropagation();
        // navbar.setAttribute('style','');
      } else if (window.scrollY < -10 && !scrollKill) {
        pHead.classList.add('bounce');
        body.classList.remove('mobile-scroll');
        navbar.style.top = '0px';
        scrollKill = true;
      }
    }
  }

  if(!probPhone) {
    fadeInScroll();
  } else {
    initMobileScroll()
  }
  meteorShower();
})();
