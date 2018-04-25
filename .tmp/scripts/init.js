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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCAgTWF0ZXJpYWxpemUsalF1ZXJ5LCAkICovXG52YXIgJGNvbnRXcmFwID0gJCgnI2xhLWNvbnRlbnQtd3JhcHBlcicpO1xudmFyICRib2R5ID0gJCgnYm9keScpO1xuKGZ1bmN0aW9uKCQpIHtcbiAgJChmdW5jdGlvbigpIHtcbiAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICBvbk9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIE1hdGVyaWFsaXplLnNob3dTdGFnZ2VyZWRMaXN0KCcjbmF2LW1vYmlsZScpO1xuICAgICAgICB9LCA1MCk7XG4gICAgICAgICRjb250V3JhcC5hZGRDbGFzcygnbGEtYmx1cicpO1xuICAgICAgICAkYm9keS5hZGRDbGFzcygnc2lkZS1tZW51LWFjdGl2ZScpO1xuICAgICAgfSxcbiAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICQoJ2xpJywgZWwpLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICB9KTtcbiAgICAgICAgJGNvbnRXcmFwLnJlbW92ZUNsYXNzKCdsYS1ibHVyJyk7XG4gICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCdzaWRlLW1lbnUtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gZW5kIG9mIGRvY3VtZW50IHJlYWR5XG4gIH0pO1xufSkoalF1ZXJ5KTtcbi8vIGVuZCBvZiBqUXVlcnkgbmFtZSBzcGFjZVxuIl0sImZpbGUiOiJpbml0LmpzIn0=
