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
  var $filterChipsContainer = $(viewerFilterChips);
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
      var keywords = this.getAttribute('data-keywords').replace(/\,\s/g, ',').replace(/\s+/g, '-').split(',');
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
      var first = cardChips[0].trim().toLowerCase();
      if (filterChips.indexOf(first) === -1) {
        filterChips.push(first);
      }
      chipsArr = chipsArr.concat(cardChips);
    }

    var fCL = filterChips.length;
    var filterChipObjs = [];
    var i;
    var filterItem;
    for (i = 0; i < fCL; i++) {
      filterItem = filterChips[i];
      filterChipObjs.push({
        tag: filterItem,
        id: filterItem
      });
    }
    var cl = chipsArr.length;
    var chipItem;
    for (i = 0; i < cl; i++) {
      chipItem = chipsArr[i];
      if (!autoCompleteData[chipItem]) {
        autoCompleteData[chipItem] = null;
      }
    }
    var chipOptions = settings.chipOptions;
    chipOptions.data = filterChipObjs;
    chipOptions.autocompleteOptions.data = autoCompleteData;
    $filterChipsContainer.material_chip(chipOptions);

    var filterChipClick = function() {
      var eventEnds = $(this).hasClass('selected');
      $('.chip', $filterChipsContainer).removeClass('selected');
      $chips.removeClass('selected');
      if (filters.selected) {
        filters.selected = null;
        if (eventEnds) {
          initPlugin();
          return false;
        }
      }
    };

    $('input', $filterChipsContainer).focus();

    $('.chip', $filterChipsContainer).on('click', filterChipClick);

    $filterChipsContainer.on('chip.select', function(e, chip) {
      filters.selected = chip.tag;
      $chips
        .filter('[data-chip-text = ' + chip.tag + ']')
        .addClass('selected');
      initPlugin();
    });

    $filterChipsContainer.on('chip.add', initPlugin);
    $filterChipsContainer.on('chip.delete', function(chip) {
      if (filters.selected === chip.tag) {
        filters.selected = null;
      }
      initPlugin();
    });
    $chips.on('click', function() {
      var filterChips = $filterChipsContainer.children();
      var selectedCardChip = this.getAttribute('data-chip-text');
      var cL = filterChips.length;
      var filterTargetChip = null;
      $chips.removeClass('selected');
      for (var i = 0; i < cL; i++) {
        if (!filterChips[i].firstChild) {
          break;
        }
        if (filterChips[i].firstChild.textContent === selectedCardChip) {
          filterTargetChip = filterChips[i];
          $(filterTargetChip).on('click', filterChipClick);
          filterTargetChip.click();
          break;
        }
      }
      if (!filterTargetChip) {
        var newChip = {
          tag: selectedCardChip,
          id: selectedCardChip
        };
        $filterChipsContainer.addChip(newChip, $filterChipsContainer);
        var index = $filterChipsContainer.material_chip('data').indexOf(newChip);
        $('.chip', $filterChipsContainer).removeClass('selected');
        $filterChipsContainer.selectChip(index, $filterChipsContainer);
      }
      return false;
    });
  };
  var initChips = function($filterChipsContainer) {
    var $chips = $('[data-chip-text]');
    if (settings.materializeChips) {
      initMaterializeChips($chips);
    } else {
      $chips.on('click', function() {
        var tag = this.getAttribute('data-chip-text');
        $chips.removeClass('selected');
        if (filters.selected === tag) {
          filters.selected = null;
        } else {
          $chips
            .filter('[data-chip-text = ' + tag + ']')
            .addClass('selected');
          filters.selected = tag;
        }
        initPlugin();
      });
    }

    return $filterChipsContainer;
  };
  var init = function() {
    $filterChipsContainer = initChips($filterChipsContainer);
    $('.toggle-filter a').click(toggleFilter);
    initViewer();
    function toggleFilter() {
      var sheet = document.createElement('style');
      var filterHeight = $filterChipsContainer.height();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYS12aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIGRvY3VtZW50LCBuYXZpZ2F0b3IsIGFzeW5jLCB3aW5kb3csICQgKi9cbnZhciBsYVZpZXdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgZ3JpZElkOiAndmlld2VyLWNhcmRzJyxcbiAgICBjb3VudGVySWQ6ICd2aWV3ZXItY291bnRlcicsXG4gICAgY2FyZENsYXNzOiAnLnZpZXdlci1pdGVtJyxcbiAgICB2aWV3ZXJGaWx0ZXJDaGlwc0lkOiAndmlld2VyLWZpbHRlci1jaGlwcycsXG4gICAgZmlsdGVyQ2hpcHNJZDogJ3ZpZXdlci1maWx0ZXItY2hpcHMnLFxuICAgIGNhcmRDaGlwQ2xhc3M6ICcuY2FyZC1hY3Rpb24gLmNoaXAnLFxuICAgIG1hdGVyaWFsaXplQ2hpcHM6IHRydWUsXG4gICAgY2hpcE9wdGlvbnM6IHtcbiAgICAgIHBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIHNlY29uZGFyeVBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIGF1dG9jb21wbGV0ZU9wdGlvbnM6IHtcbiAgICAgICAgbGltaXQ6IEluZmluaXR5LFxuICAgICAgICBtaW5MZW5ndGg6IDFcbiAgICAgIH1cbiAgICB9LFxuICAgIGZsaWNraXR5OiB7XG4gICAgICBjZWxsU2VsZWN0b3I6ICcuZmxpY2tpdHktaXRlbScsXG4gICAgICB3cmFwQXJvdW5kOiB0cnVlLFxuICAgICAgc2VsZWN0ZWRBdHRyYWN0aW9uOiAwLjIsXG4gICAgICBmcmljdGlvbjogMC44LFxuICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgcGFnZURvdHM6IGZhbHNlLFxuICAgICAgY2VsbEFsaWduOiAnY2VudGVyJ1xuICAgIH0sXG4gICAgaXNvdG9wZToge1xuICAgICAgbGF5b3V0TW9kZTogJ3BhY2tlcnknLFxuICAgICAgcGFja2VyeToge1xuICAgICAgICBjb2x1bW5XaWR0aDogJy5ncmlkLXNpemVyJyxcbiAgICAgICAgZ3V0dGVyOiAnLmd1dHRlci1zaXplcidcbiAgICAgIH0sXG4gICAgICBpdGVtU2VsZWN0b3I6ICcuZ3JpZC1pdGVtJyxcbiAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcbiAgICAgIHJlc2l6ZTogdHJ1ZVxuICAgIH1cbiAgfTtcbiAgJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpO1xuICB2YXIgZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLmdyaWRJZCk7XG4gIHZhciBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZ3MuY291bnRlcklkKTtcbiAgdmFyIGNhcmRzID0gZ3JpZC5xdWVyeVNlbGVjdG9yQWxsKHNldHRpbmdzLmNhcmRDbGFzcyk7XG4gIHZhciB2aWV3ZXJGaWx0ZXJDaGlwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLnZpZXdlckZpbHRlckNoaXBzSWQpO1xuICB2YXIgJGZpbHRlckNoaXBzQ29udGFpbmVyID0gJCh2aWV3ZXJGaWx0ZXJDaGlwcyk7XG4gIHZhciBwcm9iUGhvbmUgPSAoKC9pcGhvbmV8YW5kcm9pZHxpZXxibGFja2JlcnJ5fGZlbm5lYy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICB2YXIgZmlsdGVycyA9IHtcbiAgICBjaGlwczogW11cbiAgfTtcbiAgdmFyIGdldENoaXBzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlckNoaXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmlld2VyRmlsdGVyQ2hpcHMucXVlcnlTZWxlY3RvckFsbCgnLmNoaXAnKSkubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgIHJldHVybiBjLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlckNoaXBzO1xuICB9O1xuICB2YXIgaXNvdG9wZUluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciBpc290b3BlU2V0dGluZ3MgPSBzZXR0aW5ncy5pc290b3BlO1xuXG4gICAgdmFyIGNoaXBGaWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkcyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykucmVwbGFjZSgvXFwsXFxzL2csICcsJykucmVwbGFjZSgvXFxzKy9nLCAnLScpLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgaXNNYXRjaGVkID0gdHJ1ZTtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkKSB7XG4gICAgICAgIGlzTWF0Y2hlZCA9IGtleXdvcmRzLmluZGV4T2YoZmlsdGVycy5zZWxlY3RlZCkgPiAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMuY2hpcHMgPSBnZXRDaGlwcygpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVycy5jaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChrZXl3b3Jkcy5pbmRleE9mKGZpbHRlcnMuY2hpcHNbaV0pID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXNNYXRjaGVkO1xuICAgIH07XG4gICAgaXNvdG9wZVNldHRpbmdzLmZpbHRlciA9IGNoaXBGaWx0ZXI7XG5cbiAgICAkZ3JpZC5pc290b3BlKGlzb3RvcGVTZXR0aW5ncyk7XG5cbiAgICAkKCdpbWcnLCBjYXJkcykuZWFjaChmdW5jdGlvbihpLCBvYmopIHtcbiAgICAgICQoJzxpbWcvPicpXG4gICAgICAgIC5hdHRyKCdzcmMnLCBvYmouc3JjKVxuICAgICAgICAubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICRncmlkLmlzb3RvcGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYXJkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNhcmRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtaXRlbScpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmxpY2tpdHlJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRncmlkID0gJChncmlkKTtcbiAgICB2YXIgZmxpY2tpdHlFeGlzdHMgPSAkZ3JpZC5kYXRhKCdmbGlja2l0eScpO1xuICAgIGNvdW50ZXIuY2xhc3NMaXN0LnJlbW92ZSgndGh1ZCcpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb3VudGVyLmNsYXNzTGlzdC5hZGQoJ3RodWQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgbSA9IDAsIG1sID0gY2FyZHMubGVuZ3RoOyBtIDwgbWw7IG0rKykge1xuICAgICAgdmFyIGZsaWNraXR5Q2FyZCA9IGNhcmRzW21dO1xuICAgICAgdmFyIGtleXdvcmRzID0gZmxpY2tpdHlDYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXl3b3JkcycpLnNwbGl0KCcsJyk7XG4gICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnZmxpY2tpdHktaXRlbScpO1xuICAgICAgZmxpY2tpdHlDYXJkLmNsYXNzTGlzdC5hZGQoJ2hpZGUtaXRlbScpO1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKGZsaWNraXR5Q2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5d29yZHMnKS5pbmRleE9mKGZpbHRlcnMuc2VsZWN0ZWQpID4gLTEpIHtcbiAgICAgICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LmFkZCgnZmxpY2tpdHktaXRlbScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzLmNoaXBzID0gZmlsdGVycy5jaGlwcyA9IGdldENoaXBzKCk7XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBmTCA9IGZpbHRlcnMuY2hpcHMubGVuZ3RoOyBqIDwgZkw7IGorKykge1xuICAgICAgICAgIGlmIChrZXl3b3Jkcy5pbmRleE9mKGZpbHRlcnMuY2hpcHNbal0pID4gLTEpIHtcbiAgICAgICAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbGlja2l0eUV4aXN0cykge1xuICAgICAgJGdyaWQuZmxpY2tpdHkoJ2Rlc3Ryb3knKTtcbiAgICB9XG5cbiAgICB2YXIgJGNhcm91c2VsID0gJGdyaWQuZmxpY2tpdHkoc2V0dGluZ3MuZmxpY2tpdHkpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2FyZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldO1xuICAgICAgaWYgKGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbGlja2l0eS1pdGVtJykpIHtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLWl0ZW0nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZsa3R5ID0gJGNhcm91c2VsLmRhdGEoJ2ZsaWNraXR5Jyk7XG4gICAgdmFyIHVwZGF0ZVN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsaWRlTnVtYmVyID0gZmxrdHkuc2VsZWN0ZWRJbmRleCArIDE7XG4gICAgICBjb3VudGVyLmlubmVySFRNTCA9IHNsaWRlTnVtYmVyICsgJy8nICsgZmxrdHkuc2xpZGVzLmxlbmd0aDtcbiAgICB9O1xuICAgICRjYXJvdXNlbC5vbignc2VsZWN0LmZsaWNraXR5JywgdXBkYXRlU3RhdHVzKTtcbiAgICB1cGRhdGVTdGF0dXMoKTtcbiAgfTtcbiAgdmFyIGluaXRWaWV3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciAkb3ZlcmxheSA9ICQoJyNsYS12aWV3ZXItb3ZlcmxheScpO1xuXG4gICAgaWYgKHByb2JQaG9uZSkge1xuICAgICAgaWYgKGdyaWQuaXNvdG9wZSkge1xuICAgICAgICAkZ3JpZC5pc290b3BlKCdkZXN0cm95Jyk7XG4gICAgICB9XG4gICAgICBpZiAoISRncmlkLmZsaWNraXR5KSB7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly91bnBrZy5jb20vZmxpY2tpdHlAMi9kaXN0L2ZsaWNraXR5LnBrZ2QubWluLmpzJ10sIGZsaWNraXR5SW5pdCk7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9qcXVlcnkucGFuem9vbUAzLjIuMi9kaXN0L2pxdWVyeS5wYW56b29tLm1pbi5qcyddKTtcbiAgICAgIH0gZWxzZSBpZiAoJGdyaWQuZmxpY2tpdHkpIHtcbiAgICAgICAgc2V0VGltZW91dChmbGlja2l0eUluaXQsIDEwMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkZ3JpZC5mbGlja2l0eSkge1xuICAgICAgICAkZ3JpZC5mbGlja2l0eSgnZGVzdHJveScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoISRncmlkLmlzb3RvcGUpIHtcbiAgICAgICAgYXN5bmMoWydodHRwczovL3VucGtnLmNvbS9pc290b3BlLWxheW91dEAzL2Rpc3QvaXNvdG9wZS5wa2dkLm1pbi5qcyddLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhc3luYyhbJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vaXNvdG9wZS1wYWNrZXJ5QDIuMC4wL3BhY2tlcnktbW9kZS5wa2dkLm1pbi5qcyddLCBpc290b3BlSW5pdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICgkZ3JpZC5pc290b3BlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoaXNvdG9wZUluaXQsIDEwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJCgnW2RhdGEtbGctaW1hZ2VdJywgJGdyaWQpLmNsaWNrKG9wZW5MaWdodGJveCk7XG5cbiAgICAkb3ZlcmxheS5jbGljayhjbG9zZUxpZ2h0Qm94KTtcblxuICAgIGZ1bmN0aW9uIG9wZW5MaWdodGJveCgpIHtcbiAgICAgIHZhciBpbWdVcmwgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1sZy1pbWFnZScpO1xuICAgICAgdmFyIHNob3dMb2FkZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubG9hZGVyLWNvbnRhaW5lcicpLmZhZGVJbignc2xvdycpO1xuICAgICAgfSwgMzAwKTtcblxuICAgICAgJCgnPGltZy8+JylcbiAgICAgICAgLmF0dHIoJ3NyYycsIGltZ1VybClcbiAgICAgICAgLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNob3dMb2FkZXIpO1xuICAgICAgICAgICQoJy5sb2FkZXItY29udGFpbmVyJykuaGlkZSgpO1xuICAgICAgICAgICQoJy5pbWctY29udGFpbmVyIC5pbWFnZScsICRvdmVybGF5KS5odG1sKHRoaXMpO1xuICAgICAgICAgICQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLmZhZGVJbigpO1xuICAgICAgICAgIGlmICgkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5wYW56b29tKSB7XG4gICAgICAgICAgICAkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5wYW56b29tKHtcbiAgICAgICAgICAgICAgbWluU2NhbGU6IDEsXG4gICAgICAgICAgICAgIHBhbk9ubHlXaGVuWm9vbWVkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5wYW56b29tIC5jbG9zZScsICRvdmVybGF5KS5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAkb3ZlcmxheS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZUxpZ2h0Qm94KCkge1xuICAgICAgJCgnLmltZy1jb250YWluZXIgLmltYWdlJywgJG92ZXJsYXkpLmh0bWwoJycpO1xuICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkuaGlkZSgpO1xuICAgICAgJG92ZXJsYXkuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgaWYgKCQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLnBhbnpvb20pIHtcbiAgICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkucGFuem9vbSgncmVzZXQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHZhciBpbml0UGx1Z2luID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHByb2JQaG9uZSkge1xuICAgICAgZmxpY2tpdHlJbml0KCk7XG4gICAgfSBlbHNlIGlmICghcHJvYlBob25lKSB7XG4gICAgICAkKGdyaWQpLmlzb3RvcGUoKTtcbiAgICB9XG4gIH07XG4gIHZhciBpbml0TWF0ZXJpYWxpemVDaGlwcyA9IGZ1bmN0aW9uKCRjaGlwcykge1xuICAgIHZhciBmaWx0ZXJDaGlwcyA9IFtdO1xuICAgIHZhciBjaGlwc0FyciA9IFtdO1xuICAgIHZhciBhdXRvQ29tcGxldGVEYXRhID0ge307XG4gICAgdmFyIGNMID0gY2FyZHMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBjTDsgaysrKSB7XG4gICAgICB2YXIgY2FyZENoaXBzID0gY2FyZHNba10uZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBmaXJzdCA9IGNhcmRDaGlwc1swXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChmaWx0ZXJDaGlwcy5pbmRleE9mKGZpcnN0KSA9PT0gLTEpIHtcbiAgICAgICAgZmlsdGVyQ2hpcHMucHVzaChmaXJzdCk7XG4gICAgICB9XG4gICAgICBjaGlwc0FyciA9IGNoaXBzQXJyLmNvbmNhdChjYXJkQ2hpcHMpO1xuICAgIH1cblxuICAgIHZhciBmQ0wgPSBmaWx0ZXJDaGlwcy5sZW5ndGg7XG4gICAgdmFyIGZpbHRlckNoaXBPYmpzID0gW107XG4gICAgdmFyIGk7XG4gICAgdmFyIGZpbHRlckl0ZW07XG4gICAgZm9yIChpID0gMDsgaSA8IGZDTDsgaSsrKSB7XG4gICAgICBmaWx0ZXJJdGVtID0gZmlsdGVyQ2hpcHNbaV07XG4gICAgICBmaWx0ZXJDaGlwT2Jqcy5wdXNoKHtcbiAgICAgICAgdGFnOiBmaWx0ZXJJdGVtLFxuICAgICAgICBpZDogZmlsdGVySXRlbVxuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBjbCA9IGNoaXBzQXJyLmxlbmd0aDtcbiAgICB2YXIgY2hpcEl0ZW07XG4gICAgZm9yIChpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgIGNoaXBJdGVtID0gY2hpcHNBcnJbaV07XG4gICAgICBpZiAoIWF1dG9Db21wbGV0ZURhdGFbY2hpcEl0ZW1dKSB7XG4gICAgICAgIGF1dG9Db21wbGV0ZURhdGFbY2hpcEl0ZW1dID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNoaXBPcHRpb25zID0gc2V0dGluZ3MuY2hpcE9wdGlvbnM7XG4gICAgY2hpcE9wdGlvbnMuZGF0YSA9IGZpbHRlckNoaXBPYmpzO1xuICAgIGNoaXBPcHRpb25zLmF1dG9jb21wbGV0ZU9wdGlvbnMuZGF0YSA9IGF1dG9Db21wbGV0ZURhdGE7XG4gICAgJGZpbHRlckNoaXBzQ29udGFpbmVyLm1hdGVyaWFsX2NoaXAoY2hpcE9wdGlvbnMpO1xuXG4gICAgdmFyIGZpbHRlckNoaXBDbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV2ZW50RW5kcyA9ICQodGhpcykuaGFzQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAkKCcuY2hpcCcsICRmaWx0ZXJDaGlwc0NvbnRhaW5lcikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAkY2hpcHMucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBpZiAoZmlsdGVycy5zZWxlY3RlZCkge1xuICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgaWYgKGV2ZW50RW5kcykge1xuICAgICAgICAgIGluaXRQbHVnaW4oKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJCgnaW5wdXQnLCAkZmlsdGVyQ2hpcHNDb250YWluZXIpLmZvY3VzKCk7XG5cbiAgICAkKCcuY2hpcCcsICRmaWx0ZXJDaGlwc0NvbnRhaW5lcikub24oJ2NsaWNrJywgZmlsdGVyQ2hpcENsaWNrKTtcblxuICAgICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5vbignY2hpcC5zZWxlY3QnLCBmdW5jdGlvbihlLCBjaGlwKSB7XG4gICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gY2hpcC50YWc7XG4gICAgICAkY2hpcHNcbiAgICAgICAgLmZpbHRlcignW2RhdGEtY2hpcC10ZXh0ID0gJyArIGNoaXAudGFnICsgJ10nKVxuICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBpbml0UGx1Z2luKCk7XG4gICAgfSk7XG5cbiAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIub24oJ2NoaXAuYWRkJywgaW5pdFBsdWdpbik7XG4gICAgJGZpbHRlckNoaXBzQ29udGFpbmVyLm9uKCdjaGlwLmRlbGV0ZScsIGZ1bmN0aW9uKGNoaXApIHtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkID09PSBjaGlwLnRhZykge1xuICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGluaXRQbHVnaW4oKTtcbiAgICB9KTtcbiAgICAkY2hpcHMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZmlsdGVyQ2hpcHMgPSAkZmlsdGVyQ2hpcHNDb250YWluZXIuY2hpbGRyZW4oKTtcbiAgICAgIHZhciBzZWxlY3RlZENhcmRDaGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2hpcC10ZXh0Jyk7XG4gICAgICB2YXIgY0wgPSBmaWx0ZXJDaGlwcy5sZW5ndGg7XG4gICAgICB2YXIgZmlsdGVyVGFyZ2V0Q2hpcCA9IG51bGw7XG4gICAgICAkY2hpcHMucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNMOyBpKyspIHtcbiAgICAgICAgaWYgKCFmaWx0ZXJDaGlwc1tpXS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlckNoaXBzW2ldLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPT09IHNlbGVjdGVkQ2FyZENoaXApIHtcbiAgICAgICAgICBmaWx0ZXJUYXJnZXRDaGlwID0gZmlsdGVyQ2hpcHNbaV07XG4gICAgICAgICAgJChmaWx0ZXJUYXJnZXRDaGlwKS5vbignY2xpY2snLCBmaWx0ZXJDaGlwQ2xpY2spO1xuICAgICAgICAgIGZpbHRlclRhcmdldENoaXAuY2xpY2soKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFmaWx0ZXJUYXJnZXRDaGlwKSB7XG4gICAgICAgIHZhciBuZXdDaGlwID0ge1xuICAgICAgICAgIHRhZzogc2VsZWN0ZWRDYXJkQ2hpcCxcbiAgICAgICAgICBpZDogc2VsZWN0ZWRDYXJkQ2hpcFxuICAgICAgICB9O1xuICAgICAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIuYWRkQ2hpcChuZXdDaGlwLCAkZmlsdGVyQ2hpcHNDb250YWluZXIpO1xuICAgICAgICB2YXIgaW5kZXggPSAkZmlsdGVyQ2hpcHNDb250YWluZXIubWF0ZXJpYWxfY2hpcCgnZGF0YScpLmluZGV4T2YobmV3Q2hpcCk7XG4gICAgICAgICQoJy5jaGlwJywgJGZpbHRlckNoaXBzQ29udGFpbmVyKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgJGZpbHRlckNoaXBzQ29udGFpbmVyLnNlbGVjdENoaXAoaW5kZXgsICRmaWx0ZXJDaGlwc0NvbnRhaW5lcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH07XG4gIHZhciBpbml0Q2hpcHMgPSBmdW5jdGlvbigkZmlsdGVyQ2hpcHNDb250YWluZXIpIHtcbiAgICB2YXIgJGNoaXBzID0gJCgnW2RhdGEtY2hpcC10ZXh0XScpO1xuICAgIGlmIChzZXR0aW5ncy5tYXRlcmlhbGl6ZUNoaXBzKSB7XG4gICAgICBpbml0TWF0ZXJpYWxpemVDaGlwcygkY2hpcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkY2hpcHMub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWcgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1jaGlwLXRleHQnKTtcbiAgICAgICAgJGNoaXBzLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBpZiAoZmlsdGVycy5zZWxlY3RlZCA9PT0gdGFnKSB7XG4gICAgICAgICAgZmlsdGVycy5zZWxlY3RlZCA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJGNoaXBzXG4gICAgICAgICAgICAuZmlsdGVyKCdbZGF0YS1jaGlwLXRleHQgPSAnICsgdGFnICsgJ10nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSB0YWc7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdFBsdWdpbigpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRmaWx0ZXJDaGlwc0NvbnRhaW5lcjtcbiAgfTtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIgPSBpbml0Q2hpcHMoJGZpbHRlckNoaXBzQ29udGFpbmVyKTtcbiAgICAkKCcudG9nZ2xlLWZpbHRlciBhJykuY2xpY2sodG9nZ2xlRmlsdGVyKTtcbiAgICBpbml0Vmlld2VyKCk7XG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyKCkge1xuICAgICAgdmFyIHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHZhciBmaWx0ZXJIZWlnaHQgPSAkZmlsdGVyQ2hpcHNDb250YWluZXIuaGVpZ2h0KCk7XG4gICAgICBzaGVldC5pbm5lckhUTUwgPSAnLmZpbHRlci1vbi52aWV3ZXItZmlsdGVyIHsgbWluLWhlaWdodDogJyArIChmaWx0ZXJIZWlnaHQgKyAzMCkgKyAncHg7IHdpbGwtY2hhbmdlOiBtaW4taGVpZ2h0O30nO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzaGVldCk7XG4gICAgICB2YXIgZmlsdGVyVG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YXAtdGFyZ2V0LXJvdywudmlld2VyLWZpbHRlciwudG9nZ2xlLWZpbHRlcicpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaWx0ZXJUb2dnbGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBmaWx0ZXJUb2dnbGVzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlci1vbicpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpbml0KCk7XG59O1xuIl0sImZpbGUiOiJsYS12aWV3ZXIuanMifQ==
