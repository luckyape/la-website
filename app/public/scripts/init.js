/* global  Materialize,jQuery, $ */
var $contWrap = $('#la-content-wrapper');
var $body = $('body');
(function($) {
  $(function() {
    $('.button-collapse').sideNav({
      onOpen: function() {
        setTimeout(function() {
          Materialize.showStaggeredList('#nav-mobile');
        }, 50);
        $contWrap.addClass('la-blur');
        $body.addClass('side-menu-active');
      },
      onClose: function(el) {
        $('li', el).css({
          opacity: 0
        });
        $contWrap.removeClass('la-blur');
        $body.removeClass('side-menu-active');
      }
    });
    // end of document ready
  });
})(jQuery);
// end of jQuery name space
 