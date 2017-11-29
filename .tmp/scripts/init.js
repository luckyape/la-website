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
        $('li', el).css({ opacity: 0 })
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
    setTimeout(draw, 2000);

  }); // end of document ready
})(jQuery); // end of jQuery name space

var probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) &&
  'ontouchstart' in document.documentElement);

function loadContactInfo() {
  var contactMethods = document.getElementById('contact-methods');
  contactMethods.innerHTML = atob('PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==');
  if (0 && !probPhone) {
    var smsLink = document.querySelector('.sms-link');
    document.querySelector('.contact-methods').removeChild(smsLink);
  };
}

function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = .3;
    ctx.lineCap = 'round';


    var tailW = canvas.width,
      tailH = canvas.height,
      i = 0,
      s = tailW / tailH;


    var head = function() {
    
      ctx.clearRect(0, 0, tailW, tailH);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(i * s, i);
      ctx.stroke();
      if (i < tailH) {
        setTimeout(head, 0);
      }
      else {
        ctx.lineWidth = .75;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        setTimeout(tail, 200);
      }
      i++;
    }
    i = 0;
    var tail = function() {
      
      ctx.clearRect(0, 0, tailW, tailH);
      ctx.beginPath();
      ctx.moveTo(i * s, i);
      ctx.lineTo(tailW, tailH);
      ctx.stroke();
      if (i < tailH) {
        setTimeout(tail, 5);
      }
      i++;
    }
    head();


  }

}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG5cbiAgJChmdW5jdGlvbigpIHtcblxuICAgIHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG5cbiAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICBvbk9wZW46IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgTWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG4gICAgICAgIH0sIDUwKTtcbiAgICAgICAgJGNvbnRXcmFwLmFkZENsYXNzKCdsYS1ibHVyJyk7XG4gICAgICB9LFxuICAgICAgb25DbG9zZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgJCgnbGknLCBlbCkuY3NzKHsgb3BhY2l0eTogMCB9KVxuICAgICAgICAkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciAkbmF2YmFyID0gJCgnI2xhLW5hdmJhci1mbGV4Jyk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIGlmICh5X3Njcm9sbF9wb3MgPiAzNTAgJiYgISRuYXZiYXIuaGFzQ2xhc3MoJ25hdmJhci1maXhlZCcpKSB7XG4gICAgICAgICRuYXZiYXIucmVtb3ZlQ2xhc3MoJ3JldmVhbCcpO1xuICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH1cbiAgICAgIGlmICh5X3Njcm9sbF9wb3MgPCAyMCkge1xuICAgICAgICAkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcbiAgICAgICAgJG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc2V0VGltZW91dChkcmF3LCAyMDAwKTtcblxuICB9KTsgLy8gZW5kIG9mIGRvY3VtZW50IHJlYWR5XG59KShqUXVlcnkpOyAvLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcblxudmFyIHByb2JQaG9uZSA9ICgoL2lwaG9uZXxhbmRyb2lkfGllfGJsYWNrYmVycnl8ZmVubmVjLykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmXG4gICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5cbmZ1bmN0aW9uIGxvYWRDb250YWN0SW5mbygpIHtcbiAgdmFyIGNvbnRhY3RNZXRob2RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbWV0aG9kcycpO1xuICBjb250YWN0TWV0aG9kcy5pbm5lckhUTUwgPSBhdG9iKCdQR0VnYUhKbFpqMGljMjF6T2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGljMjF6TFd4cGJtc2dhV052YmlCcFkyOXVMV05vWVhRZ2FXTnZiaTFqYUdGMExXUnBiWE1pUGxOTlV6eGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBqeGhJR2h5WldZOUltMWhhV3gwYnpwcGJtWnZRR3gxWTJ0NVlYQmxMbU52YlQ5emRXSnFaV04wUFNVMVFsZFhWeVV5TUVsdWNYVnBjbVVsTlVRaUlHTnNZWE56UFNKcFkyOXVJR2xqYjI0dFpXNTJaV3h2Y0dVZ2FXTnZiaTFsYm5abGJHOXdaUzFrYVcxeklqNUZiV0ZwYkR4a2FYWSthVzVtYjBCc2RXTnJlV0Z3WlM1amIyMDhMMlJwZGo0OEwyRStQR0VnYUhKbFpqMGlkR1ZzT2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGlhV052YmlCcFkyOXVMWEJvYjI1bExXTmhiR3dnYVdOdmJpMXdhRzl1WlMxallXeHNMV1JwYlhNaVBsUmxiRHhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQZz09Jyk7XG4gIGlmICgwICYmICFwcm9iUGhvbmUpIHtcbiAgICB2YXIgc21zTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbXMtbGluaycpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0LW1ldGhvZHMnKS5yZW1vdmVDaGlsZChzbXNMaW5rKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgaWYgKGNhbnZhcy5nZXRDb250ZXh0KSB7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJztcbiAgICBjdHgubGluZVdpZHRoID0gLjM7XG4gICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xuXG5cbiAgICB2YXIgdGFpbFcgPSBjYW52YXMud2lkdGgsXG4gICAgICB0YWlsSCA9IGNhbnZhcy5oZWlnaHQsXG4gICAgICBpID0gMCxcbiAgICAgIHMgPSB0YWlsVyAvIHRhaWxIO1xuXG5cbiAgICB2YXIgaGVhZCA9IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0YWlsVywgdGFpbEgpO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygwLCAwKTtcbiAgICAgIGN0eC5saW5lVG8oaSAqIHMsIGkpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgaWYgKGkgPCB0YWlsSCkge1xuICAgICAgICBzZXRUaW1lb3V0KGhlYWQsIDApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAuNzU7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJztcbiAgICAgICAgc2V0VGltZW91dCh0YWlsLCAyMDApO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB2YXIgdGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgXG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRhaWxXLCB0YWlsSCk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKGkgKiBzLCBpKTtcbiAgICAgIGN0eC5saW5lVG8odGFpbFcsIHRhaWxIKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGlmIChpIDwgdGFpbEgpIHtcbiAgICAgICAgc2V0VGltZW91dCh0YWlsLCA1KTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgaGVhZCgpO1xuXG5cbiAgfVxuXG59XG4iXSwiZmlsZSI6ImluaXQuanMifQ==
