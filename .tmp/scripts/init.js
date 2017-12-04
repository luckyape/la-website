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
          
         shower(canvass[i], cL);
         break;
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
    var small = (probPhone)? .6 : 1,
      rN = ((Math.random()/2) * small ) + .5,
      rotate = Math.random() * Math.PI * 2 * 25,
      s =  Math.random() * Math.floor(Math.random() * cL) + 1,
      delay = Math.random() * 4000 * s,
      x = (screen.width - 100) * Math.random(),
      y = (screen.height - 100) * Math.random(),
      transform = ' translate('+ x +'px, ' + y + 'px) scale(' + rN + ') rotate(' + rotate + 'deg)';
  


    console.info(screen.height);
    canvas.style.transform = transform;
    draw(canvas);
   // setTimeout(function() { shower(canvas, cL); }, delay);
  }

  function draw(canvas) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = .8;
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
        },
        meteor = function () {
          clear();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(i * s, i);
          ctx.stroke();
          if (i < tailH) {
            setTimeout(meteor, 0);
          } else {
            ctx.lineWidth = .75;
            ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
            i = 0;
           // setTimeout(tail, 100);
          }
          i++;

        };

      meteor();
    
    }
  }
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG4gICAgJChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICAgIG9uT3BlbjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG4gICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICRjb250V3JhcC5hZGRDbGFzcygnbGEtYmx1cicpO1xuICAgICAgICB9LFxuICAgICAgICBvbkNsb3NlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICQoJ2xpJywgZWwpLmNzcyh7XG4gICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgfSlcbiAgICAgICAgICAkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgJG5hdmJhciA9ICQoJyNsYS1uYXZiYXItZmxleCcpO1xuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgaWYgKHlfc2Nyb2xsX3BvcyA+IDM1MCAmJiAhJG5hdmJhci5oYXNDbGFzcygnbmF2YmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG4gICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeV9zY3JvbGxfcG9zIDwgMjApIHtcbiAgICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgY2FudmFzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaG9vdGluZ3N0YXInKSxcbiAgICAgICAgY0wgPSBjYW52YXNzLmxlbmd0aDtcbiAgICAgIFxuICAgICAgZm9yIChpID0gMDsgaSA8IGNMOyArK2kpIHtcbiAgICAgICAgICBcbiAgICAgICAgIHNob3dlcihjYW52YXNzW2ldLCBjTCk7XG4gICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gZW5kIG9mIGRvY3VtZW50IHJlYWR5XG4gICAgfSlcbiAgfSkoalF1ZXJ5KTsgLy8gZW5kIG9mIGpRdWVyeSBuYW1lIHNwYWNlXG5cblxuICB2YXIgcHJvYlBob25lID0gKCgvaXBob25lfGFuZHJvaWR8aWV8YmxhY2tiZXJyeXxmZW5uZWMvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSkgJiYgJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuICBmdW5jdGlvbiBsb2FkQ29udGFjdEluZm8oKSB7XG4gICAgdmFyIGNvbnRhY3RNZXRob2RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbWV0aG9kcycpO1xuICAgIGNvbnRhY3RNZXRob2RzLmlubmVySFRNTCA9IGF0b2IoJ1BHRWdhSEpsWmowaWMyMXpPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWMyMXpMV3hwYm1zZ2FXTnZiaUJwWTI5dUxXTm9ZWFFnYVdOdmJpMWphR0YwTFdScGJYTWlQbE5OVXp4a2FYWStOakEwTFRNME1DMDNPVEkxUEM5a2FYWStQQzloUGp4aElHaHlaV1k5SW0xaGFXeDBienBwYm1adlFHeDFZMnQ1WVhCbExtTnZiVDl6ZFdKcVpXTjBQU1UxUWxkWFZ5VXlNRWx1Y1hWcGNtVWxOVVFpSUdOc1lYTnpQU0pwWTI5dUlHbGpiMjR0Wlc1MlpXeHZjR1VnYVdOdmJpMWxiblpsYkc5d1pTMWthVzF6SWo1RmJXRnBiRHhrYVhZK2FXNW1iMEJzZFdOcmVXRndaUzVqYjIwOEwyUnBkajQ4TDJFK1BHRWdhSEpsWmowaWRHVnNPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWFXTnZiaUJwWTI5dUxYQm9iMjVsTFdOaGJHd2dhV052Ymkxd2FHOXVaUzFqWVd4c0xXUnBiWE1pUGxSbGJEeGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBnPT0nKTtcbiAgICBpZiAoMCAmJiAhcHJvYlBob25lKSB7XG4gICAgICB2YXIgc21zTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbXMtbGluaycpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3QtbWV0aG9kcycpLnJlbW92ZUNoaWxkKHNtc0xpbmspO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzaG93ZXIoY2FudmFzLCBjTCkge1xuICAgIHZhciBzbWFsbCA9IChwcm9iUGhvbmUpPyAuNiA6IDEsXG4gICAgICByTiA9ICgoTWF0aC5yYW5kb20oKS8yKSAqIHNtYWxsICkgKyAuNSxcbiAgICAgIHJvdGF0ZSA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMiAqIDI1LFxuICAgICAgcyA9ICBNYXRoLnJhbmRvbSgpICogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY0wpICsgMSxcbiAgICAgIGRlbGF5ID0gTWF0aC5yYW5kb20oKSAqIDQwMDAgKiBzLFxuICAgICAgeCA9IChzY3JlZW4ud2lkdGggLSAxMDApICogTWF0aC5yYW5kb20oKSxcbiAgICAgIHkgPSAoc2NyZWVuLmhlaWdodCAtIDEwMCkgKiBNYXRoLnJhbmRvbSgpLFxuICAgICAgdHJhbnNmb3JtID0gJyB0cmFuc2xhdGUoJysgeCArJ3B4LCAnICsgeSArICdweCkgc2NhbGUoJyArIHJOICsgJykgcm90YXRlKCcgKyByb3RhdGUgKyAnZGVnKSc7XG4gIFxuXG5cbiAgICBjb25zb2xlLmluZm8oc2NyZWVuLmhlaWdodCk7XG4gICAgY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICBkcmF3KGNhbnZhcyk7XG4gICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzaG93ZXIoY2FudmFzLCBjTCk7IH0sIGRlbGF5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXcoY2FudmFzKSB7XG4gICAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKSc7XG4gICAgICBjdHgubGluZVdpZHRoID0gLjg7XG4gICAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG5cbiAgICAgIHZhciB0YWlsVyA9IGNhbnZhcy53aWR0aCxcbiAgICAgICAgdGFpbEggPSBjYW52YXMuaGVpZ2h0LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgcyA9IHRhaWxXIC8gdGFpbEgsXG4gICAgICAgIGNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0YWlsVywgdGFpbEgpO1xuICAgICAgICB9LFxuICAgICAgICB0YWlsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2xlYXIoKTtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4Lm1vdmVUbyhpICogcywgaSk7XG4gICAgICAgICAgY3R4LmxpbmVUbyh0YWlsVywgdGFpbEgpO1xuICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICBpZiAoaSA8IHRhaWxIKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRhaWwsIDApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpKys7XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGVvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhcigpO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgICAgICAgIGN0eC5saW5lVG8oaSAqIHMsIGkpO1xuICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICBpZiAoaSA8IHRhaWxIKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KG1ldGVvciwgMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAuNzU7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAuOCknO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgIC8vIHNldFRpbWVvdXQodGFpbCwgMTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaSsrO1xuXG4gICAgICAgIH07XG5cbiAgICAgIG1ldGVvcigpO1xuICAgIFxuICAgIH1cbiAgfSJdLCJmaWxlIjoiaW5pdC5qcyJ9
