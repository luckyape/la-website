(function($) {
    $(function() {
      var $contWrap = $('#la-content-wrapper');
      $('.button-collapse').sideNav({
        onOpen: function(el) {
          setTimeout(function() {
            Materialize.showStaggeredList('#nav-mobile');
          }, 50);
          $contWrap.addClass('la-blur');
        },
        onClose: function(el) {
          $('li', el).css({
            opacity: 0
          })
          $contWrap.removeClass('la-blur');
        }
      });
      var $navbar = $('#la-navbar-flex');
      $(window).on('scroll', function() {
        var y_scroll_pos = window.pageYOffset;
        if (y_scroll_pos > 350 && !$navbar.hasClass('navbar-fixed')) {
          $navbar.removeClass('reveal');
          $navbar.addClass('navbar-fixed');
          setTimeout(function() {
            $navbar.addClass('reveal');
          }, 300);
        }
        if (y_scroll_pos < 20) {
          $navbar.removeClass('navbar-fixed');
          $navbar.addClass('reveal');
        }
      });
      var canvass = document.querySelectorAll('.shootingstar');
      
      for (i = 0; i < canvass.length; ++i) {
        shower(canvass[i]);
      }
      
      // end of document ready
    })
  })(jQuery); // end of jQuery name space
  var probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) && 'ontouchstart' in document.documentElement);

  function loadContactInfo() {
    var contactMethods = document.getElementById('contact-methods');
    contactMethods.innerHTML = atob('PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==');
    if (0 && !probPhone) {
      var smsLink = document.querySelector('.sms-link');
      document.querySelector('.contact-methods').removeChild(smsLink);
    };
  }

  function shower(canvas) {
    var rN = Math.random(),
      rotate = Math.random() * Math.PI * 2 * 57.295,
      delay = Math.random() * 2000;
      x = 30 - (60 * Math.random());
      y = 40* Math.random(),
      transform = ' translate('+ x +'vw, ' + y + 'vh) scale(' + rN + ') rotate(' + rotate + 'deg)';
    console.info(canvas.offsetTop);
    canvas.style.transform = transform;
    draw(canvas);
    setTimeout(function() { shower(canvas); }, delay);
  }

  function draw(canvas) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = .3;
      ctx.lineCap = 'round';
      var tailW = canvas.width,
        tailH = canvas.height,
        i = 0,
        s = tailW / tailH,
        clear = function() {
          ctx.clearRect(0, 0, tailW, tailH);
        },
        tail = function() {
          clear();
          ctx.beginPath();
          ctx.moveTo(i * s, i);
          ctx.lineTo(tailW, tailH);
          ctx.stroke();
          if (i < tailH) {
            setTimeout(tail, 0);
          }
          i++;
        };
      while (i < tailH) {
        clear();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(i * s, i);
        ctx.stroke();
        i++;
      }
      ctx.lineWidth = .75;
      ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
      i = 0;
      setTimeout(tail, 100);
    }
  }
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICAgIG9uT3BlbjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG4gICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICRjb250V3JhcC5hZGRDbGFzcygnbGEtYmx1cicpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNsb3NlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICQoJ2xpJywgZWwpLmNzcyh7XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgICAkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgJG5hdmJhciA9ICQoJyNsYS1uYXZiYXItZmxleCcpO1xuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgaWYgKHlfc2Nyb2xsX3BvcyA+IDM1MCAmJiAhJG5hdmJhci5oYXNDbGFzcygnbmF2YmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeV9zY3JvbGxfcG9zIDwgMjApIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgY2FudmFzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaG9vdGluZ3N0YXInKTtcbiAgICAgIFxuICAgICAgZm9yIChpID0gMDsgaSA8IGNhbnZhc3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc2hvd2VyKGNhbnZhc3NbaV0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBlbmQgb2YgZG9jdW1lbnQgcmVhZHlcbiAgICB9KVxuICB9KShqUXVlcnkpOyAvLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcbiAgdmFyIHByb2JQaG9uZSA9ICgoL2lwaG9uZXxhbmRyb2lkfGllfGJsYWNrYmVycnl8ZmVubmVjLykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gbG9hZENvbnRhY3RJbmZvKCkge1xuICAgIHZhciBjb250YWN0TWV0aG9kcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LW1ldGhvZHMnKTtcbiAgICBjb250YWN0TWV0aG9kcy5pbm5lckhUTUwgPSBhdG9iKCdQR0VnYUhKbFpqMGljMjF6T2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGljMjF6TFd4cGJtc2dhV052YmlCcFkyOXVMV05vWVhRZ2FXTnZiaTFqYUdGMExXUnBiWE1pUGxOTlV6eGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBqeGhJR2h5WldZOUltMWhhV3gwYnpwcGJtWnZRR3gxWTJ0NVlYQmxMbU52YlQ5emRXSnFaV04wUFNVMVFsZFhWeVV5TUVsdWNYVnBjbVVsTlVRaUlHTnNZWE56UFNKcFkyOXVJR2xqYjI0dFpXNTJaV3h2Y0dVZ2FXTnZiaTFsYm5abGJHOXdaUzFrYVcxeklqNUZiV0ZwYkR4a2FYWSthVzVtYjBCc2RXTnJlV0Z3WlM1amIyMDhMMlJwZGo0OEwyRStQR0VnYUhKbFpqMGlkR1ZzT2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGlhV052YmlCcFkyOXVMWEJvYjI1bExXTmhiR3dnYVdOdmJpMXdhRzl1WlMxallXeHNMV1JwYlhNaVBsUmxiRHhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQZz09Jyk7XG4gICAgaWYgKDAgJiYgIXByb2JQaG9uZSkge1xuICAgICAgdmFyIHNtc0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc21zLWxpbmsnKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0LW1ldGhvZHMnKS5yZW1vdmVDaGlsZChzbXNMaW5rKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd2VyKGNhbnZhcykge1xuICAgIHZhciByTiA9IE1hdGgucmFuZG9tKCksXG4gICAgICByb3RhdGUgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDIgKiA1Ny4yOTUsXG4gICAgICBkZWxheSA9IE1hdGgucmFuZG9tKCkgKiAyMDAwO1xuICAgICAgeCA9IDMwIC0gKDYwICogTWF0aC5yYW5kb20oKSk7XG4gICAgICB5ID0gNDAqIE1hdGgucmFuZG9tKCksXG4gICAgICB0cmFuc2Zvcm0gPSAnIHRyYW5zbGF0ZSgnKyB4ICsndncsICcgKyB5ICsgJ3ZoKSBzY2FsZSgnICsgck4gKyAnKSByb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJztcbiAgICBjb25zb2xlLmluZm8oY2FudmFzLm9mZnNldFRvcCk7XG4gICAgY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICBkcmF3KGNhbnZhcyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2hvd2VyKGNhbnZhcyk7IH0sIGRlbGF5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcoY2FudmFzKSB7XG4gICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKSc7XG4gICAgICBjdHgubGluZVdpZHRoID0gLjM7XG4gICAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgICB2YXIgdGFpbFcgPSBjYW52YXMud2lkdGgsXG4gICAgICAgIHRhaWxIID0gY2FudmFzLmhlaWdodCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIHMgPSB0YWlsVyAvIHRhaWxILFxuICAgICAgICBjbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGFpbFcsIHRhaWxIKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNsZWFyKCk7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5tb3ZlVG8oaSAqIHMsIGkpO1xuICAgICAgICAgIGN0eC5saW5lVG8odGFpbFcsIHRhaWxIKTtcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgaWYgKGkgPCB0YWlsSCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCh0YWlsLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9O1xuICAgICAgd2hpbGUgKGkgPCB0YWlsSCkge1xuICAgICAgICBjbGVhcigpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oMCwgMCk7XG4gICAgICAgIGN0eC5saW5lVG8oaSAqIHMsIGkpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGN0eC5saW5lV2lkdGggPSAuNzU7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAuOCknO1xuICAgICAgaSA9IDA7XG4gICAgICBzZXRUaW1lb3V0KHRhaWwsIDEwMCk7XG4gICAgfVxuICB9Il0sImZpbGUiOiJpbml0LmpzIn0=
