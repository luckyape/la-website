/* global  Materialize,jQuery, $ */

var $navbar = $navbar || $('#la-navbar-flex');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCAgTWF0ZXJpYWxpemUsalF1ZXJ5LCAkICovXG5cbnZhciAkbmF2YmFyID0gJG5hdmJhciB8fCAkKCcjbGEtbmF2YmFyLWZsZXgnKTtcbnZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG5cbihmdW5jdGlvbigkKSB7XG4gICQoZnVuY3Rpb24oKSB7XG4gICAgJCgnLmJ1dHRvbi1jb2xsYXBzZScpLnNpZGVOYXYoe1xuICAgICAgb25PcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBNYXRlcmlhbGl6ZS5zaG93U3RhZ2dlcmVkTGlzdCgnI25hdi1tb2JpbGUnKTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgICAkY29udFdyYXAuYWRkQ2xhc3MoJ2xhLWJsdXInKTtcbiAgICAgIH0sXG4gICAgICBvbkNsb3NlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAkKCdsaScsIGVsKS5jc3Moe1xuICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgfSk7XG4gICAgICAgICRjb250V3JhcC5yZW1vdmVDbGFzcygnbGEtYmx1cicpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGVuZCBvZiBkb2N1bWVudCByZWFkeVxuICB9KTtcbn0pKGpRdWVyeSk7XG4vLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcbiJdLCJmaWxlIjoiaW5pdC5qcyJ9
