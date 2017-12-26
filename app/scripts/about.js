/* exported initScroller */
/* global  window, document, getComputedStyle, probPhone */
(function aboutPage() {
  'use strict';
  var panel = document.getElementById('panels');
  var pHead = document.getElementById('panel-header');
  var clouds = panel.querySelectorAll('.cloud');
  var pPos = null;
  var pTPad = parseFloat(getComputedStyle(pHead).getPropertyValue('top'));
  var dH = document.documentElement.clientHeight;
  var paused = false;
  var screen = window.screen;
  var navbar = document.getElementById('la-navbar-flex');
  // var scrollHeight = document.body.scrollHeight;//  window.innerHeight
  var SPPos = 60;
  // scroll pause position

  /**
   * Animates shooting stars
   * @param {array} canvas - array of canvas dom objects
   */
  function draw(canvas) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var tailW = canvas.width;
      var tailH = canvas.height;
      var i = 0;
      var s = tailW / tailH;
      var clear = function() {
        ctx.clearRect(0, 0, tailW, tailH);
      };

      var tail = function() {
        clear();
        ctx.beginPath();
        ctx.moveTo(i * s, i);
        ctx.lineTo(tailW, tailH);
        ctx.stroke();
        if (i < tailH) {
          setTimeout(tail, 0);
        }
        i += 2;
      };

      var meteor = function() {
        clear();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(i * s, i);
        ctx.stroke();
        if (i < tailH) {
          setTimeout(meteor, 0);
        } else {
          ctx.lineWidth = 0.75;
          ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
          i = 0;
          setTimeout(tail, 100);
        }
        i++;
      };
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 0.8;
      ctx.lineCap = 'round';
      meteor();
    }
  }
  /*
   * Animates shooting stars
   * @param {array} canvas - array of canvas dom objects
   * @param {number} cL - length of canvas array
   */
  var shower = function(canvas, cL) {
    var small = (probPhone) ? 0.6 : 1;
    var rN = ((Math.random() / 2) * small) + 0.5;
    var rotate = Math.random() * Math.PI * 2 * 25;
    var s = Math.random() * Math.floor(Math.random() * cL) + 1;
    var delay = Math.random() * 4000 * s;
    var x = (screen.width * Math.random()) / screen.width * 100;
    var y = (screen.height * Math.random()) / screen.height * 80;
    if (y > 60) {
      rN *= 0.6;
    }
    var transform = ' translate(' + x + 'vw, ' + y + 'vh) scale(' + rN + ') rotate(' + rotate + 'deg)';

    canvas.style.transform = transform;

    draw(canvas);
    setTimeout(function() {
      shower(canvas, cL);
      canvas.style.display = 'block';
    }, delay);
  };
  /*
   * Initiates scrolling effect
   */
  function initScroller() {
    var l = clouds.length;
    for (var i = 0; i < l; i++) {
      if (clouds[i].getBoundingClientRect().bottom * (100 / dH) > 80) {
        clouds[i].classList.add('blurred');
      }
    }
    console.info('init scroll');
    storyFade();
    window.addEventListener('scroll', storyFade);
  }
  /*
   * Initiates meteor shower effect
   */
  function initMeteorShower() {
    var canvass = document.querySelectorAll('.shootingstar');
    var cL = canvass.length;
    for (var i = 0; i < cL; ++i) {
      shower(canvass[i], cL);
    }
  }

  /*
   * Triggered by scroll
   */
  function storyFade() {
    var scrollY = window.scrollY;

    if (!paused && scrollY > SPPos) {
      pPos = pHead.getBoundingClientRect();
      pHead.style.position = 'fixed';
      pHead.style.left = pPos.left + 'px';
      pHead.style.top = pPos.top + 'px';
      paused = true;
    } else if (paused) {
      var tPos = panel.getBoundingClientRect();
      var vh = (100 / dH);
      var pPosH = pPos.height;
      console.info(vh, tPos.y, pPosH, pTPad);
      console.info((tPos.y * vh * -1) + (pPosH * vh),  (pTPad * vh) - 22);
      if ((tPos.y * vh * -1) + (pPosH * vh) > (pTPad * vh) - 22) {
        pHead.style.position = 'absolute';
        pHead.style.top = pTPad - pPosH + 'px';
        pHead.style.left = 0;
        paused = false;
        pHead.classList.remove('bounce');
      }

      if (tPos.height > tPos.bottom) {
        var unblur = panel.querySelector('p.blurred');
        var blur = panel.querySelectorAll('p:not(.blurred)');
        var uPos;
        var uVh;
        var bPos;
        var bVh;
        // this should just keep one array of objects and do it own iterating but no issue
        if (blur.length) {
          blur = blur[blur.length - 1];
          bPos = blur.getBoundingClientRect();
          bVh = bPos.bottom * vh;

          if (bVh > 80) {
            blur.classList.add('blurred');
            blur = null;
            return;
          }
        } else {
          pHead.classList.add('bounce');
        }

        if (unblur) {
          uPos = unblur.getBoundingClientRect();
          uVh = uPos.bottom * vh;
          if (uVh <= 80) {
            unblur.classList.remove('blurred');
            unblur = null;
          }
        }
      }
    }
  }

  /*
   * Facilitate scroll experince for mobile
   */
  function initMobileScroll() {
    var scrollKill = true;

    var sheet = document.createElement('style');
    sheet.innerHTML = '.la-about-page.probPhone .panel-header { padding-top: ' + (0.20 * screen.height) + 'px; padding-bottom: ' + (0.80 * screen.height) + 'px; will-change: padding-top,padding-bottom;}';
    document.body.appendChild(sheet);
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
        pHead.classList.add('mobile-scroll');
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
        pHead.classList.remove('mobile-scroll');
        navbar.style.top = '0px';
        scrollKill = true;
      }
    }
  }

  if (!probPhone) {
    initScroller();
  } else if (probPhone) {
    initMobileScroll();
  }
  initMeteorShower();
})();
