/* global jQuery,  window, async, probPhone */
(function($) {
  $(function() {
    var filters = {
      chips: []
    };
    var $grid = $('#viewerCards');
    var $chips = {};
    var chipsArr = [];
    var chipsObj = {};
    /* var testTouch = function() {
      var el = document.createElement('div');
      el.setAttribute('ontouchstart', 'return;');
      // or try "ontouchstart"
      return typeof el.ongesturestart === "function";
    }; */

    /*
     * initiates mobile horizonal scroll
     */
    var flickityInit = function() {
      $carousel = $($grid).flickity({
        cellSelector: '.grid-item',
        wrapAround: true,
        selectedAttraction: 0.2,
        friction: 0.8,
        resize: true,
        pageDots: false
      });
      $carousel.on('select.flickity', updateStatus);
    };
    var updateStatus = function () {
      var slideNumber = flkty.selectedIndex + 1;
      
      console.info(slideNumber + '/' + flkty.slides.length);
    }
    var isotopeInit = function() {
      $grid.isotope({
        layoutMode: 'packery',
        packery: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        },
        itemSelector: '.grid-item',
        percentPosition: true,
        resize: true,
        filter: function() {
          var isMatched = true;
          var $this = $(this);

          if (filters.selected) {
            isMatched = $($this[0]).hasClass(filters.selected);
          } else {
            filters.chips = $chips.material_chip('data').map(function(c) {
              return c.id;
            });
            for (var i = 0; i < filters.chips.length; i++) {
              if ($this[0].className.indexOf(filters.chips[i]) > -1) {
                return true;
              }
            }
            return false;
          }
          return isMatched;
        }
      });
    };
    var matchMedia = function() {
      if (probPhone) {
        if ($grid.hasClass('isotope')) {
          $grid.isotope('destroy');
        }
        if (!$grid.flickity) {
          async(['https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js'], flickityInit);
        } else if ($grid.flickity) {
          setTimeout(flickityInit, 100);
        }
      } else {
        if ($grid.hasClass('flickity-enabled')) {
          $grid.flickity('destroy');
        }

        if (!$grid.isotope) {
          async(['https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js'], function() {
            async(['https://cdn.jsdelivr.net/npm/isotope-packery@2.0.0/packery-mode.pkgd.js'], isotopeInit);
          });
        } else if ($grid.isotope) {
          setTimeout(isotopeInit, 100);
        }
      }
    };

    var getChips = function(i, chip) {
      var chipText = $(chip).text().trim();
      if (chipsObj[chipText] !== null) {
        chipsArr.push({
          tag: chipText,
          id: chipText.trim().replace(/\s+/g, '-').toLowerCase()
        });

        chipsObj[chipText] = null;
      }
    };
    var intiChips = function() {
      $chips = $('#viewerChips');
      $chips.material_chip({
        data: chipsArr,
        placeholder: '...',
        autocompleteOptions: {
          data: chipsObj,
          limit: Infinity,
          minLength: 1
        }
      });
      $('input', $chips).focus();

      $chips.on('click', function() {
        if (filters.selected) {
          filters.selected = null;
          $grid.isotope();
        }
        //  chipsObj[chip.tag] = (chipsObj[chip.tag])? true : null;
      });
      $chips.on('chip.select', function(e, chip) {
        // you have the added chip here
        filters.selected = chip.tag;
        $grid.isotope();
      });

      $chips.on('chip.add', function() {
        // you have the added chip here
        $grid.isotope();
      });
      $chips.on('chip.delete', function() {
        // you have the deleted chip here
        $grid.isotope();
      });
    };

    $(window).resize(matchMedia);
    matchMedia();

    $('.card-chips .chip, .card-action  .chip').each(getChips).promise().done(intiChips);

    $('.info-spot').click(function() {
      $('.tap-target').tapTarget('open');
    });

    $('.toggle-filter').click(function() {
      $('.products-filter,.toggle-filter').toggleClass('filter-on');
    });
  });
  // end of document ready
})(jQuery);
// end of jQuery name space
