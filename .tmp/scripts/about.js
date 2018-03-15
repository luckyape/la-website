/* exported initScroller */

/* global  window, document, getComputedStyle, probPhone, requestAnimationFrame, cancelAnimationFrame, isiPad, oldiOS */

(function meteorShower() {
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
    var setVh = function() {
      clientH = document.documentElement.clientHeight;
      vH = 100 / clientH;
    };
    var scrollResizeMobile = function() {
      setVh();
    };

    function killSroll() {
      console.info('killSroll');
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
    function stopMotion() {
      var navRectTop = document.getElementById('la-content-wrapper').getBoundingClientRect().top;
      if (!scrollKilled && navRectTop > 56) {
        console.info('stopMotion');
        scrollKilled = true;
        setTimeout(killSroll, 300);
        console.info('top');
      }
    }

    /*
     * Initiats normal scroll
     */
    function startMotion(event) {
      if (scrollKilled) {
        var touchSource = document.elementFromPoint(event.pageX, event.pageY);
        console.info(document.getElementById('body').classList);
        if (touchSource.id !== 'sideMenuLink' && !document.getElementById('body').classList.contains('side-menu-active')) {
          scrollKilled = false;
          console.info('start motion');

          window.scrollTo(0, 5);
          body.classList.add('mobile-scroll');
          window.removeEventListener('touchstart', startMotion);
          window.removeEventListener('scroll', preventMotion);
          window.removeEventListener('touchmove', preventMotion);
          requestAnimationFrame(function(timestamp) {
            var startTime = timestamp || new Date().getTime();
            animateHeaderPadding(startTime, 300, 1);
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
    }

    // direction is -1 or 1
    function animateHeaderPadding(tasks, startTime, duration, direction, timestamp, topDist, bottDist) {
      // if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:
      timestamp = timestamp || startTime;
      topDist = topDist || pHeadPadTop;
      bottDist = bottDist || pHeadPadBottom;
      var runtime = timestamp - startTime;
      var progress = runtime / duration;
      progress = Math.min(progress, 1);

      pHead.style.paddingTop = topDist - (topDist * progress * direction).toFixed(2) + 'px';
      pHead.style.paddingBottom = bottDist - (bottDist * progress * direction).toFixed(2) + 'px';
      if (runtime < duration) {
      // if duration not met yet
        requestAnimationFrame(function(timestamp) {
          // call requestAnimationFrame again with parameters
          animateHeaderPadding(startTime, duration, direction, timestamp, topDist, bottDist);
        });
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
    meteorShower();
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhYm91dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBleHBvcnRlZCBpbml0U2Nyb2xsZXIgKi9cblxuLyogZ2xvYmFsICB3aW5kb3csIGRvY3VtZW50LCBnZXRDb21wdXRlZFN0eWxlLCBwcm9iUGhvbmUsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGlzaVBhZCwgb2xkaU9TICovXG5cbihmdW5jdGlvbiBtZXRlb3JTaG93ZXIoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIG1ldGVvclNob3dlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY3JlZW5IID0gd2luZG93LnNjcmVlbi5oZWlnaHQ7XG4gICAgdmFyIHNjcmVlblcgPSB3aW5kb3cuc2NyZWVuLndpZHRoO1xuICAgIHZhciBzbWFsbCA9IChwcm9iUGhvbmUpID8gMC41IDogMTtcbiAgICB2YXIgZGVnID0gTWF0aC5QSSAqIDIgKiAyNTtcbiAgICB2YXIgc3RhclNlbCA9ICdib2R5ID4gY2FudmFzLnNob290aW5nc3Rhcic7XG4gICAgdmFyIGNhbnZhc1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdGFyU2VsKTtcbiAgICB2YXIgY0wgPSA2O1xuICAgIHZhciBiYXNlRGVsYXkgPSBjTCAqIDEyNTA7XG4gICAgdmFyIGNhbnZhc1c7XG4gICAgdmFyIGNhbnZhc0g7XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9keScpO1xuICAgIHZhciBzO1xuICAgIC8qXG4gICAgICogSW5pdGlhdGVzIG1ldGVvciBzaG93ZXIgZWZmZWN0XG4gICAgICovXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNhbnZhc1cgPSBjYW52YXNUZW1wbGF0ZS53aWR0aDtcbiAgICAgIGNhbnZhc0ggPSBjYW52YXNUZW1wbGF0ZS5oZWlnaHQ7XG4gICAgICBzID0gY2FudmFzVyAvIGNhbnZhc0g7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNMOyArK2kpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IGNhbnZhc1RlbXBsYXRlLmNsb25lTm9kZSgpO1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgIG1ldGVvckNvbnRyb2woY2FudmFzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBEZXRlcm1pbmVzIHN0YXJ0aW5nIHBvc2l0aW9uIGFuZCBhcHBseSBzdHlsZVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGNhbnZhcyAtIGFycmF5IG9mIGNhbnZhcyBkb20gb2JqZWN0c1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUNhbnZhcyhjYW52YXMpIHtcbiAgICAgIHZhciBzY2FsZSA9ICgoTWF0aC5yYW5kb20oKSAvIDIpICsgMC41KSAqIHNtYWxsO1xuICAgICAgdmFyIHJvdGF0ZSA9IE1hdGgucmFuZG9tKCkgKiBkZWc7XG4gICAgICB2YXIgeCA9ICgoc2NyZWVuVyAqIE1hdGgucmFuZG9tKCkpIC8gc2NyZWVuVykgKiAxMDA7XG4gICAgICB2YXIgeSA9ICgoc2NyZWVuSCAqIE1hdGgucmFuZG9tKCkpIC8gc2NyZWVuSCkgKiA4MDtcbiAgICAgIGlmICh5ID4gNjApIHtcbiAgICAgICAgc2NhbGUgKj0gMC42O1xuICAgICAgfSBlbHNlIGlmICh5IDwgNikge1xuICAgICAgICB5ID0gNjtcbiAgICAgIH1cbiAgICAgIGNhbnZhcy5zdHlsZS50cmFuc2Zvcm0gPSAnIHRyYW5zbGF0ZSgnICsgeCArICd2dywgJyArIHkgKyAndmgpIHNjYWxlKCcgKyBzY2FsZSArICcpIHJvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknO1xuICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cblxuICAgIHZhciBjbGVhciA9IGZ1bmN0aW9uKGN0eCkge1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXLCBjYW52YXNIKTtcbiAgICB9O1xuXG4gICAgdmFyIHRhaWwgPSBmdW5jdGlvbihjdHgsIGksIHMsIGFuaW1hdGlvbklkKSB7XG4gICAgICBjbGVhcihjdHgpO1xuICAgICAgaSArPSAxIC8gMTA7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKGkgKiBzLCBpKTtcbiAgICAgIGN0eC5saW5lVG8oY2FudmFzVywgY2FudmFzSCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBpZiAoaSA8IGNhbnZhc0gpIHtcbiAgICAgICAgYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGFpbChjdHgsIGksIHMsIGFuaW1hdGlvbklkKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb25JZCk7XG4gICAgICAgIGNsZWFyKGN0eCk7XG4gICAgICAgIG1ldGVvckNvbnRyb2woY3R4LmNhbnZhcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgaGVhZCA9IGZ1bmN0aW9uKGN0eCwgaSwgcywgYW5pbWF0aW9uSWQpIHtcbiAgICAgIGNsZWFyKGN0eCk7XG4gICAgICBpICs9IDEgLyAxMDtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgICBjdHgubGluZVRvKGkgKiBzLCBpKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgaWYgKGkgPCBjYW52YXNIKSB7XG4gICAgICAgIGFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGhlYWQoY3R4LCBpLCBzLCBhbmltYXRpb25JZCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uSWQpO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gNzUgLyAxMDA7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIC44KSc7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRhaWwoY3R4LCBpLCBzKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgY2FudmFzIGRyYXcgYXR0cmlidXRlcyBmaXJlcyBvZmYgYW5pbWF0aW5vIG9mIG1ldGVvciBoZWFkXG4gICAgICogQHBhcmFtIHthcnJheX0gY2FudmFzIC0gYXJyYXkgb2YgY2FudmFzIGRvbSBvYmplY3RzXG4gICAgICovXG4gICAgZnVuY3Rpb24gZHJhdyhjYW52YXMpIHtcbiAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJztcbiAgICAgIGN0eC5saW5lV2lkdGggPSAxLjI7XG4gICAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgICBoZWFkKGN0eCwgaSwgcyk7XG4gICAgfVxuICAgIC8qXG4gICAgICogUG9zaXRpb25zIG1ldGVvciBhbmQga2lja3Mgb2ZmIGRyYXcoKVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IGNhbnZhcyAtIGFycmF5IG9mIGNhbnZhcyBkb20gb2JqZWN0c1xuICAgICAqL1xuICAgIHZhciBtZXRlb3IgPSBmdW5jdGlvbihjYW52YXMpIHtcbiAgICAgIHRyYW5zZm9ybUNhbnZhcyhjYW52YXMpO1xuICAgICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgICAgIGRyYXcoY2FudmFzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qXG4gICAgICogU2V0cyB1cCB0aW1lb3V0IGJlZm9yZSBtZXRlb3IgZmlyZXNcbiAgICAgKiBAcGFyYW0ge29ian0gY2FudmFzIGRvbSBvYmplY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZXRlb3JDb250cm9sKGNhbnZhcykge1xuICAgICAgdmFyIGRlbGF5ID0gTWF0aC5yYW5kb20oKSAqIGJhc2VEZWxheTtcbiAgICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbWV0ZW9yKGNhbnZhcyk7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfVxuICAgIGluaXQoKTtcbiAgfTtcblxuICB2YXIgZmFkZUluU2Nyb2xsID0gZnVuY3Rpb24oaXNEZXNrdG9wKSB7XG4gICAgLyogYm9keSB0YWcgKi9cbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYS1hYm91dC1vdmVybGF5Jyk7XG4gICAgLyogQ29udGFpbmVyIGZvciB0ZXh0ICovXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9keScpO1xuICAgIHZhciBzdGFyZmllbGQgPSBnZXRDb21wdXRlZFN0eWxlKGJvZHkpLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtaW1hZ2UnKTtcbiAgICBzdGFyZmllbGQgPSBzdGFyZmllbGQuc3Vic3RyKDQpLnNsaWNlKDAsIC0xKS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgdmFyIGJnSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBiZ0ltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgc3RhcmZpZWxkKTtcbiAgICB2YXIgcGFuZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhbmVscycpO1xuICAgIC8qIENsb3VkcyBhcmUgZG9tIG9iamVjdHMgdG8gYmUgZmFkZWQgaW4gb24gc2Nyb2xsICovXG4gICAgdmFyIGNsb3VkcyA9IHBhbmVscy5xdWVyeVNlbGVjdG9yQWxsKCcuY2xvdWQnKTtcbiAgICAvKiBIZWlnaHQgb2Ygdmlld3BvcnQgKi9cbiAgICB2YXIgY2xpZW50SCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgLyogMSB2aCB2YWx1ZSAqL1xuICAgIHZhciB2SCA9IDEwMCAvIGNsaWVudEg7XG4gICAgLyogaGVhZGVyIHRleHQgZG9tIG9iamVjdCAqL1xuICAgIHZhciBwSGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYW5lbC1oZWFkZXInKTtcbiAgICAvKiBoZWFkZXIgdGV4dCBkb20gb2JqZWN0IHBvc2l0aW9uICovXG4gICAgdmFyIGhlYWRQb3MgPSBudWxsO1xuICAgIC8qICdhdGFjaGVkJywgJ3BhdXNlZCcgJiAnZmxvd2VkJyBkZWZpbmUgMyBzdGF0ZXMgb2YgaGVhZGVyIHRleHQgKi9cbiAgICB2YXIgc3RhdGUgPSAnYXR0YWNoZWQnO1xuICAgIC8qIERldGFjaCBQb2ludCAtIHdoZW4gdG9wIGNsb3VkIHJlYWNoIHggdmggZGV0dGFjaCBoZWFkZXIgKi9cbiAgICB2YXIgZGV0YWNoVmggPSA4MTtcbiAgICAvKiBSZWF0dGFjaCBQb2ludCDigJMgd2hlbiBoZWFkZXIgaGl0cyB4IHZoIHJlYXR0YWNoIHRvIHBhbmVsICovXG4gICAgdmFyIHJlYXR0YWNoVmggPSAxNTtcbiAgICAvKiBDYXB0dXJlIG9yaWdpbmFsIHBvc3Rpb24gb2YgaGVhZGVyIHRleHQgZGVmaW5lZCBieSBjc3MgKi9cbiAgICB2YXIgb3JpZ0hlYWRUb3AgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUocEhlYWQpLmdldFByb3BlcnR5VmFsdWUoJ3RvcCcpKSAqIHZIO1xuICAgIHZhciBwYW5lbFBhZFRvcFZoID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHBhbmVscykuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSkgKiB2SDtcbiAgICB2YXIgc2Nyb2xsS2lsbGVkID0gZmFsc2U7XG4gICAgLyogQ2FwdHVyZSBwYWRkaW5nLXRvcCBmb3IgcGFuZWwgdG8gY2FsY3VsYXRlIGRpc3RhbmNlIHNjcm9sbGVkIGJldHdlZW4gYXR0YWNoZWQgPT4gZGV0YWNoZWRcbiAgICAgIHBhbmVsUGFkVG9wVmggLSBkZXRhY2hWaCA9IHNjcm9sbEJlZm9yZURldGFjaFxuICAgICAgb3JpZ0hlYWRUb3AgLSBzY3JvbGxCZWZvcmVEZXRhY2ggPSByZWF0dGFjaFBvaW50XG4gICAgKi9cbiAgICB2YXIgc2NybEJlZm9yZURldHRhY2ggPSBwYW5lbFBhZFRvcFZoIC0gZGV0YWNoVmg7XG4gICAgdmFyIHJlYXR0YWNoUG9pbnRWaCA9IG9yaWdIZWFkVG9wIC0gc2NybEJlZm9yZURldHRhY2g7XG5cbiAgICB2YXIgcEhlYWRQYWRUb3AgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUocEhlYWQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctdG9wJykpO1xuICAgIHZhciBwSGVhZFBhZEJvdHRvbSA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShwSGVhZCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSk7XG5cbiAgICB2YXIgY2xvdWRzU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSBjbG91ZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGNsb3VkID0gY2xvdWRzW2ldO1xuICAgICAgICB2YXIgY2xvdWRQb3MgPSBjbG91ZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKGNsb3VkUG9zLmJvdHRvbSAqIHZIID4gZGV0YWNoVmgpIHtcbiAgICAgICAgICBjbG91ZC5jbGFzc0xpc3QuYWRkKCdibHVycmVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2xvdWRQb3MudG9wICogdkggPCBkZXRhY2hWaCkge1xuICAgICAgICAgIGNsb3VkLmNsYXNzTGlzdC5yZW1vdmUoJ2JsdXJyZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLypcbiAgICAgKiBUcmlnZ2VyZWQgYnkgc2Nyb2xsXG4gICAgICovXG4gICAgdmFyIHN0b3J5RmFkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgLyogZGV0ZXJtaW5lIHNjcm9sbCBwb3NpdGlvbiAqL1xuICAgICAgLy8gdmFyIHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWSAqIHZIO1xuXG4gICAgICAvKiBkZXRlcm1pbmUgaGVhZGVyIGRvbSBwb3NpdGlvbiAqL1xuICAgICAgaGVhZFBvcyA9IHBIZWFkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdmFyIGhlYWRUb3BQb3MgPSBoZWFkUG9zLnRvcCAqIHZIO1xuICAgICAgdmFyIGhlYWRlckggPSBoZWFkUG9zLmhlaWdodCAqIHZIO1xuICAgICAgdmFyIGNsb3Vkc1RvcFBvcyA9IGNsb3Vkc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKiB2SDtcbiAgICAgIGlmIChzdGF0ZSA9PT0gJ2RldHRhY2hlZCcpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogaWYgdGhlIHRvcCBvZiB0aGUgY2xvdWRzIHJlYWNoZXMgYm90dG9tIG9mIHRoZVxuICAgICAgICAgKiBkZXR0YWNoZWQgaGVhZGVyIHJlYXR0YWNoXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoY2xvdWRzVG9wUG9zIDwgaGVhZGVySCArIGhlYWRUb3BQb3MpIHtcbiAgICAgICAgICByZWF0dGFjaEhlYWRlcigpO1xuICAgICAgICAgIGNvbnNvbGUuaW5mbygnZGV0dGFjaGVkIC0+IHJlYXR0YWNoZWQnKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbG91ZHNUb3BQb3MgLSAoMTAwICogdkgpID4gZGV0YWNoVmgpIHtcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIGlmIHRoZSB0b3Agb2YgdGhlIGNsb3VkcyBkcm9wcyBiZWxvd1xuICAgICAgICAgICAqIHRoZSBpbml0aWFsIGF0dGFjayBwb2ludCByZXR1cm4gdG8gb3JpZ2luYWwgc3RhdGVcbiAgICAgICAgICAgKiAxMDBweCBLbHVkZ2UgcHJldmVudHMgamFua3luZXNzIGluIGVkZ2UgY2FzZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBhdHRhY2hIZWFkZXIoKTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ2RldHRhY2hlZCAtPiBhdHRhY2hlZCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnYXR0YWNoZWQnKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIGlmIHRoZSB0b3Agb2YgdGhlIGNsb3VkcyByZWFjaGVzXG4gICAgICAgICAqIHRoZSBkZXRhY2ggcG9pbnQgc2V0IGRhdGNoVmhcbiAgICAgICAgICogLSAxIHNtb290aHMgb3V0IHRoZSBzY3JvbGxcbiAgICAgICAgICovXG4gICAgICAgIGlmIChzY3JsQmVmb3JlRGV0dGFjaCA8IG9yaWdIZWFkVG9wIC0gaGVhZFRvcFBvcykge1xuICAgICAgICAgIGRldHRhY2hIZWFkZXIoKTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ2F0dGFjaGVkIC0+IGRldHRhY2hlZCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAncmVhdHRhY2hlZCcpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogaWYgdGhlIHRvcCBvZiB0aGUgYXR0YWNoZCBoZWFkZXIgZHJvcHNcbiAgICAgICAgICogYmVsb3cgdGhlIHJlYXR0YWNoVmggZGV0dGFjaFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGhlYWRUb3BQb3MgPiByZWF0dGFjaFZoKSB7XG4gICAgICAgICAgZGV0dGFjaEhlYWRlcigpO1xuICAgICAgICAgIGNvbnNvbGUuaW5mbygncmVhdHRhY2hlZCAtPiBkZXR0YWNoZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkZXR0YWNoSGVhZGVyKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246Zml4ZWQ7IHRvcDonICsgcmVhdHRhY2hQb2ludFZoICsgJ3ZoJztcbiAgICAgICAgcEhlYWQuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlKTtcbiAgICAgICAgcEhlYWQuY2xhc3NMaXN0LnJlbW92ZSgnYm91bmNlJyk7XG4gICAgICAgIHN0YXRlID0gJ2RldHRhY2hlZCc7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlYXR0YWNoSGVhZGVyKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyB0b3A6JyArIChwYW5lbFBhZFRvcFZoIC0gaGVhZGVySCkgKyAndmgnO1xuICAgICAgICBwSGVhZC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgc3R5bGUpO1xuICAgICAgICBzdGF0ZSA9ICdyZWF0dGFjaGVkJztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYXR0YWNoSGVhZGVyKCkge1xuICAgICAgICBwSGVhZC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgICBzdGF0ZSA9ICdhdHRhY2hlZCc7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVza3RvcEFuaW1hdGlvbkZyYW1lcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xvdWRzU3RhdGUoKTtcbiAgICAgIHN0b3J5RmFkZSgpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRlc2t0b3BBbmltYXRpb25GcmFtZXMpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB3YWl0Rm9yQkdUb0xvYWQoaW1hZ2VFbGVtZW50KSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBpbWFnZUVsZW1lbnQub25sb2FkID0gcmVzb2x2ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjcm9sbFJlc2l6ZURlc2t0b3AoKSB7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICBjbGllbnRIID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgIHZIID0gMTAwIC8gY2xpZW50SDtcbiAgICAgIG9yaWdIZWFkVG9wID0gcGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKHBIZWFkKS5nZXRQcm9wZXJ0eVZhbHVlKCd0b3AnKSkgKiB2SDtcbiAgICAgIHBhbmVsUGFkVG9wVmggPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUocGFuZWxzKS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXRvcCcpKSAqIHZIO1xuICAgICAgc2NybEJlZm9yZURldHRhY2ggPSBwYW5lbFBhZFRvcFZoIC0gZGV0YWNoVmg7XG4gICAgICByZWF0dGFjaFBvaW50VmggPSBvcmlnSGVhZFRvcCAtIHNjcmxCZWZvcmVEZXR0YWNoO1xuICAgIH1cbiAgICB2YXIgc2V0VmggPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsaWVudEggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgdkggPSAxMDAgLyBjbGllbnRIO1xuICAgIH07XG4gICAgdmFyIHNjcm9sbFJlc2l6ZU1vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VmgoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24ga2lsbFNyb2xsKCkge1xuICAgICAgY29uc29sZS5pbmZvKCdraWxsU3JvbGwnKTtcbiAgICAgIHNjcm9sbEtpbGxlZCA9IHRydWU7XG5cbiAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9iaWxlLXNjcm9sbCcpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzdG9wTW90aW9uKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzdG9wTW90aW9uKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBzdG9wTW90aW9uKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHBIZWFkLmNsYXNzTGlzdC5hZGQoJ2JvdW5jZScpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHN0YXJ0TW90aW9uLCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50TW90aW9uLCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBwcmV2ZW50TW90aW9uLCBmYWxzZSk7XG4gICAgICB9LCA1MDApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdG9wTW90aW9uKCkge1xuICAgICAgdmFyIG5hdlJlY3RUb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGEtY29udGVudC13cmFwcGVyJykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgICAgaWYgKCFzY3JvbGxLaWxsZWQgJiYgbmF2UmVjdFRvcCA+IDU2KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnc3RvcE1vdGlvbicpO1xuICAgICAgICBzY3JvbGxLaWxsZWQgPSB0cnVlO1xuICAgICAgICBzZXRUaW1lb3V0KGtpbGxTcm9sbCwgMzAwKTtcbiAgICAgICAgY29uc29sZS5pbmZvKCd0b3AnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEluaXRpYXRzIG5vcm1hbCBzY3JvbGxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdGFydE1vdGlvbihldmVudCkge1xuICAgICAgaWYgKHNjcm9sbEtpbGxlZCkge1xuICAgICAgICB2YXIgdG91Y2hTb3VyY2UgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9keScpLmNsYXNzTGlzdCk7XG4gICAgICAgIGlmICh0b3VjaFNvdXJjZS5pZCAhPT0gJ3NpZGVNZW51TGluaycgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2R5JykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaWRlLW1lbnUtYWN0aXZlJykpIHtcbiAgICAgICAgICBzY3JvbGxLaWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ3N0YXJ0IG1vdGlvbicpO1xuXG4gICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDUpO1xuICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9iaWxlLXNjcm9sbCcpO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc3RhcnRNb3Rpb24pO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50TW90aW9uKTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgcHJldmVudE1vdGlvbik7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0VGltZSA9IHRpbWVzdGFtcCB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGFuaW1hdGVIZWFkZXJQYWRkaW5nKHN0YXJ0VGltZSwgMzAwLCAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwSGVhZC5jbGFzc0xpc3QucmVtb3ZlKCdib3VuY2UnKTtcbiAgICAgICAgICAvKiBhY3RpdmF0ZVNjcm9sbCAqL1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHN0b3BNb3Rpb24pO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHN0b3BNb3Rpb24pO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHN0b3BNb3Rpb24pO1xuICAgICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGlyZWN0aW9uIGlzIC0xIG9yIDFcbiAgICBmdW5jdGlvbiBhbmltYXRlSGVhZGVyUGFkZGluZyh0YXNrcywgc3RhcnRUaW1lLCBkdXJhdGlvbiwgZGlyZWN0aW9uLCB0aW1lc3RhbXAsIHRvcERpc3QsIGJvdHREaXN0KSB7XG4gICAgICAvLyBpZiBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIGdlbmVyYXRlIG91ciBvd24gdGltZXN0YW1wIHVzaW5nIERhdGU6XG4gICAgICB0aW1lc3RhbXAgPSB0aW1lc3RhbXAgfHwgc3RhcnRUaW1lO1xuICAgICAgdG9wRGlzdCA9IHRvcERpc3QgfHwgcEhlYWRQYWRUb3A7XG4gICAgICBib3R0RGlzdCA9IGJvdHREaXN0IHx8IHBIZWFkUGFkQm90dG9tO1xuICAgICAgdmFyIHJ1bnRpbWUgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWU7XG4gICAgICB2YXIgcHJvZ3Jlc3MgPSBydW50aW1lIC8gZHVyYXRpb247XG4gICAgICBwcm9ncmVzcyA9IE1hdGgubWluKHByb2dyZXNzLCAxKTtcblxuICAgICAgcEhlYWQuc3R5bGUucGFkZGluZ1RvcCA9IHRvcERpc3QgLSAodG9wRGlzdCAqIHByb2dyZXNzICogZGlyZWN0aW9uKS50b0ZpeGVkKDIpICsgJ3B4JztcbiAgICAgIHBIZWFkLnN0eWxlLnBhZGRpbmdCb3R0b20gPSBib3R0RGlzdCAtIChib3R0RGlzdCAqIHByb2dyZXNzICogZGlyZWN0aW9uKS50b0ZpeGVkKDIpICsgJ3B4JztcbiAgICAgIGlmIChydW50aW1lIDwgZHVyYXRpb24pIHtcbiAgICAgIC8vIGlmIGR1cmF0aW9uIG5vdCBtZXQgeWV0XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbih0aW1lc3RhbXApIHtcbiAgICAgICAgICAvLyBjYWxsIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhZ2FpbiB3aXRoIHBhcmFtZXRlcnNcbiAgICAgICAgICBhbmltYXRlSGVhZGVyUGFkZGluZyhzdGFydFRpbWUsIGR1cmF0aW9uLCBkaXJlY3Rpb24sIHRpbWVzdGFtcCwgdG9wRGlzdCwgYm90dERpc3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLypcbiAgICAgKiBJbml0aWF0cyBub3JtYWwgc2Nyb2xsXG4gICAgICovXG4gICAgZnVuY3Rpb24gcHJldmVudE1vdGlvbihldmVudCkge1xuICAgICAgY29uc29sZS5pbmZvKCdwcmV2ZW50TW90aW9uJyk7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIC8vIHBhbmVscy5vbnRvdWNoc3RhcnQgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhbmVscy5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgIH07XG4gICAgICB3YWl0Rm9yQkdUb0xvYWQoYmdJbWFnZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdiZy1sb2FkZWQnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICB9LCAyMDAwKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaXNEZXNrdG9wKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBzY3JvbGxSZXNpemVEZXNrdG9wLCB0cnVlKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBkZXNrdG9wQW5pbWF0aW9uRnJhbWVzKCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc2Nyb2xsUmVzaXplTW9iaWxlLCB0cnVlKTtcbiAgICAgICAga2lsbFNyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGluaXQoKTtcbiAgfTtcblxuICBpZiAoIW9sZGlPUykge1xuICAgIGZhZGVJblNjcm9sbCgoIXByb2JQaG9uZSAmJiAhaXNpUGFkKSk7XG4gICAgbWV0ZW9yU2hvd2VyKCk7XG4gIH1cbn0pKCk7XG4iXSwiZmlsZSI6ImFib3V0LmpzIn0=
