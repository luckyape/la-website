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
      var canvass = document.querySelectorAll('.shootingstar'),
        cL = canvass.length;
      
      for (i = 0; i < cL; ++i) {
       
         setTimeout('function() { var  shower('+canvass[i]+', '+ cL+'); }', 8000 * Math.random() );
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

  function shower(canvas, cL) {
    var rN = Math.random(),
      rotate = Math.random() * Math.PI * 2 * 57.295,
      s =  Math.random() * Math.floor(Math.random() * cL) + 1,
      delay = Math.random() * 4000 * s,
      x = 30 - (60 * Math.random()),
      y = 40* Math.random(),
      transform = ' translate('+ x +'vw, ' + y + 'vh) scale(' + rN + ') rotate(' + rotate + 'deg)';
    console.info(canvas.offsetTop);
    canvas.style.transform = transform;
    draw(canvas);
    setTimeout(function() { shower(canvas, cL); }, delay);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICAgIG9uT3BlbjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG4gICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICRjb250V3JhcC5hZGRDbGFzcygnbGEtYmx1cicpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNsb3NlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICQoJ2xpJywgZWwpLmNzcyh7XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgICAkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgJG5hdmJhciA9ICQoJyNsYS1uYXZiYXItZmxleCcpO1xuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgaWYgKHlfc2Nyb2xsX3BvcyA+IDM1MCAmJiAhJG5hdmJhci5oYXNDbGFzcygnbmF2YmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeV9zY3JvbGxfcG9zIDwgMjApIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgY2FudmFzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaG9vdGluZ3N0YXInKSxcbiAgICAgICAgY0wgPSBjYW52YXNzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgZm9yIChpID0gMDsgaSA8IGNMOyArK2kpIHtcbiAgICAgICBcbiAgICAgICAgIHNldFRpbWVvdXQoJ2Z1bmN0aW9uKCkgeyB2YXIgIHNob3dlcignK2NhbnZhc3NbaV0rJywgJysgY0wrJyk7IH0nLCA4MDAwICogTWF0aC5yYW5kb20oKSApO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBlbmQgb2YgZG9jdW1lbnQgcmVhZHlcbiAgICB9KVxuICB9KShqUXVlcnkpOyAvLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcbiAgdmFyIHByb2JQaG9uZSA9ICgoL2lwaG9uZXxhbmRyb2lkfGllfGJsYWNrYmVycnl8ZmVubmVjLykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gbG9hZENvbnRhY3RJbmZvKCkge1xuICAgIHZhciBjb250YWN0TWV0aG9kcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LW1ldGhvZHMnKTtcbiAgICBjb250YWN0TWV0aG9kcy5pbm5lckhUTUwgPSBhdG9iKCdQR0VnYUhKbFpqMGljMjF6T2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGljMjF6TFd4cGJtc2dhV052YmlCcFkyOXVMV05vWVhRZ2FXTnZiaTFqYUdGMExXUnBiWE1pUGxOTlV6eGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBqeGhJR2h5WldZOUltMWhhV3gwYnpwcGJtWnZRR3gxWTJ0NVlYQmxMbU52YlQ5emRXSnFaV04wUFNVMVFsZFhWeVV5TUVsdWNYVnBjbVVsTlVRaUlHTnNZWE56UFNKcFkyOXVJR2xqYjI0dFpXNTJaV3h2Y0dVZ2FXTnZiaTFsYm5abGJHOXdaUzFrYVcxeklqNUZiV0ZwYkR4a2FYWSthVzVtYjBCc2RXTnJlV0Z3WlM1amIyMDhMMlJwZGo0OEwyRStQR0VnYUhKbFpqMGlkR1ZzT2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGlhV052YmlCcFkyOXVMWEJvYjI1bExXTmhiR3dnYVdOdmJpMXdhRzl1WlMxallXeHNMV1JwYlhNaVBsUmxiRHhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQZz09Jyk7XG4gICAgaWYgKDAgJiYgIXByb2JQaG9uZSkge1xuICAgICAgdmFyIHNtc0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc21zLWxpbmsnKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0LW1ldGhvZHMnKS5yZW1vdmVDaGlsZChzbXNMaW5rKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd2VyKGNhbnZhcywgY0wpIHtcbiAgICB2YXIgck4gPSBNYXRoLnJhbmRvbSgpLFxuICAgICAgcm90YXRlID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyICogNTcuMjk1LFxuICAgICAgcyA9ICBNYXRoLnJhbmRvbSgpICogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY0wpICsgMSxcbiAgICAgIGRlbGF5ID0gTWF0aC5yYW5kb20oKSAqIDQwMDAgKiBzLFxuICAgICAgeCA9IDMwIC0gKDYwICogTWF0aC5yYW5kb20oKSksXG4gICAgICB5ID0gNDAqIE1hdGgucmFuZG9tKCksXG4gICAgICB0cmFuc2Zvcm0gPSAnIHRyYW5zbGF0ZSgnKyB4ICsndncsICcgKyB5ICsgJ3ZoKSBzY2FsZSgnICsgck4gKyAnKSByb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJztcbiAgICBjb25zb2xlLmluZm8oY2FudmFzLm9mZnNldFRvcCk7XG4gICAgY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICBkcmF3KGNhbnZhcyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2hvd2VyKGNhbnZhcywgY0wpOyB9LCBkZWxheSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcmF3KGNhbnZhcykge1xuICAgIGlmIChjYW52YXMuZ2V0Q29udGV4dCkge1xuICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IC4zO1xuICAgICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xuICAgICAgdmFyIHRhaWxXID0gY2FudmFzLndpZHRoLFxuICAgICAgICB0YWlsSCA9IGNhbnZhcy5oZWlnaHQsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBzID0gdGFpbFcgLyB0YWlsSCxcbiAgICAgICAgY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRhaWxXLCB0YWlsSCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRhaWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjbGVhcigpO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHgubW92ZVRvKGkgKiBzLCBpKTtcbiAgICAgICAgICBjdHgubGluZVRvKHRhaWxXLCB0YWlsSCk7XG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgIGlmIChpIDwgdGFpbEgpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGFpbCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGkrKztcbiAgICAgICAgfTtcbiAgICAgIHdoaWxlIChpIDwgdGFpbEgpIHtcbiAgICAgICAgY2xlYXIoKTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgICAgICBjdHgubGluZVRvKGkgKiBzLCBpKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBjdHgubGluZVdpZHRoID0gLjc1O1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgLjgpJztcbiAgICAgIGkgPSAwO1xuICAgICAgc2V0VGltZW91dCh0YWlsLCAxMDApO1xuICAgIH1cbiAgfSJdLCJmaWxlIjoiaW5pdC5qcyJ9
