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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lcGFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgalF1ZXJ5LCBhdG9iLCBiYWNrZ3JvdW5kLCB3aW5kb3csIGRvY3VtZW50LCBwcm9iUGhvbmUgKi9cbihmdW5jdGlvbigkKSB7XG4gICQoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJvZHkgPSAkKCdodG1sID4gYm9keScpO1xuICAgICQoJyNjdGEtYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICBib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB2YXIgc2tlbGV0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NrZWxldG9ucycpO1xuXG4gICAgdmFyIGluaXRpYWxBbmltYXRpb25zID0gW3tcbiAgICAgIHByb3BlcnR5OiAnb3BhY2l0eScsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiAxLFxuICAgICAgc3RhcnRWYWw6IDAsXG4gICAgICB0YXJnZXQ6IDFcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2ZpbHRlcicsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiAtMjQsXG4gICAgICBzdGFydFZhbDogMjQsXG4gICAgICB0YXJnZXQ6IDAsXG4gICAgICBiZWZvcmU6ICdibHVyKCcsXG4gICAgICBhZnRlcjogJ3B4KSdcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2JhY2tncm91bmQtc2l6ZScsXG4gICAgICBlbGVtZW50OiBza2VsZXRvbnMsXG4gICAgICBkdXJhdGlvbjogMTYwMCxcbiAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgIGRlbHRhOiA1MCxcbiAgICAgIHN0YXJ0VmFsOiA1LFxuICAgICAgdGFyZ2V0OiA1NSxcbiAgICAgIGJlZm9yZTogJ2F1dG8gJyxcbiAgICAgIGFmdGVyOiAnJSdcbiAgICB9LCB7XG4gICAgICBwcm9wZXJ0eTogJ2JhY2tncm91bmQtcG9zaXRpb24nLFxuICAgICAgZWxlbWVudDogc2tlbGV0b25zLFxuICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICBzdGFydFRpbWU6IDUwMCxcbiAgICAgIGRlbHRhOiAtMzAwLFxuICAgICAgc3RhcnRWYWw6IDEwMCxcbiAgICAgIHRhcmdldDogLTIwMCxcbiAgICAgIGFmdGVyOiAndncgYm90dG9tJyxcbiAgICAgIGVhc2U6ICdlYXNlSW5PdXRTaW5lJ1xuICAgIH1dO1xuICAgIHZhciBhbmltYURpcjtcblxuICAgIGZ1bmN0aW9uIGFuaW1hdGVCZyhhbmltYXRpb25zLCB0aGlzRGlyLCBiLCB0aW1lUGFzdCwgcnVuVGltZSkge1xuICAgICAgdmFyIGRMID0gYW5pbWF0aW9ucy5sZW5ndGg7XG4gICAgICBpZiAodGltZVBhc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IGRMIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB2YXIgYW5pbWEgPSBhbmltYXRpb25zW2ldO1xuICAgICAgICAgIHZhciBzdGFydFRpbWUgPSBhbmltYS5zdGFydFRpbWU7XG4gICAgICAgICAgaWYgKHRpbWVQYXN0ID49IHN0YXJ0VGltZSkge1xuICAgICAgICAgICAgdmFyIHQgPSB0aW1lUGFzdCAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQgPSB0IC8gYW5pbWEuZHVyYXRpb247XG4gICAgICAgICAgICB2YXIgc3RhcnRWYWwgPSBhbmltYS5zdGFydFZhbDtcbiAgICAgICAgICAgIHZhciB2YWw7XG4gICAgICAgICAgICBpZiAoYW5pbWEuZWFzZSkge1xuICAgICAgICAgICAgICBiID0gYiB8fCAwO1xuICAgICAgICAgICAgICB2YXIgYyA9IGFuaW1hLmRlbHRhO1xuICAgICAgICAgICAgICB2YXIgZCA9IGFuaW1hLmR1cmF0aW9uO1xuICAgICAgICAgICAgICB2YWwgPSBwYXJzZUludCgoTWF0aFthbmltYS5lYXNlXSh0LCBiLCBjLCBkKSkgKyBzdGFydFZhbCwgMTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsID0gc3RhcnRWYWwgKyAoaW5jcmVtZW50ICogYW5pbWEuZGVsdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVuZCA9IHN0YXJ0VmFsICsgYW5pbWEuZGVsdGE7XG4gICAgICAgICAgICBpZiAodCA+IGFuaW1hLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgIHZhbCA9IGVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9wVmFsID0gdmFsO1xuICAgICAgICAgICAgaWYgKGFuaW1hLmJlZm9yZSkge1xuICAgICAgICAgICAgICBwcm9wVmFsID0gYW5pbWEuYmVmb3JlICsgcHJvcFZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbmltYS5hZnRlcikge1xuICAgICAgICAgICAgICBwcm9wVmFsICs9IGFuaW1hLmFmdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWEuZWxlbWVudC5zdHlsZVthbmltYS5wcm9wZXJ0eV0gPSBwcm9wVmFsO1xuICAgICAgICAgICAgaWYgKHZhbCA9PT0gZW5kKSB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRMICYmIChhbmltYURpciA9PT0gdW5kZWZpbmVkIHx8IGFuaW1hRGlyID09PSB0aGlzRGlyKSkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odGltZXN0YW1wKSB7XG4gICAgICAgICAgaWYgKCFydW5UaW1lKSB7XG4gICAgICAgICAgICBydW5UaW1lID0gdGltZXN0YW1wO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGltZVBhc3QgPSB0aW1lc3RhbXAgLSBydW5UaW1lO1xuICAgICAgICAgIGFuaW1hdGVCZyhhbmltYXRpb25zLCB0aGlzRGlyLCBiLCB0aW1lUGFzdCwgcnVuVGltZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBNYXRoLmVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIHQgLz0gZDtcbiAgICAgIHQtLTtcbiAgICAgIHJldHVybiBjICogKHQgKiB0ICogdCArIDEpICsgYjtcbiAgICB9O1xuXG4gICAgTWF0aC5lYXNlSW5PdXRTaW5lID0gZnVuY3Rpb24odCwgYiwgYywgZCkge1xuICAgICAgcmV0dXJuIC1jIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIGQpIC0gMSkgKyBiO1xuICAgIH07XG4gICAgTWF0aC5lYXNlT3V0U2luZSA9IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcbiAgICAgIHJldHVybiBjICogTWF0aC5zaW4odCAvIGQgKiAoTWF0aC5QSSAvIDIpKSArIGI7XG4gICAgfTtcbiAgICB2YXIgc2tlbGV0b25TdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShza2VsZXRvbnMpO1xuXG4gICAgZnVuY3Rpb24gaW5pdERyYWcoKSB7XG4gICAgICB2YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgdmFyIGlzRG93biA9IGZhbHNlO1xuICAgICAgdmFyIHhEZWx0YSA9IDA7XG4gICAgICB2YXIgc3RhcnRYO1xuICAgICAgdmFyIGRyYWdTdGFydCA9IDA7XG4gICAgICB2YXIgYmdEcmFnU3RhcnRQb3M7XG4gICAgICB2YXIgdlc7XG5cbiAgICAgIHNrZWxldG9ucy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBkcmFnZ2luZ1N0YXJ0LCBmYWxzZSk7XG4gICAgICBza2VsZXRvbnMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZHJhZ2dpbmdPbiwgZmFsc2UpO1xuICAgICAgc2tlbGV0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBkcmFnZ2luQ29tcGxldGUsIGZhbHNlKTtcbiAgICAgIHNrZWxldG9ucy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZHJhZ2dpbkNvbXBsZXRlLCBmYWxzZSk7XG4gICAgICBza2VsZXRvbnMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGRyYWdnaW5nU3RhcnQsIGZhbHNlKTtcbiAgICAgIHNrZWxldG9ucy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBkcmFnZ2luZ09uLCBmYWxzZSk7XG4gICAgICBza2VsZXRvbnMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBkcmFnZ2luQ29tcGxldGUsIGZhbHNlKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0WChlKSB7XG4gICAgICAgIHZhciB4O1xuICAgICAgICBpZiAocHJvYlBob25lKSB7XG4gICAgICAgICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggPSBlLnBhZ2VYO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkcmFnZ2luZ1N0YXJ0KGUpIHtcbiAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBpc0Rvd24gPSB0cnVlO1xuICAgICAgICBkcmFnU3RhcnQgPSBOdW1iZXIobmV3IERhdGUoKSk7XG4gICAgICAgIHN0YXJ0WCA9IGdldFgoZSk7XG4gICAgICAgIHhEZWx0YSA9IDA7XG4gICAgICAgIHZXID0gMTAwIC8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICBiZ0RyYWdTdGFydFBvcyA9IHBhcnNlSW50KHNrZWxldG9uU3R5bGVzLmdldFByb3BlcnR5VmFsdWUoJ2JhY2tncm91bmQtcG9zaXRpb24nKSwgMTApICogdlc7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGRyYWdnaW5nT24oZSkge1xuICAgICAgICB2YXIgWCA9IGdldFgoZSk7XG4gICAgICAgIGlmIChpc0Rvd24gJiYgIShYID09PSBzdGFydFgpKSB7XG4gICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgeERlbHRhID0gWCAtIHN0YXJ0WDtcbiAgICAgICAgICBza2VsZXRvbnMuc3R5bGVbJ2JhY2tncm91bmQtcG9zaXRpb24nXSA9IChiZ0RyYWdTdGFydFBvcyArICh4RGVsdGEgKiB2VykpICsgJ3Z3IGJvdHRvbSc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZHJhZ2dpbkNvbXBsZXRlKCkge1xuICAgICAgICBpc0Rvd24gPSBmYWxzZTtcbiAgICAgICAgaWYgKGlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgICAgdmFyIGRyYWdEdXJhdGlvbiA9IE51bWJlcihuZXcgRGF0ZSgpKSAtIGRyYWdTdGFydDtcbiAgICAgICAgICB2YXIgZHJhZ1NwZWVkID0gKCh4RGVsdGEgKiB2VykgLyBkcmFnRHVyYXRpb24pO1xuXG4gICAgICAgICAgaWYgKDEgfHwgKCFwcm9iUGhvbmUgJiYgTWF0aC5hYnMoZHJhZ1NwZWVkKSA+PSAwLjUpIHx8IChwcm9iUGhvbmUgJiYgTWF0aC5hYnMoZHJhZ1NwZWVkKSA+PSAwLjMpKSB7XG4gICAgICAgICAgICB2YXIgZHJhZ0FjYyA9IChwcm9iUGhvbmUpID8gNyAvIDEwMDAwIDogMiAvIDEwMDAwO1xuICAgICAgICAgICAgdmFyIHRpbWUgPSBNYXRoLmFicyhkcmFnU3BlZWQpIC8gZHJhZ0FjYztcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IChkcmFnU3BlZWQgKiB0aW1lKSArICgoTWF0aC5zcXJ0KGRyYWdBY2MpICogTWF0aC5zcXJ0KHRpbWUpKSAvIDIpO1xuICAgICAgICAgICAgdmFyIGJnUG9zID0gcGFyc2VJbnQoc2tlbGV0b25TdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZC1wb3NpdGlvbicpLCAxMCkgKiB2VztcblxuICAgICAgICAgICAgYW5pbWFEaXIgPSAoeERlbHRhID4gMCk7XG4gICAgICAgICAgICB2YXIgZHJhZyA9IFt7XG4gICAgICAgICAgICAgIHByb3BlcnR5OiAnYmFja2dyb3VuZC1wb3NpdGlvbicsXG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHNrZWxldG9ucyxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRpbWUsXG4gICAgICAgICAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgICAgICAgICAgZGVsdGE6IGRpc3RhbmNlLFxuICAgICAgICAgICAgICBzdGFydFZhbDogYmdQb3MsXG4gICAgICAgICAgICAgIHRhcmdldDogYmdQb3MgKyBkaXN0YW5jZSxcbiAgICAgICAgICAgICAgYWZ0ZXI6ICd2dyBib3R0b20nLFxuICAgICAgICAgICAgICBlYXNlOiAnZWFzZU91dFNpbmUnXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgICAgIGFuaW1hdGVCZyhkcmFnLCBhbmltYURpciwgZHJhZ1NwZWVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0WCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgICQoJzxpbWcgLz4nKS5hdHRyKCdzcmMnLCBiYWNrZ3JvdW5kKS5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgIGFuaW1hdGVCZyhpbml0aWFsQW5pbWF0aW9ucyk7XG4gICAgICBpbml0RHJhZygpO1xuICAgIH0pO1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcbiAgICAgIHN0YXJ0aW5nVG9wOiAnLTQwJScsXG4gICAgICBlbmRpbmdUb3A6ICcxMCUnLFxuICAgICAgcmVhZHk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDYWxsYmFjayBmb3IgTW9kYWwgb3Blbi4gTW9kYWwgYW5kIHRyaWdnZXIgcGFyYW1ldGVycyBhdmFpbGFibGUuXG4gICAgICAgIGZ1bmN0aW9uIG1vZGFsQ2xvc2UoKSB7XG4gICAgICAgICAgYm9keS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHNuaWZmRXNjS2V5KTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzbmlmZk1vZGFsQ2xvc2UpO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc25pZmZNb2RhbENsb3NlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzbmlmZk1vZGFsQ2xvc2UoZWwpIHtcbiAgICAgICAgICB2YXIgY2xhc3NMaXN0ID0gT2JqZWN0LnZhbHVlcyhlbC50YXJnZXQuY2xhc3NMaXN0KTtcbiAgICAgICAgICBpZiAoY2xhc3NMaXN0LmluZGV4T2YoJ21vZGFsLW92ZXJsYXknKSA+IC0xIHx8IGNsYXNzTGlzdC5pbmRleE9mKCdtb2RhbC1jbG9zZScpID4gLTEpIHtcbiAgICAgICAgICAgIG1vZGFsQ2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc25pZmZFc2NLZXkoZSkge1xuICAgICAgICAgIGlmICgoZS5rZXkgPT09ICdFc2NhcGUnIHx8IGUua2V5ID09PSAnRXNjJyB8fCBlLmtleUNvZGUgPT09IDI3KSkge1xuICAgICAgICAgICAgbW9kYWxDbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzbmlmZk1vZGFsQ2xvc2UsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzbmlmZk1vZGFsQ2xvc2UsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc25pZmZFc2NLZXksIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmxvYWRDb250YWN0SW5mbygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgLy8gZW5kIG9mIGRvY3VtZW50IHJlYWR5XG59KShqUXVlcnkpO1xuLypcbiAqIERpc3BsYXllcyBvYnVzY2F0ZWQgY29udGFjdCBpbmZvXG4gKi9cbndpbmRvdy5sb2FkQ29udGFjdEluZm8gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbnRhY3RNZXRob2RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbWV0aG9kcycpO1xuICB2YXIgY29udGFjdEhhc2ggPSAnUEdFZ2FISmxaajBpYzIxek9qRXROakEwTFRNME1DMDNPVEkxSWlCamJHRnpjejBpYzIxekxXeHBibXNnYVdOdmJpQnBZMjl1TFdOb1lYUWdhV052YmkxamFHRjBMV1JwYlhNaVBsTk5VenhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQanhoSUdoeVpXWTlJbTFoYVd4MGJ6cHBibVp2UUd4MVkydDVZWEJsTG1OdmJUOXpkV0pxWldOMFBTVTFRbGRYVnlVeU1FbHVjWFZwY21VbE5VUWlJR05zWVhOelBTSnBZMjl1SUdsamIyNHRaVzUyWld4dmNHVWdhV052YmkxbGJuWmxiRzl3WlMxa2FXMXpJajVGYldGcGJEeGthWFkrYVc1bWIwQnNkV05yZVdGd1pTNWpiMjA4TDJScGRqNDhMMkUrUEdFZ2FISmxaajBpZEdWc09qRXROakEwTFRNME1DMDNPVEkxSWlCamJHRnpjejBpYVdOdmJpQnBZMjl1TFhCb2IyNWxMV05oYkd3Z2FXTnZiaTF3YUc5dVpTMWpZV3hzTFdScGJYTWlQbFJsYkR4a2FYWStOakEwTFRNME1DMDNPVEkxUEM5a2FYWStQQzloUGc9PSc7XG4gIGNvbnRhY3RNZXRob2RzLmlubmVySFRNTCA9IGF0b2IoY29udGFjdEhhc2gpO1xuICBpZiAoIXByb2JQaG9uZSkge1xuICAgIHZhciBzbXNMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNtcy1saW5rJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3QtbWV0aG9kcycpLnJlbW92ZUNoaWxkKHNtc0xpbmspO1xuICB9XG59O1xuLy8gZW5kIG9mIGpRdWVyeSBuYW1lIHNwYWNlXG4iXSwiZmlsZSI6ImhvbWVwYWdlLmpzIn0=
