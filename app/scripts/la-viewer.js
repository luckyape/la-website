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
