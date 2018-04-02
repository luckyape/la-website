/* global laViewer, jQuery */
(function($) {
  $(function() {
    laViewer();
    $('.info-spot').click(function() {
      $('.tap-target').tapTarget('open');
    });
  });
})(jQuery);
