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

      skeletons.addEventListener('mousedown', draggingStart, {passive: true});
      skeletons.addEventListener('mousemove', draggingOn, {passive: true});
      skeletons.addEventListener('mouseup', dragginComplete, {passive: true});
      skeletons.addEventListener('mouseleave', dragginComplete, {passive: true});
      skeletons.addEventListener('touchstart', draggingStart, {passive: true});
      skeletons.addEventListener('touchmove', draggingOn, {passive: true});
      skeletons.addEventListener('touchend', dragginComplete, {passive: true});

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
        window.addEventListener('click', sniffModalClose, {passive: true});
        window.addEventListener('touchstart', sniffModalClose, {passive: true});
        window.addEventListener('keyup', sniffEscKey, {passive: true});
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lcGFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgalF1ZXJ5LCBhdG9iLCBiYWNrZ3JvdW5kLCB3aW5kb3csIGRvY3VtZW50LCBwcm9iUGhvbmUgKi9cbihmdW5jdGlvbigkKSB7XG4gICQoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJvZHkgPSAkKCdodG1sID4gYm9keScpO1xuICAgICQoJyNjdGEtYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICBib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB2YXIgc2tlbGV0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NrZWxldG9ucycpO1xuXG4gICAgdmFyIGluaXRpYWxBbmltYXRpb25zID0gW3tcbiAgICAgIHByb3BlcnR5OiAnb3BhY2l0eScsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiAxLFxuICAgICAgc3RhcnRWYWw6IDAsXG4gICAgICB0YXJnZXQ6IDFcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2ZpbHRlcicsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiAtMjQsXG4gICAgICBzdGFydFZhbDogMjQsXG4gICAgICB0YXJnZXQ6IDAsXG4gICAgICBiZWZvcmU6ICdibHVyKCcsXG4gICAgICBhZnRlcjogJ3B4KSdcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2JhY2tncm91bmQtc2l6ZScsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTYwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiA1MCxcbiAgICAgIHN0YXJ0VmFsOiA1LFxuICAgICAgdGFyZ2V0OiA1NSxcbiAgICAgIGJlZm9yZTogJ2F1dG8gJyxcbiAgICAgIGFmdGVyOiAnJSdcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxuICAgICAgZWxlbWVudDogc2tlbGV0b25zLFxuICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICBzdGFydFRpbWU6IDUwMCxcbiAgICAgIGRlbHRhOiAtMzAwLFxuICAgICAgc3RhcnRWYWw6IDEwMCxcbiAgICAgIHRhcmdldDogLTIwMCxcbiAgICAgIGFmdGVyOiAndncgYm90dG9tJyxcbiAgICAgIGVhc2U6ICdlYXNlSW5PdXRTaW5lJ1xuICAgIH1dO1xuICAgIHZhciBhbmltYURpcjtcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGVCZyhhbmltYXRpb25zLCB0aGlzRGlyLCBiLCB0aW1lUGFzdCwgcnVuVGltZSkge1xuICAgICAgdmFyIGRMID0gYW5pbWF0aW9ucy5sZW5ndGg7XG4gICAgICBpZiAodGltZVBhc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IGRMIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB2YXIgYW5pbWEgPSBhbmltYXRpb25zW2ldO1xuICAgICAgICAgIHZhciBzdGFydFRpbWUgPSBhbmltYS5zdGFydFRpbWU7XG4gICAgICAgICAgaWYgKHRpbWVQYXN0ID49IHN0YXJ0VGltZSkge1xuICAgICAgICAgICAgdmFyIHQgPSB0aW1lUGFzdCAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQgPSB0IC8gYW5pbWEuZHVyYXRpb247XG4gICAgICAgICAgICB2YXIgc3RhcnRWYWwgPSBhbmltYS5zdGFydFZhbDtcbiAgICAgICAgICAgIHZhciB2YWw7XG4gICAgICAgICAgICBpZiAoYW5pbWEuZWFzZSkge1xuICAgICAgICAgICAgICBiID0gYiB8fCAwO1xuICAgICAgICAgICAgICB2YXIgYyA9IGFuaW1hLmRlbHRhO1xuICAgICAgICAgICAgICB2YXIgZCA9IGFuaW1hLmR1cmF0aW9uO1xuICAgICAgICAgICAgICB2YWwgPSBwYXJzZUludCgoTWF0aFthbmltYS5lYXNlXSh0LCBiLCBjLCBkKSkgKyBzdGFydFZhbCwgMTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsID0gc3RhcnRWYWwgKyAoaW5jcmVtZW50ICogYW5pbWEuZGVsdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVuZCA9IHN0YXJ0VmFsICsgYW5pbWEuZGVsdGE7XG4gICAgICAgICAgICBpZiAodCA+IGFuaW1hLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHZhbCA9IGVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9wVmFsID0gdmFsO1xuICAgICAgICAgICAgaWYgKGFuaW1hLmJlZm9yZSkge1xuICAgICAgICAgICAgICBwcm9wVmFsID0gYW5pbWEuYmVmb3JlICsgcHJvcFZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbmltYS5hZnRlcikge1xuICAgICAgICAgICAgICBwcm9wVmFsICs9IGFuaW1hLmFmdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWEuZWxlbWVudC5zdHlsZVthbmltYS5wcm9wZXJ0eV0gPSBwcm9wVmFsO1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gZW5kKSB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRMICYmIChhbmltYURpciA9PT0gdW5kZWZpbmVkIHx8IGFuaW1hRGlyID09PSB0aGlzRGlyKSkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odGltZXN0YW1wKSB7XG4gICAgICAgICAgaWYgKCFydW5UaW1lKSB7XG4gICAgICAgICAgICBydW5UaW1lID0gdGltZXN0YW1wO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGltZVBhc3QgPSB0aW1lc3RhbXAgLSBydW5UaW1lO1xuICAgICAgICAgIGFuaW1hdGVCZyhhbmltYXRpb25zLCB0aGlzRGlyLCBiLCB0aW1lUGFzdCwgcnVuVGltZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBNYXRoLmVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIHQgLz0gZDtcbiAgICAgIHQtLTtcbiAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYjtcbiAgICB9O1xuXG4gICAgTWF0aC5lYXNlSW5PdXRTaW5lID0gZnVuY3Rpb24odCwgYiwgYywgZCkge1xuICAgICAgcmV0dXJuIC1jIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIGQpIC0gMSkgKyBiO1xuICAgIH07XG4gICAgTWF0aC5lYXNlT3V0U2luZSA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIHJldHVybiBjICogTWF0aC5zaW4odCAvIGQgKiAoTWF0aC5QSSAvIDIpKSArIGI7XG4gICAgfTtcbiAgICB2YXIgc2tlbGV0b25TdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShza2VsZXRvbnMpO1xuXG4gICAgZnVuY3Rpb24gaW5pdERyYWcoKSB7XG4gICAgICB2YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgdmFyIGlzRG93biA9IGZhbHNlO1xuICAgICAgdmFyIHhEZWx0YSA9IDA7XG4gICAgICB2YXIgc3RhcnRYO1xuICAgICAgdmFyIGRyYWdTdGFydCA9IDA7XG4gICAgICB2YXIgYmdEcmFnU3RhcnRQb3M7XG4gICAgICB2YXIgdlc7XG5cbiAgICAgIHNrZWxldG9ucy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBkcmFnZ2luZ1N0YXJ0LCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgc2tlbGV0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWdnaW5nT24sIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICBza2VsZXRvbnMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGRyYWdnaW5Db21wbGV0ZSwge3Bhc3NpdmU6IHRydWV9KTtcbiAgICAgIHNrZWxldG9ucy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZHJhZ2dpbkNvbXBsZXRlLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgc2tlbGV0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBkcmFnZ2luZ1N0YXJ0LCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgc2tlbGV0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGRyYWdnaW5nT24sIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICBza2VsZXRvbnMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBkcmFnZ2luQ29tcGxldGUsIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldFgoZSkge1xuICAgICAgICB2YXIgeDtcbiAgICAgICAgaWYgKHByb2JQaG9uZSkge1xuICAgICAgICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4ID0gZS5wYWdlWDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZHJhZ2dpbmdTdGFydChlKSB7XG4gICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgZHJhZ1N0YXJ0ID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xuICAgICAgICBzdGFydFggPSBnZXRYKGUpO1xuICAgICAgICB4RGVsdGEgPSAwO1xuICAgICAgICB2VyA9IDEwMCAvIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgYmdEcmFnU3RhcnRQb3MgPSBwYXJzZUludChza2VsZXRvblN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJyksIDEwKSAqIHZXO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkcmFnZ2luZ09uKGUpIHtcbiAgICAgICAgdmFyIFggPSBnZXRYKGUpO1xuICAgICAgICBpZiAoaXNEb3duICYmICEoWCA9PT0gc3RhcnRYKSkge1xuICAgICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgIHhEZWx0YSA9IFggLSBzdGFydFg7XG4gICAgICAgICAgc2tlbGV0b25zLnN0eWxlWydiYWNrZ3JvdW5kLXBvc2l0aW9uJ10gPSAoYmdEcmFnU3RhcnRQb3MgKyAoeERlbHRhICogdlcpKSArICd2dyBib3R0b20nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRyYWdnaW5Db21wbGV0ZSgpIHtcbiAgICAgICAgaXNEb3duID0gZmFsc2U7XG4gICAgICAgIGlmIChpc0RyYWdnaW5nKSB7XG4gICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgIHZhciBkcmFnRHVyYXRpb24gPSBOdW1iZXIobmV3IERhdGUoKSkgLSBkcmFnU3RhcnQ7XG4gICAgICAgICAgdmFyIGRyYWdTcGVlZCA9ICgoeERlbHRhICogdlcpIC8gZHJhZ0R1cmF0aW9uKTtcblxuICAgICAgICAgIGlmICgxIHx8ICghcHJvYlBob25lICYmIE1hdGguYWJzKGRyYWdTcGVlZCkgPj0gMC41KSB8fCAocHJvYlBob25lICYmIE1hdGguYWJzKGRyYWdTcGVlZCkgPj0gMC4zKSkge1xuICAgICAgICAgICAgdmFyIGRyYWdBY2MgPSAocHJvYlBob25lKSA/IDcgLyAxMDAwMCA6IDIgLyAxMDAwMDtcbiAgICAgICAgICAgIHZhciB0aW1lID0gTWF0aC5hYnMoZHJhZ1NwZWVkKSAvIGRyYWdBY2M7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSAoZHJhZ1NwZWVkICogdGltZSkgKyAoKE1hdGguc3FydChkcmFnQWNjKSAqIE1hdGguc3FydCh0aW1lKSkgLyAyKTtcbiAgICAgICAgICAgIHZhciBiZ1BvcyA9IHBhcnNlSW50KHNrZWxldG9uU3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtcG9zaXRpb24nKSwgMTApICogdlc7XG5cbiAgICAgICAgICAgIGFuaW1hRGlyID0gKHhEZWx0YSA+IDApO1xuICAgICAgICAgICAgdmFyIGRyYWcgPSBbe1xuICAgICAgICAgICAgICBwcm9wZXJ0eTogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxuICAgICAgICAgICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiB0aW1lLFxuICAgICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICAgIGRlbHRhOiBkaXN0YW5jZSxcbiAgICAgICAgICAgICAgc3RhcnRWYWw6IGJnUG9zLFxuICAgICAgICAgICAgICB0YXJnZXQ6IGJnUG9zICsgZGlzdGFuY2UsXG4gICAgICAgICAgICAgIGFmdGVyOiAndncgYm90dG9tJyxcbiAgICAgICAgICAgICAgZWFzZTogJ2Vhc2VPdXRTaW5lJ1xuICAgICAgICAgICAgfV07XG4gICAgICAgICAgICBhbmltYXRlQmcoZHJhZywgYW5pbWFEaXIsIGRyYWdTcGVlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydFggPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICAkKCc8aW1nIC8+JykuYXR0cignc3JjJywgYmFja2dyb3VuZCkubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICBhbmltYXRlQmcoaW5pdGlhbEFuaW1hdGlvbnMpO1xuICAgICAgaW5pdERyYWcoKTtcbiAgICB9KTtcbiAgICAkKCcubW9kYWwnKS5tb2RhbCh7XG4gICAgICBzdGFydGluZ1RvcDogJy00MCUnLFxuICAgICAgZW5kaW5nVG9wOiAnMTAlJyxcbiAgICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQ2FsbGJhY2sgZm9yIE1vZGFsIG9wZW4uIE1vZGFsIGFuZCB0cmlnZ2VyIHBhcmFtZXRlcnMgYXZhaWxhYmxlLlxuICAgICAgICBmdW5jdGlvbiBtb2RhbENsb3NlKCkge1xuICAgICAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBzbmlmZkVzY0tleSk7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc25pZmZNb2RhbENsb3NlKTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNuaWZmTW9kYWxDbG9zZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc25pZmZNb2RhbENsb3NlKGVsKSB7XG4gICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IE9iamVjdC52YWx1ZXMoZWwudGFyZ2V0LmNsYXNzTGlzdCk7XG4gICAgICAgICAgaWYgKGNsYXNzTGlzdC5pbmRleE9mKCdtb2RhbC1vdmVybGF5JykgPiAtMSB8fCBjbGFzc0xpc3QuaW5kZXhPZignbW9kYWwtY2xvc2UnKSA+IC0xKSB7XG4gICAgICAgICAgICBtb2RhbENsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNuaWZmRXNjS2V5KGUpIHtcbiAgICAgICAgICBpZiAoKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleSA9PT0gJ0VzYycgfHwgZS5rZXlDb2RlID09PSAyNykpIHtcbiAgICAgICAgICAgIG1vZGFsQ2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc25pZmZNb2RhbENsb3NlLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNuaWZmTW9kYWxDbG9zZSwge3Bhc3NpdmU6IHRydWV9KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc25pZmZFc2NLZXksIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICAgIHdpbmRvdy5sb2FkQ29udGFjdEluZm8oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIC8vIGVuZCBvZiBkb2N1bWVudCByZWFkeVxufSkoalF1ZXJ5KTtcbi8qXG4gKiBEaXNwbGF5ZXMgb2J1c2NhdGVkIGNvbnRhY3QgaW5mb1xuICovXG53aW5kb3cubG9hZENvbnRhY3RJbmZvID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb250YWN0TWV0aG9kcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LW1ldGhvZHMnKTtcbiAgdmFyIGNvbnRhY3RIYXNoID0gJ1BHRWdhSEpsWmowaWMyMXpPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWMyMXpMV3hwYm1zZ2FXTnZiaUJwWTI5dUxXTm9ZWFFnYVdOdmJpMWphR0YwTFdScGJYTWlQbE5OVXp4a2FYWStOakEwTFRNME1DMDNPVEkxUEM5a2FYWStQQzloUGp4aElHaHlaV1k5SW0xaGFXeDBienBwYm1adlFHeDFZMnQ1WVhCbExtTnZiVDl6ZFdKcVpXTjBQU1UxUWxkWFZ5VXlNRWx1Y1hWcGNtVWxOVVFpSUdOc1lYTnpQU0pwWTI5dUlHbGpiMjR0Wlc1MlpXeHZjR1VnYVdOdmJpMWxiblpsYkc5d1pTMWthVzF6SWo1RmJXRnBiRHhrYVhZK2FXNW1iMEJzZFdOcmVXRndaUzVqYjIwOEwyUnBkajQ4TDJFK1BHRWdhSEpsWmowaWRHVnNPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWFXTnZiaUJwWTI5dUxYQm9iMjVsTFdOaGJHd2dhV052Ymkxd2FHOXVaUzFqWVd4c0xXUnBiWE1pUGxSbGJEeGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBnPT0nO1xuICBjb250YWN0TWV0aG9kcy5pbm5lckhUTUwgPSBhdG9iKGNvbnRhY3RIYXNoKTtcbiAgaWYgKCFwcm9iUGhvbmUpIHtcbiAgICB2YXIgc21zTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbXMtbGluaycpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0LW1ldGhvZHMnKS5yZW1vdmVDaGlsZChzbXNMaW5rKTtcbiAgfVxufTtcbi8vIGVuZCBvZiBqUXVlcnkgbmFtZSBzcGFjZVxuIl0sImZpbGUiOiJob21lcGFnZS5qcyJ9
