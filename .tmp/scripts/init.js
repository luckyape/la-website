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
		$('.parallax').parallax();



	}); // end of document ready
})(jQuery); // end of jQuery name space
 
var  probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) &&
	'ontouchstart' in document.documentElement);

function loadContactInfo() {
	var contactMethods = document.getElementById('contact-methods');
	contactMethods.innerHTML = atob('PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==');
  if (0&&!probPhone) {
	var smsLink = document.querySelector('.sms-link');
	document.querySelector('.contact-methods').removeChild(smsLink);
  };
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG5cblx0JChmdW5jdGlvbigpIHtcblxuXHRcdHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG5cblx0XHQkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG5cdFx0XHRvbk9wZW46IGZ1bmN0aW9uKGVsKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0TWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG5cdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0JGNvbnRXcmFwLmFkZENsYXNzKCdsYS1ibHVyJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25DbG9zZTogZnVuY3Rpb24oZWwpIHtcblx0XHRcdFx0JCgnbGknLCBlbCkuY3NzKHsgb3BhY2l0eTogMCB9KVxuXHRcdFx0XHQkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciAkbmF2YmFyID0gJCgnI2xhLW5hdmJhci1mbGV4Jyk7XG5cblx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHlfc2Nyb2xsX3BvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblx0XHRcdGlmICh5X3Njcm9sbF9wb3MgPiAzNTAgJiYgISRuYXZiYXIuaGFzQ2xhc3MoJ25hdmJhci1maXhlZCcpKSB7XG5cdFx0XHRcdCRuYXZiYXIucmVtb3ZlQ2xhc3MoJ3JldmVhbCcpO1xuXHRcdFx0XHQkbmF2YmFyLmFkZENsYXNzKCduYXZiYXItZml4ZWQnKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcblx0XHRcdFx0fSwgMzAwKTtcblx0XHRcdH1cblx0XHRcdGlmICh5X3Njcm9sbF9wb3MgPCAyMCkge1xuXHRcdFx0XHQkbmF2YmFyLnJlbW92ZUNsYXNzKCduYXZiYXItZml4ZWQnKTtcblx0XHRcdFx0JG5hdmJhci5hZGRDbGFzcygncmV2ZWFsJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCgnLnBhcmFsbGF4JykucGFyYWxsYXgoKTtcblxuXG5cblx0fSk7IC8vIGVuZCBvZiBkb2N1bWVudCByZWFkeVxufSkoalF1ZXJ5KTsgLy8gZW5kIG9mIGpRdWVyeSBuYW1lIHNwYWNlXG4gXG52YXIgIHByb2JQaG9uZSA9ICgoL2lwaG9uZXxhbmRyb2lkfGllfGJsYWNrYmVycnl8ZmVubmVjLykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmXG5cdCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5cbmZ1bmN0aW9uIGxvYWRDb250YWN0SW5mbygpIHtcblx0dmFyIGNvbnRhY3RNZXRob2RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtbWV0aG9kcycpO1xuXHRjb250YWN0TWV0aG9kcy5pbm5lckhUTUwgPSBhdG9iKCdQR0VnYUhKbFpqMGljMjF6T2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGljMjF6TFd4cGJtc2dhV052YmlCcFkyOXVMV05vWVhRZ2FXTnZiaTFqYUdGMExXUnBiWE1pUGxOTlV6eGthWFkrTmpBMExUTTBNQzAzT1RJMVBDOWthWFkrUEM5aFBqeGhJR2h5WldZOUltMWhhV3gwYnpwcGJtWnZRR3gxWTJ0NVlYQmxMbU52YlQ5emRXSnFaV04wUFNVMVFsZFhWeVV5TUVsdWNYVnBjbVVsTlVRaUlHTnNZWE56UFNKcFkyOXVJR2xqYjI0dFpXNTJaV3h2Y0dVZ2FXTnZiaTFsYm5abGJHOXdaUzFrYVcxeklqNUZiV0ZwYkR4a2FYWSthVzVtYjBCc2RXTnJlV0Z3WlM1amIyMDhMMlJwZGo0OEwyRStQR0VnYUhKbFpqMGlkR1ZzT2pFdE5qQTBMVE0wTUMwM09USTFJaUJqYkdGemN6MGlhV052YmlCcFkyOXVMWEJvYjI1bExXTmhiR3dnYVdOdmJpMXdhRzl1WlMxallXeHNMV1JwYlhNaVBsUmxiRHhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQZz09Jyk7XG4gIGlmICgwJiYhcHJvYlBob25lKSB7XG5cdHZhciBzbXNMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNtcy1saW5rJyk7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0LW1ldGhvZHMnKS5yZW1vdmVDaGlsZChzbXNMaW5rKTtcbiAgfTtcbn0iXSwiZmlsZSI6ImluaXQuanMifQ==
