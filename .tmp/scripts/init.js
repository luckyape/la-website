/* global  Materialize,jQuery, $ */
var $contWrap = $('#la-content-wrapper');

(function($) {
	$(function() {
		$('.button-collapse').sideNav({
			onOpen: function() {
				setTimeout(function() {
					Materialize.showStaggeredList('#nav-mobile');
				}, 50);
				$contWrap.addClass('la-blur');
			},
			onClose: function(el) {
				$('li', el).css({
					opacity: 0
				});
				$contWrap.removeClass('la-blur');
			}
		});
		// end of document ready
	});
})(jQuery);
// end of jQuery name space

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCAgTWF0ZXJpYWxpemUsalF1ZXJ5LCAkICovXG52YXIgJGNvbnRXcmFwID0gJCgnI2xhLWNvbnRlbnQtd3JhcHBlcicpO1xuXG4oZnVuY3Rpb24oJCkge1xuXHQkKGZ1bmN0aW9uKCkge1xuXHRcdCQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHtcblx0XHRcdG9uT3BlbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0TWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG5cdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0JGNvbnRXcmFwLmFkZENsYXNzKCdsYS1ibHVyJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25DbG9zZTogZnVuY3Rpb24oZWwpIHtcblx0XHRcdFx0JCgnbGknLCBlbCkuY3NzKHtcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBlbmQgb2YgZG9jdW1lbnQgcmVhZHlcblx0fSk7XG59KShqUXVlcnkpO1xuLy8gZW5kIG9mIGpRdWVyeSBuYW1lIHNwYWNlXG4iXSwiZmlsZSI6ImluaXQuanMifQ==
