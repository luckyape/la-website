/* global document, navigator, async, window, $ */
var laViewer = function(options) { // eslint-disable-line no-unused-vars
  var settings = {
    gridId: 'viewer-cards',
    counterId: 'viewer-counter',
    cardClass: '.viewer-item',
    viewerFilterChipsId: 'viewer-filter-chips',
    filterChipsId: 'viewer-filter-chips',
    cardChipClass: '.card-action .chip',
    materializeChips: true,
    chipOptions: {
      placeholder: '...',
      secondaryPlaceholder: '...',
      autocompleteOptions: {
        limit: Infinity,
        minLength: 1
      }
    },
    flickity: {
      cellSelector: '.flickity-item',
      wrapAround: true,
      selectedAttraction: 0.2,
      friction: 0.8,
      resize: true,
      pageDots: false,
      cellAlign: 'center'
    },
    isotope: {
      layoutMode: 'packery',
      packery: {
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer'
      },
      itemSelector: '.grid-item',
      percentPosition: true,
      resize: true
    }
  };
  $.extend(settings, options);
  var grid = document.getElementById(settings.gridId);
  var counter = document.getElementById(settings.counterId);
  var cards = grid.querySelectorAll(settings.cardClass);
  var viewerFilterChips = document.getElementById(settings.viewerFilterChipsId);
  var $chips = $(viewerFilterChips);
  var probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) && 'ontouchstart' in document.documentElement);
  var filters = {
    chips: []
  };
  var getChips = function() {
    var filterChips = Array.prototype.slice.call(viewerFilterChips.querySelectorAll('.chip')).map(function(c) {
      return c.firstChild.textContent;
    });
    return filterChips;
  };
  var isotopeInit = function() {
    var $grid = $(grid);
    var isotopeSettings = settings.isotope;

    var chipFilter = function() {
      var keywords = this.getAttribute('data-keywords').split(',');
      var isMatched = true;
      if (filters.selected) {
        isMatched = keywords.indexOf(filters.selected) > -1;
      } else {
        filters.chips = getChips();

        for (var i = 0; i < filters.chips.length; i++) {
          if (keywords.indexOf(filters.chips[i]) > -1) {
            return true;
          }
        }
        return false;
      }
      return isMatched;
    };
    isotopeSettings.filter = chipFilter;

    $grid.isotope(isotopeSettings);

    $('img', cards).each(function(i, obj) {
      $('<img/>')
        .attr('src', obj.src)
        .load(function() {
          $(this).remove();
          $grid.isotope();
        });
    });
    for (var i = 0, l = cards.length; i < l; i++) {
      cards[i].classList.remove('hide-item');
    }
  };

  var flickityInit = function() {
    var $grid = $(grid);
    var flickityExists = $grid.data('flickity');
    counter.classList.remove('thud');
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        counter.classList.add('thud');
      });
    });

    for (var m = 0, ml = cards.length; m < ml; m++) {
      var flickityCard = cards[m];
      var keywords = flickityCard.getAttribute('data-keywords').split(',');
      flickityCard.classList.remove('flickity-item');
      flickityCard.classList.add('hide-item');
      if (filters.selected) {
        if (flickityCard.getAttribute('data-keywords').indexOf(filters.selected) > -1) {
          flickityCard.classList.add('flickity-item');
        }
      } else {
        filters.chips = filters.chips = getChips();
        for (var j = 0, fL = filters.chips.length; j < fL; j++) {
          if (keywords.indexOf(filters.chips[j]) > -1) {
            flickityCard.classList.add('flickity-item');
          }
        }
      }
    }
    if (flickityExists) {
      $grid.flickity('destroy');
    }

    var $carousel = $grid.flickity(settings.flickity);
    for (var i = 0, l = cards.length; i < l; i++) {
      var card = cards[i];
      if (card.classList.contains('flickity-item')) {
        card.classList.remove('hide-item');
      }
    }
    var flkty = $carousel.data('flickity');
    var updateStatus = function() {
      var slideNumber = flkty.selectedIndex + 1;
      counter.innerHTML = slideNumber + '/' + flkty.slides.length;
    };
    $carousel.on('select.flickity', updateStatus);
    updateStatus();
  };
  var initViewer = function() {
    var $grid = $(grid);
    var $overlay = $('#la-viewer-overlay');

    if (probPhone) {
      if (grid.isotope) {
        $grid.isotope('destroy');
      }
      if (!$grid.flickity) {
        async(['https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js'], flickityInit);
        async(['https://cdn.jsdelivr.net/npm/jquery.panzoom@3.2.2/dist/jquery.panzoom.min.js']);
      } else if ($grid.flickity) {
        setTimeout(flickityInit, 100);
      }
    } else {
      if ($grid.flickity) {
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

    $('[data-lg-image]', $grid).click(openLightbox);

    $overlay.click(closeLightBox);

    function openLightbox() {
      var imgUrl = this.getAttribute('data-lg-image');
      var showLoader = setTimeout(function() {
        $('.loader-container').fadeIn('slow');
      }, 300);

      $('<img/>')
        .attr('src', imgUrl)
        .load(function() {
          clearTimeout(showLoader);
          $('.loader-container').hide();
          $('.img-container .image', $overlay).html(this);
          $('.img-container', $overlay).fadeIn();
          if ($('.img-container', $overlay).panzoom) {
            $('.img-container', $overlay).panzoom({
              minScale: 1,
              panOnlyWhenZoomed: true
            });
            $('.panzoom .close', $overlay).on('touchstart', function(e) {
              e.stopImmediatePropagation();
            });
          }
        });
      $overlay.fadeIn('fast');
    }

    function closeLightBox() {
      $('.img-container .image', $overlay).html('');
      $('.img-container', $overlay).hide();
      $overlay.fadeOut('fast');
      if ($('.img-container', $overlay).panzoom) {
        $('.img-container', $overlay).panzoom('reset');
      }
    }
  };
  var initPlugin = function() {
    if (probPhone) {
      flickityInit();
    } else if (!probPhone) {
      $(grid).isotope();
    }
  };
  var initMaterializeChips = function($chips) {
    var filterChips = [];
    var chipsArr = [];
    var autoCompleteData = {};
    var cL = cards.length;

    for (var k = 0; k < cL; k++) {
      var cardChips = cards[k].getAttribute('data-keywords').split(',');
      var first = cardChips[0].trim().replace(/\s+/g, '-').toLowerCase();
      filterChips.push({
        tag: first,
        id: first
      });
      chipsArr = chipsArr.concat(cardChips);
    }

    var cl = chipsArr.length;
    for (var i = 0; i < cl; i++) {
      var item = chipsArr[i];
      if (!autoCompleteData[item]) {
        autoCompleteData[item] = null;
      }
    }
    var chipOptions = settings.chipOptions;
    chipOptions.data = filterChips;
    chipOptions.autocompleteOptions.data = autoCompleteData;
    $chips.material_chip(chipOptions);
    $('input', $chips).focus();

    $chips.on('click', function() {
      if (filters.selected) {
        filters.selected = null;
        initPlugin();
      }
    });
    $chips.on('chip.select', function(e, chip) {
      filters.selected = chip.tag;
      initPlugin();
    });

    $chips.on('chip.add', initPlugin);
    $chips.on('chip.delete', function(chip) {
      if (filters.selected === chip.tag) {
        filters.selected = null;
      }
      initPlugin();
    });
  };
  var initChips = function($chips) {
    if (settings.materializeChips) {
      initMaterializeChips($chips);
    } else {
      $('.chip', $chips).on('click', function() {
        var tag = this.innerText;
        console.info(tag, this);
        if (filters.selected === tag) {
          filters.selected = null;
          $(this).removeClass('selected');
        } else {
          $('.chip', $chips).removeClass('selected');
          $(this).addClass('selected');
          filters.selected = tag;
        }
        initPlugin();
      });
    }

    return $chips;
  };
  var init = function() {
    $chips = initChips($chips);
    $('.toggle-filter a').click(toggleFilter);
    initViewer();
    function toggleFilter() {
      var sheet = document.createElement('style');
      var filterHeight = $chips.height();
      sheet.innerHTML = '.filter-on.viewer-filter { min-height: ' + (filterHeight + 30) + 'px; will-change: min-height;}';
      document.body.appendChild(sheet);
      var filterToggles = document.querySelectorAll('.tap-target-row,.viewer-filter,.toggle-filter');
      for (var i = 0, l = filterToggles.length; i < l; i++) {
        filterToggles[i].classList.toggle('filter-on');
      }
    }
  };

  init();
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYS12aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIGRvY3VtZW50LCBuYXZpZ2F0b3IsIGFzeW5jLCB3aW5kb3csICQgKi9cbnZhciBsYVZpZXdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgZ3JpZElkOiAndmlld2VyLWNhcmRzJyxcbiAgICBjb3VudGVySWQ6ICd2aWV3ZXItY291bnRlcicsXG4gICAgY2FyZENsYXNzOiAnLnZpZXdlci1pdGVtJyxcbiAgICB2aWV3ZXJGaWx0ZXJDaGlwc0lkOiAndmlld2VyLWZpbHRlci1jaGlwcycsXG4gICAgZmlsdGVyQ2hpcHNJZDogJ3ZpZXdlci1maWx0ZXItY2hpcHMnLFxuICAgIGNhcmRDaGlwQ2xhc3M6ICcuY2FyZC1hY3Rpb24gLmNoaXAnLFxuICAgIG1hdGVyaWFsaXplQ2hpcHM6IHRydWUsXG4gICAgY2hpcE9wdGlvbnM6IHtcbiAgICAgIHBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIHNlY29uZGFyeVBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIGF1dG9jb21wbGV0ZU9wdGlvbnM6IHtcbiAgICAgICAgbGltaXQ6IEluZmluaXR5LFxuICAgICAgICBtaW5MZW5ndGg6IDFcbiAgICAgIH1cbiAgICB9LFxuICAgIGZsaWNraXR5OiB7XG4gICAgICBjZWxsU2VsZWN0b3I6ICcuZmxpY2tpdHktaXRlbScsXG4gICAgICB3cmFwQXJvdW5kOiB0cnVlLFxuICAgICAgc2VsZWN0ZWRBdHRyYWN0aW9uOiAwLjIsXG4gICAgICBmcmljdGlvbjogMC44LFxuICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgcGFnZURvdHM6IGZhbHNlLFxuICAgICAgY2VsbEFsaWduOiAnY2VudGVyJ1xuICAgIH0sXG4gICAgaXNvdG9wZToge1xuICAgICAgbGF5b3V0TW9kZTogJ3BhY2tlcnknLFxuICAgICAgcGFja2VyeToge1xuICAgICAgICBjb2x1bW5XaWR0aDogJy5ncmlkLXNpemVyJyxcbiAgICAgICAgZ3V0dGVyOiAnLmd1dHRlci1zaXplcidcbiAgICAgIH0sXG4gICAgICBpdGVtU2VsZWN0b3I6ICcuZ3JpZC1pdGVtJyxcbiAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcbiAgICAgIHJlc2l6ZTogdHJ1ZVxuICAgIH1cbiAgfTtcbiAgJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpO1xuICB2YXIgZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLmdyaWRJZCk7XG4gIHZhciBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZ3MuY291bnRlcklkKTtcbiAgdmFyIGNhcmRzID0gZ3JpZC5xdWVyeVNlbGVjdG9yQWxsKHNldHRpbmdzLmNhcmRDbGFzcyk7XG4gIHZhciB2aWV3ZXJGaWx0ZXJDaGlwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLnZpZXdlckZpbHRlckNoaXBzSWQpO1xuICB2YXIgJGNoaXBzID0gJCh2aWV3ZXJGaWx0ZXJDaGlwcyk7XG4gIHZhciBwcm9iUGhvbmUgPSAoKC9pcGhvbmV8YW5kcm9pZHxpZXxibGFja2JlcnJ5fGZlbm5lYy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICB2YXIgZmlsdGVycyA9IHtcbiAgICBjaGlwczogW11cbiAgfTtcbiAgdmFyIGdldENoaXBzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlckNoaXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmlld2VyRmlsdGVyQ2hpcHMucXVlcnlTZWxlY3RvckFsbCgnLmNoaXAnKSkubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgIHJldHVybiBjLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlckNoaXBzO1xuICB9O1xuICB2YXIgaXNvdG9wZUluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciBpc290b3BlU2V0dGluZ3MgPSBzZXR0aW5ncy5pc290b3BlO1xuXG4gICAgdmFyIGNoaXBGaWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkcyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQpIHtcbiAgICAgICAgaXNNYXRjaGVkID0ga2V5d29yZHMuaW5kZXhPZihmaWx0ZXJzLnNlbGVjdGVkKSA+IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsdGVycy5jaGlwcyA9IGdldENoaXBzKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXJzLmNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGtleXdvcmRzLmluZGV4T2YoZmlsdGVycy5jaGlwc1tpXSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpc01hdGNoZWQ7XG4gICAgfTtcbiAgICBpc290b3BlU2V0dGluZ3MuZmlsdGVyID0gY2hpcEZpbHRlcjtcblxuICAgICRncmlkLmlzb3RvcGUoaXNvdG9wZVNldHRpbmdzKTtcblxuICAgICQoJ2ltZycsIGNhcmRzKS5lYWNoKGZ1bmN0aW9uKGksIG9iaikge1xuICAgICAgJCgnPGltZy8+JylcbiAgICAgICAgLmF0dHIoJ3NyYycsIG9iai5zcmMpXG4gICAgICAgIC5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgICAgJGdyaWQuaXNvdG9wZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNhcmRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY2FyZHNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS1pdGVtJyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBmbGlja2l0eUluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciBmbGlja2l0eUV4aXN0cyA9ICRncmlkLmRhdGEoJ2ZsaWNraXR5Jyk7XG4gICAgY291bnRlci5jbGFzc0xpc3QucmVtb3ZlKCd0aHVkJyk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvdW50ZXIuY2xhc3NMaXN0LmFkZCgndGh1ZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBtID0gMCwgbWwgPSBjYXJkcy5sZW5ndGg7IG0gPCBtbDsgbSsrKSB7XG4gICAgICB2YXIgZmxpY2tpdHlDYXJkID0gY2FyZHNbbV07XG4gICAgICB2YXIga2V5d29yZHMgPSBmbGlja2l0eUNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LmFkZCgnaGlkZS1pdGVtJyk7XG4gICAgICBpZiAoZmlsdGVycy5zZWxlY3RlZCkge1xuICAgICAgICBpZiAoZmxpY2tpdHlDYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXl3b3JkcycpLmluZGV4T2YoZmlsdGVycy5zZWxlY3RlZCkgPiAtMSkge1xuICAgICAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMuY2hpcHMgPSBmaWx0ZXJzLmNoaXBzID0gZ2V0Q2hpcHMoKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGZMID0gZmlsdGVycy5jaGlwcy5sZW5ndGg7IGogPCBmTDsgaisrKSB7XG4gICAgICAgICAgaWYgKGtleXdvcmRzLmluZGV4T2YoZmlsdGVycy5jaGlwc1tqXSkgPiAtMSkge1xuICAgICAgICAgICAgZmxpY2tpdHlDYXJkLmNsYXNzTGlzdC5hZGQoJ2ZsaWNraXR5LWl0ZW0nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsaWNraXR5RXhpc3RzKSB7XG4gICAgICAkZ3JpZC5mbGlja2l0eSgnZGVzdHJveScpO1xuICAgIH1cblxuICAgIHZhciAkY2Fyb3VzZWwgPSAkZ3JpZC5mbGlja2l0eShzZXR0aW5ncy5mbGlja2l0eSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYXJkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBjYXJkID0gY2FyZHNbaV07XG4gICAgICBpZiAoY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZsaWNraXR5LWl0ZW0nKSkge1xuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtaXRlbScpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZmxrdHkgPSAkY2Fyb3VzZWwuZGF0YSgnZmxpY2tpdHknKTtcbiAgICB2YXIgdXBkYXRlU3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2xpZGVOdW1iZXIgPSBmbGt0eS5zZWxlY3RlZEluZGV4ICsgMTtcbiAgICAgIGNvdW50ZXIuaW5uZXJIVE1MID0gc2xpZGVOdW1iZXIgKyAnLycgKyBmbGt0eS5zbGlkZXMubGVuZ3RoO1xuICAgIH07XG4gICAgJGNhcm91c2VsLm9uKCdzZWxlY3QuZmxpY2tpdHknLCB1cGRhdGVTdGF0dXMpO1xuICAgIHVwZGF0ZVN0YXR1cygpO1xuICB9O1xuICB2YXIgaW5pdFZpZXdlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkZ3JpZCA9ICQoZ3JpZCk7XG4gICAgdmFyICRvdmVybGF5ID0gJCgnI2xhLXZpZXdlci1vdmVybGF5Jyk7XG5cbiAgICBpZiAocHJvYlBob25lKSB7XG4gICAgICBpZiAoZ3JpZC5pc290b3BlKSB7XG4gICAgICAgICRncmlkLmlzb3RvcGUoJ2Rlc3Ryb3knKTtcbiAgICAgIH1cbiAgICAgIGlmICghJGdyaWQuZmxpY2tpdHkpIHtcbiAgICAgICAgYXN5bmMoWydodHRwczovL3VucGtnLmNvbS9mbGlja2l0eUAyL2Rpc3QvZmxpY2tpdHkucGtnZC5taW4uanMnXSwgZmxpY2tpdHlJbml0KTtcbiAgICAgICAgYXN5bmMoWydodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2pxdWVyeS5wYW56b29tQDMuMi4yL2Rpc3QvanF1ZXJ5LnBhbnpvb20ubWluLmpzJ10pO1xuICAgICAgfSBlbHNlIGlmICgkZ3JpZC5mbGlja2l0eSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZsaWNraXR5SW5pdCwgMTAwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCRncmlkLmZsaWNraXR5KSB7XG4gICAgICAgICRncmlkLmZsaWNraXR5KCdkZXN0cm95Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghJGdyaWQuaXNvdG9wZSkge1xuICAgICAgICBhc3luYyhbJ2h0dHBzOi8vdW5wa2cuY29tL2lzb3RvcGUtbGF5b3V0QDMvZGlzdC9pc290b3BlLnBrZ2QubWluLmpzJ10sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFzeW5jKFsnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9pc290b3BlLXBhY2tlcnlAMi4wLjAvcGFja2VyeS1tb2RlLnBrZ2QubWluLmpzJ10sIGlzb3RvcGVJbml0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKCRncmlkLmlzb3RvcGUpIHtcbiAgICAgICAgc2V0VGltZW91dChpc290b3BlSW5pdCwgMTAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkKCdbZGF0YS1sZy1pbWFnZV0nLCAkZ3JpZCkuY2xpY2sob3BlbkxpZ2h0Ym94KTtcblxuICAgICRvdmVybGF5LmNsaWNrKGNsb3NlTGlnaHRCb3gpO1xuXG4gICAgZnVuY3Rpb24gb3BlbkxpZ2h0Ym94KCkge1xuICAgICAgdmFyIGltZ1VybCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWxnLWltYWdlJyk7XG4gICAgICB2YXIgc2hvd0xvYWRlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5sb2FkZXItY29udGFpbmVyJykuZmFkZUluKCdzbG93Jyk7XG4gICAgICB9LCAzMDApO1xuXG4gICAgICAkKCc8aW1nLz4nKVxuICAgICAgICAuYXR0cignc3JjJywgaW1nVXJsKVxuICAgICAgICAubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoc2hvd0xvYWRlcik7XG4gICAgICAgICAgJCgnLmxvYWRlci1jb250YWluZXInKS5oaWRlKCk7XG4gICAgICAgICAgJCgnLmltZy1jb250YWluZXIgLmltYWdlJywgJG92ZXJsYXkpLmh0bWwodGhpcyk7XG4gICAgICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkuZmFkZUluKCk7XG4gICAgICAgICAgaWYgKCQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLnBhbnpvb20pIHtcbiAgICAgICAgICAgICQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLnBhbnpvb20oe1xuICAgICAgICAgICAgICBtaW5TY2FsZTogMSxcbiAgICAgICAgICAgICAgcGFuT25seVdoZW5ab29tZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnBhbnpvb20gLmNsb3NlJywgJG92ZXJsYXkpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICRvdmVybGF5LmZhZGVJbignZmFzdCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlTGlnaHRCb3goKSB7XG4gICAgICAkKCcuaW1nLWNvbnRhaW5lciAuaW1hZ2UnLCAkb3ZlcmxheSkuaHRtbCgnJyk7XG4gICAgICAkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5oaWRlKCk7XG4gICAgICAkb3ZlcmxheS5mYWRlT3V0KCdmYXN0Jyk7XG4gICAgICBpZiAoJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkucGFuem9vbSkge1xuICAgICAgICAkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5wYW56b29tKCdyZXNldCcpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgdmFyIGluaXRQbHVnaW4gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocHJvYlBob25lKSB7XG4gICAgICBmbGlja2l0eUluaXQoKTtcbiAgICB9IGVsc2UgaWYgKCFwcm9iUGhvbmUpIHtcbiAgICAgICQoZ3JpZCkuaXNvdG9wZSgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGluaXRNYXRlcmlhbGl6ZUNoaXBzID0gZnVuY3Rpb24oJGNoaXBzKSB7XG4gICAgdmFyIGZpbHRlckNoaXBzID0gW107XG4gICAgdmFyIGNoaXBzQXJyID0gW107XG4gICAgdmFyIGF1dG9Db21wbGV0ZURhdGEgPSB7fTtcbiAgICB2YXIgY0wgPSBjYXJkcy5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBrID0gMDsgayA8IGNMOyBrKyspIHtcbiAgICAgIHZhciBjYXJkQ2hpcHMgPSBjYXJkc1trXS5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5d29yZHMnKS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIGZpcnN0ID0gY2FyZENoaXBzWzBdLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICctJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlckNoaXBzLnB1c2goe1xuICAgICAgICB0YWc6IGZpcnN0LFxuICAgICAgICBpZDogZmlyc3RcbiAgICAgIH0pO1xuICAgICAgY2hpcHNBcnIgPSBjaGlwc0Fyci5jb25jYXQoY2FyZENoaXBzKTtcbiAgICB9XG5cbiAgICB2YXIgY2wgPSBjaGlwc0Fyci5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGNoaXBzQXJyW2ldO1xuICAgICAgaWYgKCFhdXRvQ29tcGxldGVEYXRhW2l0ZW1dKSB7XG4gICAgICAgIGF1dG9Db21wbGV0ZURhdGFbaXRlbV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2hpcE9wdGlvbnMgPSBzZXR0aW5ncy5jaGlwT3B0aW9ucztcbiAgICBjaGlwT3B0aW9ucy5kYXRhID0gZmlsdGVyQ2hpcHM7XG4gICAgY2hpcE9wdGlvbnMuYXV0b2NvbXBsZXRlT3B0aW9ucy5kYXRhID0gYXV0b0NvbXBsZXRlRGF0YTtcbiAgICAkY2hpcHMubWF0ZXJpYWxfY2hpcChjaGlwT3B0aW9ucyk7XG4gICAgJCgnaW5wdXQnLCAkY2hpcHMpLmZvY3VzKCk7XG5cbiAgICAkY2hpcHMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoZmlsdGVycy5zZWxlY3RlZCkge1xuICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgaW5pdFBsdWdpbigpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICRjaGlwcy5vbignY2hpcC5zZWxlY3QnLCBmdW5jdGlvbihlLCBjaGlwKSB7XG4gICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gY2hpcC50YWc7XG4gICAgICBpbml0UGx1Z2luKCk7XG4gICAgfSk7XG5cbiAgICAkY2hpcHMub24oJ2NoaXAuYWRkJywgaW5pdFBsdWdpbik7XG4gICAgJGNoaXBzLm9uKCdjaGlwLmRlbGV0ZScsIGZ1bmN0aW9uKGNoaXApIHtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkID09PSBjaGlwLnRhZykge1xuICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGluaXRQbHVnaW4oKTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIGluaXRDaGlwcyA9IGZ1bmN0aW9uKCRjaGlwcykge1xuICAgIGlmIChzZXR0aW5ncy5tYXRlcmlhbGl6ZUNoaXBzKSB7XG4gICAgICBpbml0TWF0ZXJpYWxpemVDaGlwcygkY2hpcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuY2hpcCcsICRjaGlwcykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWcgPSB0aGlzLmlubmVyVGV4dDtcbiAgICAgICAgY29uc29sZS5pbmZvKHRhZywgdGhpcyk7XG4gICAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkID09PSB0YWcpIHtcbiAgICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoJy5jaGlwJywgJGNoaXBzKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSB0YWc7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdFBsdWdpbigpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRjaGlwcztcbiAgfTtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAkY2hpcHMgPSBpbml0Q2hpcHMoJGNoaXBzKTtcbiAgICAkKCcudG9nZ2xlLWZpbHRlciBhJykuY2xpY2sodG9nZ2xlRmlsdGVyKTtcbiAgICBpbml0Vmlld2VyKCk7XG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyKCkge1xuICAgICAgdmFyIHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHZhciBmaWx0ZXJIZWlnaHQgPSAkY2hpcHMuaGVpZ2h0KCk7XG4gICAgICBzaGVldC5pbm5lckhUTUwgPSAnLmZpbHRlci1vbi52aWV3ZXItZmlsdGVyIHsgbWluLWhlaWdodDogJyArIChmaWx0ZXJIZWlnaHQgKyAzMCkgKyAncHg7IHdpbGwtY2hhbmdlOiBtaW4taGVpZ2h0O30nO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzaGVldCk7XG4gICAgICB2YXIgZmlsdGVyVG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YXAtdGFyZ2V0LXJvdywudmlld2VyLWZpbHRlciwudG9nZ2xlLWZpbHRlcicpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaWx0ZXJUb2dnbGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBmaWx0ZXJUb2dnbGVzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlci1vbicpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpbml0KCk7XG59O1xuIl0sImZpbGUiOiJsYS12aWV3ZXIuanMifQ==
