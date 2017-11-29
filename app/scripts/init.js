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
