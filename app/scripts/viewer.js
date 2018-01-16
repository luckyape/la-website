(function($) {
  $(function() {
    var filters = {
      chips: []
    };
    var $grid = $('#viewer-cards');
    var $viewerCounter = $('#viewer-counter');
    var $chips = {};
    var chipsArr = [];
    var chipsObj = {};
    var $cards = $('.viewer-item', $grid);
    var flickityOpt = {
      cellSelector: '.flickity-item',
      wrapAround: true,
      selectedAttraction: 0.2,
      friction: 0.8,
      resize: true,
      pageDots: false,
      cellAlign: 'center'
    };

    /*
     *  Reveals viewer card
     */
    var revealCards = function() {
      $cards.removeClass('hide-item');
    };

    /*
     * initiates mobile horizonal scroll
     */
    var flickityInit = function() {
      if ($grid.flickity) {
        $grid.flickity('destroy');
        $cards.addClass('hide-item');
      }
      var $carousel = $grid.flickity(flickityOpt);
      $('.flickity-item', $grid).removeClass('hide-item');
      var flkty = $carousel.data('flickity');
      var updateStatus = function() {
        var slideNumber = flkty.selectedIndex + 1;
        $viewerCounter.text(slideNumber + '/' + flkty.slides.length);
      };
      $carousel.on('select.flickity', updateStatus);
      updateStatus();
    };

    var flickityFilter = function() {
      var chipFilter = function(index, obj) {
        var $item = $(obj);
        $item.removeClass('flickity-item');
        if (filters.selected) {
          if ($item.data('keywords').indexOf(filters.selected) > -1) {
            $item.addClass('flickity-item');
          }
        } else {
          filters.chips = $chips.material_chip('data').map(function(c) {
            return c.tag;
          });
          for (var i = 0; i < filters.chips.length; i++) {
            if ($item.data('keywords').indexOf(filters.chips[i]) > -1) {
              $item.addClass('flickity-item');
              break;
            }
          }
        }
      };
      $viewerCounter.removeClass('thud');
      window.requestAnimationFrame(function() {
        window.requestAnimationFrame(function() {
          $viewerCounter.addClass('thud');
        });
      });
      //  $grid.css('min-height', $grid.height());
      $cards
        .each(chipFilter)
        .promise()
        .done(flickityInit);
    };
    var whichPlugin = function() {
      if (probPhone) {
        flickityFilter();
      } else if (!probPhone) {
        $grid.isotope();
      }
    };
    var isotopeInit = function() {
      var chipFilter = function() {
        var isMatched = true;
        var $this = $(this);

        if (filters.selected) {
          isMatched = $this.data('keywords').indexOf(filters.selected) > -1;
        } else {
          filters.chips = $chips.material_chip('data').map(function(c) {
            return c.tag;
          });
          for (var i = 0; i < filters.chips.length; i++) {
            if ($this.data('keywords').indexOf(filters.chips[i]) > -1) {
              return true;
            }
          }
          return false;
        }
        return isMatched;
      };
      $grid.isotope({
        layoutMode: 'packery',
        packery: {
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer'
        },
        itemSelector: '.grid-item',
        percentPosition: true,
        resize: true,
        filter: chipFilter
      });
      $('img', $cards).each(function(i, obj) {
        $('<img/>')
          .attr('src', obj.src)
          .load(function() {
            $(this).remove();
            $grid.isotope();
          });
      });
      revealCards();
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
            async(['https://cdn.jsdelivr.net/npm/isotope-packery@2.0.0/packery-mode.pkgd.min.js'], isotopeInit);
          });
        } else if ($grid.isotope) {
          setTimeout(isotopeInit, 100);
        }
      }
    };

    var getChips = function(i, chip) {
      var chipText = $(chip).text().trim();
      if ($(chip).is(':first-child')) {
        chipsArr.push({
          tag: chipText,
          id: chipText.trim().replace(/\s+/g, '-').toLowerCase()
        });
      }
      if (chipsObj[chipText] !== null) {
        chipsObj[chipText] = null;
      }
    };
    var intiChips = function() {
      $chips = $('#viewer-chips');
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
          whichPlugin();
        }
      });
      $chips.on('chip.select', function(e, chip) {
        filters.selected = chip.tag;
        whichPlugin();
      });
      $chips.on('chip.add', whichPlugin);
      $chips.on('chip.delete', function(chip) {
        if (filters.selected === chip.tag) {
          filters.selected = null;
        }
        whichPlugin();
      });
    };

    $('.card-action .chip', $grid)
      .each(getChips)
      .promise()
      .done(intiChips, matchMedia);

    $('.info-spot').click(function() {
      $('.tap-target').tapTarget('open');
    });

    $('.toggle-filter a').click(function() {
      var sheet = document.createElement('style');
      sheet.innerHTML = '.filter-on.viewer-filter { min-height: ' + ($chips.height() + 30) + 'px; will-change: min-height;}';
      document.body.appendChild(sheet);
      $('.viewer-filter,.toggle-filter').toggleClass('filter-on');
    });
  });
  // end of document ready
})(jQuery);
// end of jQuery name space
