/* global  requestAnimationFrame, jQuery, atob, background, window, document, probPhone */
(function($) {
  $(function() {
    var body = $('html > body');
    $('#cta-button').click(function() {
      body.addClass('modal-open');
    });

    var skeletons = document.getElementById('skeletons');

    var initialAnimations = [{
      property: 'opacity',
      element: skeletons,
      duration: 1000,
      startTime: 0,
      delta: 1,
      startVal: 0,
      target: 1
    }, {
      property: 'filter',
      element: skeletons,
      duration: 1000,
      startTime: 0,
      delta: -24,
      startVal: 24,
      target: 0,
      before: 'blur(',
      after: 'px)'
    }, {
      property: 'background-size',
      element: skeletons,
      duration: 1600,
      startTime: 0,
      delta: 50,
      startVal: 5,
      target: 55,
      before: 'auto ',
      after: '%'
    }, {
      property: 'background-position',
      element: skeletons,
      duration: 2000,
      startTime: 500,
      delta: -300,
      startVal: 100,
      target: -200,
      after: 'vw bottom',
      ease: 'easeInOutSine'
    }];
    var animaDir;

    function animateBg(animations, thisDir, b, timePast, runTime) {
      var dL = animations.length;
      if (timePast) {
        for (var i = dL - 1; i >= 0; i--) {
          var anima = animations[i];
          var startTime = anima.startTime;
          if (timePast >= startTime) {
            var t = timePast - startTime;
            var increment = t / anima.duration;
            var startVal = anima.startVal;
            var val;
            if (anima.ease) {
              b = b || 0;
              var c = anima.delta;
              var d = anima.duration;
              val = parseInt((Math[anima.ease](t, b, c, d)) + startVal, 10);
            } else {
              val = startVal + (increment * anima.delta);
            }
            var end = startVal + anima.delta;
            if (t > anima.duration) {
              val = end;
            }
            var propVal = val;
            if (anima.before) {
              propVal = anima.before + propVal;
            }
            if (anima.after) {
              propVal += anima.after;
            }
            anima.element.style[anima.property] = propVal;
            if (val === end) {
              animations.splice(i, 1);
            }
          }
        }
      }
      if (dL && (animaDir === undefined || animaDir === thisDir)) {
        requestAnimationFrame(function(timestamp) {
          if (!runTime) {
            runTime = timestamp;
          }
          var timePast = timestamp - runTime;
          animateBg(animations, thisDir, b, timePast, runTime);
        });
      }
    }
    Math.easeOutCubic = function(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    };

    Math.easeInOutSine = function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Math.easeOutSine = function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    var skeletonStyles = window.getComputedStyle(skeletons);

    function initDrag() {
      var isDragging = false;
      var isDown = false;
      var xDelta = 0;
      var startX;
      var dragStart = 0;
      var bgDragStartPos;
      var vW;

      skeletons.addEventListener('mousedown', draggingStart, false);
      skeletons.addEventListener('mousemove', draggingOn, false);
      skeletons.addEventListener('mouseup', dragginComplete, false);
      skeletons.addEventListener('mouseleave', dragginComplete, false);
      skeletons.addEventListener('touchstart', draggingStart, false);
      skeletons.addEventListener('touchmove', draggingOn, false);
      skeletons.addEventListener('touchend', dragginComplete, false);

      function getX(e) {
        var x;
        if (probPhone) {
          x = e.touches[0].clientX;
        } else {
          x = e.pageX;
        }
        return x;
      }

      function draggingStart(e) {
        isDragging = false;
        isDown = true;
        dragStart = Number(new Date());
        startX = getX(e);
        xDelta = 0;
        vW = 100 / document.documentElement.clientWidth;
        bgDragStartPos = parseInt(skeletonStyles.getPropertyValue('background-position'), 10) * vW;
      }

      function draggingOn(e) {
        var X = getX(e);
        if (isDown && !(X === startX)) {
          isDragging = true;
          xDelta = X - startX;
          skeletons.style['background-position'] = (bgDragStartPos + (xDelta * vW)) + 'vw bottom';
        }
      }

      function dragginComplete() {
        isDown = false;
        if (isDragging) {
          isDragging = false;
          var dragDuration = Number(new Date()) - dragStart;
          var dragSpeed = ((xDelta * vW) / dragDuration);

          if (1 || (!probPhone && Math.abs(dragSpeed) >= 0.5) || (probPhone && Math.abs(dragSpeed) >= 0.3)) {
            var dragAcc = (probPhone) ? 7 / 10000 : 2 / 10000;
            var time = Math.abs(dragSpeed) / dragAcc;
            var distance = (dragSpeed * time) + ((Math.sqrt(dragAcc) * Math.sqrt(time)) / 2);
            var bgPos = parseInt(skeletonStyles.getPropertyValue('background-position'), 10) * vW;

            animaDir = (xDelta > 0);
            var drag = [{
              property: 'background-position',
              element: skeletons,
              duration: time,
              startTime: 0,
              delta: distance,
              startVal: bgPos,
              target: bgPos + distance,
              after: 'vw bottom',
              ease: 'easeOutSine'
            }];
            animateBg(drag, animaDir, dragSpeed);
          }
        } else {
          isDragging = false;
        }
        startX = null;
      }
    }
    $('<img />').attr('src', background).load(function() {
      $(this).remove();
      animateBg(initialAnimations);
      initDrag();
    });
    $('.modal').modal({
      startingTop: '-40%',
      endingTop: '10%',
      ready: function() {
        // Callback for Modal open. Modal and trigger parameters available.
        function modalClose() {
          body.removeClass('modal-open');
          window.removeEventListener('keyup', sniffEscKey);
          window.removeEventListener('click', sniffModalClose);
          window.removeEventListener('touchstart', sniffModalClose);
        }
        function sniffModalClose(el) {
          var classList = Object.values(el.target.classList);
          if (classList.indexOf('modal-overlay') > -1 || classList.indexOf('modal-close') > -1) {
            modalClose();
          }
        }
        function sniffEscKey(e) {
          if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)) {
            modalClose();
          }
        }
        window.addEventListener('click', sniffModalClose, false);
        window.addEventListener('touchstart', sniffModalClose, false);
        window.addEventListener('keyup', sniffEscKey, false);
        window.loadContactInfo();
      }
    });
  });
  // end of document ready
})(jQuery);
/*
 * Displayes obuscated contact info
 */
window.loadContactInfo = function() {
  var contactMethods = document.getElementById('contact-methods');
  var contactHash = 'PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==';
  contactMethods.innerHTML = atob(contactHash);
  if (!probPhone) {
    var smsLink = document.querySelector('.sms-link');
    document.querySelector('.contact-methods').removeChild(smsLink);
  }
};
// end of jQuery name space
