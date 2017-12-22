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
