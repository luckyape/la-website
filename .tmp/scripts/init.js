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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCAgTWF0ZXJpYWxpemUsalF1ZXJ5LCAkICovXG52YXIgJGNvbnRXcmFwID0gJCgnI2xhLWNvbnRlbnQtd3JhcHBlcicpO1xuXG4oZnVuY3Rpb24oJCkge1xuICAkKGZ1bmN0aW9uKCkge1xuICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHtcbiAgICAgIG9uT3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgTWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG4gICAgICAgIH0sIDUwKTtcbiAgICAgICAgJGNvbnRXcmFwLmFkZENsYXNzKCdsYS1ibHVyJyk7XG4gICAgICB9LFxuICAgICAgb25DbG9zZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgJCgnbGknLCBlbCkuY3NzKHtcbiAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgIH0pO1xuICAgICAgICAkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBlbmQgb2YgZG9jdW1lbnQgcmVhZHlcbiAgfSk7XG59KShqUXVlcnkpO1xuLy8gZW5kIG9mIGpRdWVyeSBuYW1lIHNwYWNlXG4iXSwiZmlsZSI6ImluaXQuanMifQ==
