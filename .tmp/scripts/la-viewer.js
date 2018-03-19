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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYS12aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIGRvY3VtZW50LCBuYXZpZ2F0b3IsIGFzeW5jLCB3aW5kb3csICQgKi9cbnZhciBsYVZpZXdlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgZ3JpZElkOiAndmlld2VyLWNhcmRzJyxcbiAgICBjb3VudGVySWQ6ICd2aWV3ZXItY291bnRlcicsXG4gICAgY2FyZENsYXNzOiAnLnZpZXdlci1pdGVtJyxcbiAgICB2aWV3ZXJGaWx0ZXJDaGlwc0lkOiAndmlld2VyLWZpbHRlci1jaGlwcycsXG4gICAgZmlsdGVyQ2hpcHNJZDogJ3ZpZXdlci1maWx0ZXItY2hpcHMnLFxuICAgIGNhcmRDaGlwQ2xhc3M6ICcuY2FyZC1hY3Rpb24gLmNoaXAnLFxuICAgIG1hdGVyaWFsaXplQ2hpcHM6IHRydWUsXG4gICAgY2hpcE9wdGlvbnM6IHtcbiAgICAgIHBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIHNlY29uZGFyeVBsYWNlaG9sZGVyOiAnLi4uJyxcbiAgICAgIGF1dG9jb21wbGV0ZU9wdGlvbnM6IHtcbiAgICAgICAgbGltaXQ6IEluZmluaXR5LFxuICAgICAgICBtaW5MZW5ndGg6IDFcbiAgICAgIH1cbiAgICB9LFxuICAgIGZsaWNraXR5OiB7XG4gICAgICBjZWxsU2VsZWN0b3I6ICcuZmxpY2tpdHktaXRlbScsXG4gICAgICB3cmFwQXJvdW5kOiB0cnVlLFxuICAgICAgc2VsZWN0ZWRBdHRyYWN0aW9uOiAwLjIsXG4gICAgICBmcmljdGlvbjogMC44LFxuICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgcGFnZURvdHM6IGZhbHNlLFxuICAgICAgY2VsbEFsaWduOiAnY2VudGVyJ1xuICAgIH0sXG4gICAgaXNvdG9wZToge1xuICAgICAgbGF5b3V0TW9kZTogJ3BhY2tlcnknLFxuICAgICAgcGFja2VyeToge1xuICAgICAgICBjb2x1bW5XaWR0aDogJy5ncmlkLXNpemVyJyxcbiAgICAgICAgZ3V0dGVyOiAnLmd1dHRlci1zaXplcidcbiAgICAgIH0sXG4gICAgICBpdGVtU2VsZWN0b3I6ICcuZ3JpZC1pdGVtJyxcbiAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcbiAgICAgIHJlc2l6ZTogdHJ1ZVxuICAgIH1cbiAgfTtcbiAgJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpO1xuICB2YXIgZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLmdyaWRJZCk7XG4gIHZhciBjb3VudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZ3MuY291bnRlcklkKTtcbiAgdmFyIGNhcmRzID0gZ3JpZC5xdWVyeVNlbGVjdG9yQWxsKHNldHRpbmdzLmNhcmRDbGFzcyk7XG4gIHZhciB2aWV3ZXJGaWx0ZXJDaGlwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLnZpZXdlckZpbHRlckNoaXBzSWQpO1xuICB2YXIgJGZpbHRlckNoaXBzQ29udGFpbmVyID0gJCh2aWV3ZXJGaWx0ZXJDaGlwcyk7XG4gIHZhciBwcm9iUGhvbmUgPSAoKC9pcGhvbmV8YW5kcm9pZHxpZXxibGFja2JlcnJ5fGZlbm5lYy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICB2YXIgZmlsdGVycyA9IHtcbiAgICBjaGlwczogW11cbiAgfTtcbiAgdmFyIGdldENoaXBzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlckNoaXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmlld2VyRmlsdGVyQ2hpcHMucXVlcnlTZWxlY3RvckFsbCgnLmNoaXAnKSkubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgIHJldHVybiBjLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlckNoaXBzO1xuICB9O1xuICB2YXIgaXNvdG9wZUluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciBpc290b3BlU2V0dGluZ3MgPSBzZXR0aW5ncy5pc290b3BlO1xuXG4gICAgdmFyIGNoaXBGaWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkcyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykucmVwbGFjZSgvXFwsXFxzL2csICcsJykucmVwbGFjZSgvXFxzKy9nLCAnLScpLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgaXNNYXRjaGVkID0gdHJ1ZTtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkKSB7XG4gICAgICAgIGlzTWF0Y2hlZCA9IGtleXdvcmRzLmluZGV4T2YoZmlsdGVycy5zZWxlY3RlZCkgPiAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMuY2hpcHMgPSBnZXRDaGlwcygpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVycy5jaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChrZXl3b3Jkcy5pbmRleE9mKGZpbHRlcnMuY2hpcHNbaV0pID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXNNYXRjaGVkO1xuICAgIH07XG4gICAgaXNvdG9wZVNldHRpbmdzLmZpbHRlciA9IGNoaXBGaWx0ZXI7XG5cbiAgICAkZ3JpZC5pc290b3BlKGlzb3RvcGVTZXR0aW5ncyk7XG5cbiAgICAkKCdpbWcnLCBjYXJkcykuZWFjaChmdW5jdGlvbihpLCBvYmopIHtcbiAgICAgICQoJzxpbWcvPicpXG4gICAgICAgIC5hdHRyKCdzcmMnLCBvYmouc3JjKVxuICAgICAgICAubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICRncmlkLmlzb3RvcGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYXJkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNhcmRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtaXRlbScpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmxpY2tpdHlJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRncmlkID0gJChncmlkKTtcbiAgICB2YXIgZmxpY2tpdHlFeGlzdHMgPSAkZ3JpZC5kYXRhKCdmbGlja2l0eScpO1xuICAgIGNvdW50ZXIuY2xhc3NMaXN0LnJlbW92ZSgndGh1ZCcpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb3VudGVyLmNsYXNzTGlzdC5hZGQoJ3RodWQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgbSA9IDAsIG1sID0gY2FyZHMubGVuZ3RoOyBtIDwgbWw7IG0rKykge1xuICAgICAgdmFyIGZsaWNraXR5Q2FyZCA9IGNhcmRzW21dO1xuICAgICAgdmFyIGtleXdvcmRzID0gZmxpY2tpdHlDYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXl3b3JkcycpLnNwbGl0KCcsJyk7XG4gICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnZmxpY2tpdHktaXRlbScpO1xuICAgICAgZmxpY2tpdHlDYXJkLmNsYXNzTGlzdC5hZGQoJ2hpZGUtaXRlbScpO1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKGZsaWNraXR5Q2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEta2V5d29yZHMnKS5pbmRleE9mKGZpbHRlcnMuc2VsZWN0ZWQpID4gLTEpIHtcbiAgICAgICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LmFkZCgnZmxpY2tpdHktaXRlbScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWx0ZXJzLmNoaXBzID0gZmlsdGVycy5jaGlwcyA9IGdldENoaXBzKCk7XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBmTCA9IGZpbHRlcnMuY2hpcHMubGVuZ3RoOyBqIDwgZkw7IGorKykge1xuICAgICAgICAgIGlmIChrZXl3b3Jkcy5pbmRleE9mKGZpbHRlcnMuY2hpcHNbal0pID4gLTEpIHtcbiAgICAgICAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbGlja2l0eUV4aXN0cykge1xuICAgICAgJGdyaWQuZmxpY2tpdHkoJ2Rlc3Ryb3knKTtcbiAgICB9XG5cbiAgICB2YXIgJGNhcm91c2VsID0gJGdyaWQuZmxpY2tpdHkoc2V0dGluZ3MuZmxpY2tpdHkpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2FyZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldO1xuICAgICAgaWYgKGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbGlja2l0eS1pdGVtJykpIHtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLWl0ZW0nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZsa3R5ID0gJGNhcm91c2VsLmRhdGEoJ2ZsaWNraXR5Jyk7XG4gICAgdmFyIHVwZGF0ZVN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsaWRlTnVtYmVyID0gZmxrdHkuc2VsZWN0ZWRJbmRleCArIDE7XG4gICAgICBjb3VudGVyLmlubmVySFRNTCA9IHNsaWRlTnVtYmVyICsgJy8nICsgZmxrdHkuc2xpZGVzLmxlbmd0aDtcbiAgICB9O1xuICAgICRjYXJvdXNlbC5vbignc2VsZWN0LmZsaWNraXR5JywgdXBkYXRlU3RhdHVzKTtcbiAgICB1cGRhdGVTdGF0dXMoKTtcbiAgfTtcbiAgdmFyIGluaXRWaWV3ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGdyaWQgPSAkKGdyaWQpO1xuICAgIHZhciAkb3ZlcmxheSA9ICQoJyNsYS12aWV3ZXItb3ZlcmxheScpO1xuXG4gICAgaWYgKHByb2JQaG9uZSkge1xuICAgICAgaWYgKGdyaWQuaXNvdG9wZSkge1xuICAgICAgICAkZ3JpZC5pc290b3BlKCdkZXN0cm95Jyk7XG4gICAgICB9XG4gICAgICBpZiAoISRncmlkLmZsaWNraXR5KSB7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly91bnBrZy5jb20vZmxpY2tpdHlAMi9kaXN0L2ZsaWNraXR5LnBrZ2QubWluLmpzJ10sIGZsaWNraXR5SW5pdCk7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9qcXVlcnkucGFuem9vbUAzLjIuMi9kaXN0L2pxdWVyeS5wYW56b29tLm1pbi5qcyddKTtcbiAgICAgIH0gZWxzZSBpZiAoJGdyaWQuZmxpY2tpdHkpIHtcbiAgICAgICAgc2V0VGltZW91dChmbGlja2l0eUluaXQsIDEwMCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkZ3JpZC5mbGlja2l0eSkge1xuICAgICAgICAkZ3JpZC5mbGlja2l0eSgnZGVzdHJveScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoISRncmlkLmlzb3RvcGUpIHtcbiAgICAgICAgYXN5bmMoWydodHRwczovL3VucGtnLmNvbS9pc290b3BlLWxheW91dEAzL2Rpc3QvaXNvdG9wZS5wa2dkLm1pbi5qcyddLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhc3luYyhbJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vaXNvdG9wZS1wYWNrZXJ5QDIuMC4wL3BhY2tlcnktbW9kZS5wa2dkLm1pbi5qcyddLCBpc290b3BlSW5pdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICgkZ3JpZC5pc290b3BlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoaXNvdG9wZUluaXQsIDEwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJCgnW2RhdGEtbGctaW1hZ2VdJywgJGdyaWQpLmNsaWNrKG9wZW5MaWdodGJveCk7XG5cbiAgICAkb3ZlcmxheS5jbGljayhjbG9zZUxpZ2h0Qm94KTtcblxuICAgIGZ1bmN0aW9uIG9wZW5MaWdodGJveCgpIHtcbiAgICAgIHZhciBpbWdVcmwgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1sZy1pbWFnZScpO1xuICAgICAgdmFyIHNob3dMb2FkZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubG9hZGVyLWNvbnRhaW5lcicpLmZhZGVJbignc2xvdycpO1xuICAgICAgfSwgMzAwKTtcblxuICAgICAgJCgnPGltZy8+JylcbiAgICAgICAgLmF0dHIoJ3NyYycsIGltZ1VybClcbiAgICAgICAgLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHNob3dMb2FkZXIpO1xuICAgICAgICAgICQoJy5sb2FkZXItY29udGFpbmVyJykuaGlkZSgpO1xuICAgICAgICAgICQoJy5pbWctY29udGFpbmVyIC5pbWFnZScsICRvdmVybGF5KS5odG1sKHRoaXMpO1xuICAgICAgICAgICQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLmZhZGVJbigpO1xuICAgICAgICAgIGlmICgkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5wYW56b29tKSB7XG4gICAgICAgICAgICAkKCcuaW1nLWNvbnRhaW5lcicsICRvdmVybGF5KS5wYW56b29tKHtcbiAgICAgICAgICAgICAgbWluU2NhbGU6IDEsXG4gICAgICAgICAgICAgIHBhbk9ubHlXaGVuWm9vbWVkOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5wYW56b29tIC5jbG9zZScsICRvdmVybGF5KS5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAkb3ZlcmxheS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZUxpZ2h0Qm94KCkge1xuICAgICAgJCgnLmltZy1jb250YWluZXIgLmltYWdlJywgJG92ZXJsYXkpLmh0bWwoJycpO1xuICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkuaGlkZSgpO1xuICAgICAgJG92ZXJsYXkuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgaWYgKCQoJy5pbWctY29udGFpbmVyJywgJG92ZXJsYXkpLnBhbnpvb20pIHtcbiAgICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkucGFuem9vbSgncmVzZXQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHZhciBpbml0UGx1Z2luID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHByb2JQaG9uZSkge1xuICAgICAgZmxpY2tpdHlJbml0KCk7XG4gICAgfSBlbHNlIGlmICghcHJvYlBob25lKSB7XG4gICAgICAkKGdyaWQpLmlzb3RvcGUoKTtcbiAgICB9XG4gIH07XG4gIHZhciBpbml0TWF0ZXJpYWxpemVDaGlwcyA9IGZ1bmN0aW9uKCRjaGlwcykge1xuICAgIHZhciBmaWx0ZXJDaGlwcyA9IFtdO1xuICAgIHZhciBjaGlwc0FyciA9IFtdO1xuICAgIHZhciBhdXRvQ29tcGxldGVEYXRhID0ge307XG4gICAgdmFyIGNMID0gY2FyZHMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBjTDsgaysrKSB7XG4gICAgICB2YXIgY2FyZENoaXBzID0gY2FyZHNba10uZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBmaXJzdCA9IGNhcmRDaGlwc1swXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGZpbHRlckNoaXBzLnB1c2goe1xuICAgICAgICB0YWc6IGZpcnN0LFxuICAgICAgICBpZDogZmlyc3RcbiAgICAgIH0pO1xuICAgICAgY2hpcHNBcnIgPSBjaGlwc0Fyci5jb25jYXQoY2FyZENoaXBzKTtcbiAgICB9XG5cbiAgICB2YXIgY2wgPSBjaGlwc0Fyci5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGNoaXBzQXJyW2ldO1xuICAgICAgaWYgKCFhdXRvQ29tcGxldGVEYXRhW2l0ZW1dKSB7XG4gICAgICAgIGF1dG9Db21wbGV0ZURhdGFbaXRlbV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2hpcE9wdGlvbnMgPSBzZXR0aW5ncy5jaGlwT3B0aW9ucztcbiAgICBjaGlwT3B0aW9ucy5kYXRhID0gZmlsdGVyQ2hpcHM7XG4gICAgY2hpcE9wdGlvbnMuYXV0b2NvbXBsZXRlT3B0aW9ucy5kYXRhID0gYXV0b0NvbXBsZXRlRGF0YTtcbiAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIubWF0ZXJpYWxfY2hpcChjaGlwT3B0aW9ucyk7XG5cbiAgICB2YXIgZmlsdGVyQ2hpcENsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXZlbnRFbmRzID0gJCh0aGlzKS5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICQoJy5jaGlwJywgJGZpbHRlckNoaXBzQ29udGFpbmVyKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICRjaGlwcy5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkKSB7XG4gICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICBpZiAoZXZlbnRFbmRzKSB7XG4gICAgICAgICAgaW5pdFBsdWdpbigpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAkKCdpbnB1dCcsICRmaWx0ZXJDaGlwc0NvbnRhaW5lcikuZm9jdXMoKTtcblxuICAgICQoJy5jaGlwJywgJGZpbHRlckNoaXBzQ29udGFpbmVyKS5vbignY2xpY2snLCBmaWx0ZXJDaGlwQ2xpY2spO1xuXG4gICAgJGZpbHRlckNoaXBzQ29udGFpbmVyLm9uKCdjaGlwLnNlbGVjdCcsIGZ1bmN0aW9uKGUsIGNoaXApIHtcbiAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSBjaGlwLnRhZztcbiAgICAgICRjaGlwc1xuICAgICAgICAuZmlsdGVyKCdbZGF0YS1jaGlwLXRleHQgPSAnICsgY2hpcC50YWcgKyAnXScpXG4gICAgICAgIC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIGluaXRQbHVnaW4oKTtcbiAgICB9KTtcblxuICAgICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5vbignY2hpcC5hZGQnLCBpbml0UGx1Z2luKTtcbiAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIub24oJ2NoaXAuZGVsZXRlJywgZnVuY3Rpb24oY2hpcCkge1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQgPT09IGNoaXAudGFnKSB7XG4gICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgfVxuICAgICAgaW5pdFBsdWdpbigpO1xuICAgIH0pO1xuICAgICRjaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmaWx0ZXJDaGlwcyA9ICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5jaGlsZHJlbigpO1xuICAgICAgdmFyIHNlbGVjdGVkQ2FyZENoaXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1jaGlwLXRleHQnKTtcbiAgICAgIHZhciBjTCA9IGZpbHRlckNoaXBzLmxlbmd0aDtcbiAgICAgIHZhciBmaWx0ZXJUYXJnZXRDaGlwID0gbnVsbDtcbiAgICAgICRjaGlwcy5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY0w7IGkrKykge1xuICAgICAgICBpZiAoIWZpbHRlckNoaXBzW2ldLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsdGVyQ2hpcHNbaV0uZmlyc3RDaGlsZC50ZXh0Q29udGVudCA9PT0gc2VsZWN0ZWRDYXJkQ2hpcCkge1xuICAgICAgICAgIGZpbHRlclRhcmdldENoaXAgPSBmaWx0ZXJDaGlwc1tpXTtcbiAgICAgICAgICAkKGZpbHRlclRhcmdldENoaXApLm9uKCdjbGljaycsIGZpbHRlckNoaXBDbGljayk7XG4gICAgICAgICAgZmlsdGVyVGFyZ2V0Q2hpcC5jbGljaygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWZpbHRlclRhcmdldENoaXApIHtcbiAgICAgICAgdmFyIG5ld0NoaXAgPSB7XG4gICAgICAgICAgdGFnOiBzZWxlY3RlZENhcmRDaGlwLFxuICAgICAgICAgIGlkOiBzZWxlY3RlZENhcmRDaGlwXG4gICAgICAgIH07XG4gICAgICAgICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5hZGRDaGlwKG5ld0NoaXAsICRmaWx0ZXJDaGlwc0NvbnRhaW5lcik7XG4gICAgICAgIHZhciBpbmRleCA9ICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5tYXRlcmlhbF9jaGlwKCdkYXRhJykuaW5kZXhPZihuZXdDaGlwKTtcbiAgICAgICAgJCgnLmNoaXAnLCAkZmlsdGVyQ2hpcHNDb250YWluZXIpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAkZmlsdGVyQ2hpcHNDb250YWluZXIuc2VsZWN0Q2hpcChpbmRleCwgJGZpbHRlckNoaXBzQ29udGFpbmVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfTtcbiAgdmFyIGluaXRDaGlwcyA9IGZ1bmN0aW9uKCRmaWx0ZXJDaGlwc0NvbnRhaW5lcikge1xuICAgIHZhciAkY2hpcHMgPSAkKCdbZGF0YS1jaGlwLXRleHRdJyk7XG4gICAgaWYgKHNldHRpbmdzLm1hdGVyaWFsaXplQ2hpcHMpIHtcbiAgICAgIGluaXRNYXRlcmlhbGl6ZUNoaXBzKCRjaGlwcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRjaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHRhZyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWNoaXAtdGV4dCcpO1xuICAgICAgICAkY2hpcHMucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkID09PSB0YWcpIHtcbiAgICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkY2hpcHNcbiAgICAgICAgICAgIC5maWx0ZXIoJ1tkYXRhLWNoaXAtdGV4dCA9ICcgKyB0YWcgKyAnXScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgZmlsdGVycy5zZWxlY3RlZCA9IHRhZztcbiAgICAgICAgfVxuICAgICAgICBpbml0UGx1Z2luKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGZpbHRlckNoaXBzQ29udGFpbmVyO1xuICB9O1xuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICRmaWx0ZXJDaGlwc0NvbnRhaW5lciA9IGluaXRDaGlwcygkZmlsdGVyQ2hpcHNDb250YWluZXIpO1xuICAgICQoJy50b2dnbGUtZmlsdGVyIGEnKS5jbGljayh0b2dnbGVGaWx0ZXIpO1xuICAgIGluaXRWaWV3ZXIoKTtcbiAgICBmdW5jdGlvbiB0b2dnbGVGaWx0ZXIoKSB7XG4gICAgICB2YXIgc2hlZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgdmFyIGZpbHRlckhlaWdodCA9ICRmaWx0ZXJDaGlwc0NvbnRhaW5lci5oZWlnaHQoKTtcbiAgICAgIHNoZWV0LmlubmVySFRNTCA9ICcuZmlsdGVyLW9uLnZpZXdlci1maWx0ZXIgeyBtaW4taGVpZ2h0OiAnICsgKGZpbHRlckhlaWdodCArIDMwKSArICdweDsgd2lsbC1jaGFuZ2U6IG1pbi1oZWlnaHQ7fSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNoZWV0KTtcbiAgICAgIHZhciBmaWx0ZXJUb2dnbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhcC10YXJnZXQtcm93LC52aWV3ZXItZmlsdGVyLC50b2dnbGUtZmlsdGVyJyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZpbHRlclRvZ2dsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGZpbHRlclRvZ2dsZXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnZmlsdGVyLW9uJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGluaXQoKTtcbn07XG4iXSwiZmlsZSI6ImxhLXZpZXdlci5qcyJ9
