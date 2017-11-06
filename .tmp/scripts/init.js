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
		})

	}); // end of document ready
})(jQuery); // end of jQuery name space
 
var  probPhone = (1||(/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) &&
	'ontouchstart' in document.documentElement);

function loadContactInfo() {
	var contactMethods = document.getElementById('contact-methods');
	contactMethods.innerHTML = atob('PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==');
  if (0&&!probPhone) {
	var smsLink = document.querySelector('.sms-link');
	document.querySelector('.contact-methods').removeChild(smsLink);
  };
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG5cblx0JChmdW5jdGlvbigpIHtcblxuXHRcdHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG5cblx0XHQkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG5cdFx0XHRvbk9wZW46IGZ1bmN0aW9uKGVsKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0TWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG5cdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0JGNvbnRXcmFwLmFkZENsYXNzKCdsYS1ibHVyJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25DbG9zZTogZnVuY3Rpb24oZWwpIHtcblx0XHRcdFx0JCgnbGknLCBlbCkuY3NzKHsgb3BhY2l0eTogMCB9KVxuXHRcdFx0XHQkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciAkbmF2YmFyID0gJCgnI2xhLW5hdmJhci1mbGV4Jyk7XG5cblx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblx0XHRcdGlmICh5X3Njcm9sbF9wb3MgPiAzNTAgJiYgISRuYXZiYXIuaGFzQ2xhc3MoJ25hdmJhci1maXhlZCcpKSB7XG5cdFx0XHRcdCRuYXZiYXIucmVtb3ZlQ2xhc3MoJ3JldmVhbCcpO1xuXHRcdFx0XHQkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcblx0XHRcdFx0fSwgMzAwKTtcblx0XHRcdH1cblx0XHRcdGlmICh5X3Njcm9sbF9wb3MgPCAyMCkge1xuXHRcdFx0XHQkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcblx0XHRcdFx0JG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXHR9KTsgLy8gZW5kIG9mIGRvY3VtZW50IHJlYWR5XG59KShqUXVlcnkpOyAvLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcbiBcbnZhciAgcHJvYlBob25lID0gKDF8fCgvaXBob25lfGFuZHJvaWR8aWV8YmxhY2tiZXJyeXxmZW5uZWMvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSkgJiZcblx0J29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblxuZnVuY3Rpb24gbG9hZENvbnRhY3RJbmZvKCkge1xuXHR2YXIgY29udGFjdE1ldGhvZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1tZXRob2RzJyk7XG5cdGNvbnRhY3RNZXRob2RzLmlubmVySFRNTCA9IGF0b2IoJ1BHRWdhSEpsWmowaWMyMXpPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWMyMXpMV3hwYm1zZ2FXTnZiaUJwWTI5dUxXTm9ZWFFnYVdOdmJpMWphR0YwTFdScGJYTWlQbE5OVXp4a2FYWStOakEwTFRNME1DMDNPVEkxUEM5a2FYWStQQzloUGp4aElHaHlaV1k5SW0xaGFXeDBienBwYm1adlFHeDFZMnQ1WVhCbExtTnZiVDl6ZFdKcVpXTjBQU1UxUWxkWFZ5VXlNRWx1Y1hWcGNtVWxOVVFpSUdOc1lYTnpQU0pwWTI5dUlHbGpiMjR0Wlc1MlpXeHZjR1VnYVdOdmJpMWxiblpsYkc5d1pTMWthVzF6SWo1RmJXRnBiRHhrYVhZK2FXNW1iMEJzZFdOcmVXRndaUzVqYjIwOEwyUnBkajQ4TDJFK1BHRWdhSEpsWmowaWRHVnNPakV0TmpBMExUTTBNQzAzT1RJMUlpQmpiR0Z6Y3owaWFXTnZiaUJwWTI5dUxYQm9iMjVsTFdOaGJHd2dhV052Ymkxd2FHOXVaUzFqWVd4c0xXUnBiWE1pUGxSbGJEeGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBnPT0nKTtcbiAgaWYgKDAmJiFwcm9iUGhvbmUpIHtcblx0dmFyIHNtc0xpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc21zLWxpbmsnKTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3QtbWV0aG9kcycpLnJlbW92ZUNoaWxkKHNtc0xpbmspO1xuICB9O1xufSJdLCJmaWxlIjoiaW5pdC5qcyJ9
