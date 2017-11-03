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
  
  }); // end of document ready
})(jQuery); // end of jQuery name space
