
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
    }};
  $.extend(settings, options);
  console.info(settings);
  var self = this;
  this.$el = $(this);
  this.$document = $(document);
  this.grid = document.getElementById(settings.gridId);
  this.counter = document.getElementById(settings.counterId);
  this.cards = this.grid.querySelectorAll(settings.cardClass);
  this.viewerFilterChips = document.getElementById(settings.viewerFilterChipsId);
  this.$chips = $(this.viewerFilterChips);
  this.probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) && 'ontouchstart' in document.documentElement);
  this.filters = {
    chips: []
  };
  this.initViewer = function() {
    var $grid = $(this.grid);
    var $overlay = $('#la-viewer-overlay');
    if (this.probPhone) {
      if (this.grid.isotope) {
        $grid.isotope('destroy');
      }
      if (!$grid.flickity) {
        async(['https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js'], this.flickityInit);
        async(['https://cdn.jsdelivr.net/npm/jquery.panzoom@3.2.2/dist/jquery.panzoom.min.js']);
      } else if ($grid.flickity) {
        setTimeout(this.flickityInit, 100);
      }
    } else {
      if ($grid.flickity) {
        $grid.flickity('destroy');
      }

      if (!$grid.isotope) {
        async(['https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js'], function() {
          async(['https://cdn.jsdelivr.net/npm/isotope-packery@2.0.0/packery-mode.pkgd.min.js'], self.isotopeInit);
        });
      } else if ($grid.isotope) {
        setTimeout(self.isotopeInit, 100);
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
          $('.img-container', $overlay).panzoom({
            minScale: 1,
            panOnlyWhenZoomed: true
          });
          $('.panzoom .close', $overlay).on('touchstart', function(e) {
            e.stopImmediatePropagation();
          });
        });
      $overlay.fadeIn('fast');
    }

    function closeLightBox() {
      $('.img-container .image', $overlay).html('');
      $('.img-container', $overlay).hide();
      $overlay.fadeOut('fast');
      $('.img-container', $overlay).panzoom('reset');
    }
  };
  this.init = function() {
    var $chips = self.$chips;
    this.$chips = self.initChips($chips);
    this.fiterResults = this.viewerFilterChips.querySelector('.autocomplete-content');
    $('.toggle-filter a').click(toggleFilter);
    this.initViewer();

    function toggleFilter() {
      var sheet = document.createElement('style');
      var filterHeight = self.$chips.height();
      sheet.innerHTML = '.filter-on.viewer-filter { min-height: ' + (filterHeight + 30) + 'px; will-change: min-height;}';
      document.body.appendChild(sheet);
      var filterToggles = document.querySelectorAll('.tap-target-row,.viewer-filter,.toggle-filter');
      for (var i = 0, l = filterToggles.length; i < l; i++) {
        filterToggles[i].classList.toggle('filter-on');
      }
    }
  };

  this.initPlugin = function() {
    if (self.probPhone) {
      self.flickityInit();
    } else if (!this.probPhone) {
      $(self.grid).isotope();
    }
  };

  this.initMaterializeChips = function($chips) {
    var filterChips = [];
    var chipsArr = [];
    var autoCompleteData = {};
    var cL = self.cards.length;
    var filters = self.filters;
    var cards = self.cards;

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
        self.initPlugin();
      }
    });
    $chips.on('chip.select', function(e, chip) {
      filters.selected = chip.tag;
      self.initPlugin();
    });

    $chips.on('chip.add', self.initPlugin);
    $chips.on('chip.delete', function(chip) {
      if (filters.selected === chip.tag) {
        filters.selected = null;
      }
      self.initPlugin();
    });
  };
  this.initChips = function($chips) {
    if (settings.materializeChips) {
      this.initMaterializeChips($chips);
    } else {
      var filters = self.filters;
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
        self.initPlugin();
      });
    }

    return $chips;
  };
  this.isotopeInit = function() {
    var $chips = self.$chips;
    var filters = self.filters;
    var $grid = $(self.grid);
    var cards = self.cards;
    var isotopeSettings = settings.isotope;

    var chipFilter = function() {
      var keywords = this.getAttribute('data-keywords').split(',');
      var isMatched = true;
      if (filters.selected) {
        isMatched = keywords.indexOf(filters.selected) > -1;
      } else {
        var materialChips = $chips.material_chip('data');
        if (materialChips) {
          filters.chips = materialChips.map(function(c) {
            return c.tag;
          });
        } else {
          filters.chips = Array.prototype.slice.call(self.viewerFilterChips.querySelectorAll('.chip')).map(function(c) {
            return c.innerText;
          });
        }

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

  this.flickityInit = function() {
    var $grid = $(self.grid);
    var cards = self.cards;
    var counter = self.counter;
    var flickityExists = $grid.flickity;
    counter.classList.remove('thud');
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        counter.classList.add('thud');
      });
    });

    for (var m = 0, ml = cards.length; m < ml; m++) {
      var flickityCard = cards[m];
      var filters = self.filters;
      var $chips = self.$chips;
      var keywords = flickityCard.getAttribute('data-keywords').split(',');
      flickityCard.classList.remove('flickity-item');
      flickityCard.classList.add('hide-item');
      if (filters.selected) {
        if (flickityCard.getAttribute('data-keywords').indexOf(filters.selected) > -1) {
          flickityCard.classList.add('flickity-item');
        }
      } else {
        filters.chips = $chips.material_chip('data').map(function(c) {
          return c.tag;
        });
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
  this.init();
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYS12aWV3ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBnbG9iYWwgZG9jdW1lbnQsIG5hdmlnYXRvciwgYXN5bmMsIHdpbmRvdywgJCAqL1xudmFyIGxhVmlld2VyID0gZnVuY3Rpb24ob3B0aW9ucykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBzZXR0aW5ncyA9IHtcbiAgICBncmlkSWQ6ICd2aWV3ZXItY2FyZHMnLFxuICAgIGNvdW50ZXJJZDogJ3ZpZXdlci1jb3VudGVyJyxcbiAgICBjYXJkQ2xhc3M6ICcudmlld2VyLWl0ZW0nLFxuICAgIHZpZXdlckZpbHRlckNoaXBzSWQ6ICd2aWV3ZXItZmlsdGVyLWNoaXBzJyxcbiAgICBmaWx0ZXJDaGlwc0lkOiAndmlld2VyLWZpbHRlci1jaGlwcycsXG4gICAgY2FyZENoaXBDbGFzczogJy5jYXJkLWFjdGlvbiAuY2hpcCcsXG4gICAgbWF0ZXJpYWxpemVDaGlwczogdHJ1ZSxcbiAgICBjaGlwT3B0aW9uczoge1xuICAgICAgcGxhY2Vob2xkZXI6ICcuLi4nLFxuICAgICAgc2Vjb25kYXJ5UGxhY2Vob2xkZXI6ICcuLi4nLFxuICAgICAgYXV0b2NvbXBsZXRlT3B0aW9uczoge1xuICAgICAgICBsaW1pdDogSW5maW5pdHksXG4gICAgICAgIG1pbkxlbmd0aDogMVxuICAgICAgfVxuICAgIH0sXG4gICAgZmxpY2tpdHk6IHtcbiAgICAgIGNlbGxTZWxlY3RvcjogJy5mbGlja2l0eS1pdGVtJyxcbiAgICAgIHdyYXBBcm91bmQ6IHRydWUsXG4gICAgICBzZWxlY3RlZEF0dHJhY3Rpb246IDAuMixcbiAgICAgIGZyaWN0aW9uOiAwLjgsXG4gICAgICByZXNpemU6IHRydWUsXG4gICAgICBwYWdlRG90czogZmFsc2UsXG4gICAgICBjZWxsQWxpZ246ICdjZW50ZXInXG4gICAgfSxcbiAgICBpc290b3BlOiB7XG4gICAgICBsYXlvdXRNb2RlOiAncGFja2VyeScsXG4gICAgICBwYWNrZXJ5OiB7XG4gICAgICAgIGNvbHVtbldpZHRoOiAnLmdyaWQtc2l6ZXInLFxuICAgICAgICBndXR0ZXI6ICcuZ3V0dGVyLXNpemVyJ1xuICAgICAgfSxcbiAgICAgIGl0ZW1TZWxlY3RvcjogJy5ncmlkLWl0ZW0nLFxuICAgICAgcGVyY2VudFBvc2l0aW9uOiB0cnVlLFxuICAgICAgcmVzaXplOiB0cnVlXG4gICAgfX07XG4gICQuZXh0ZW5kKHNldHRpbmdzLCBvcHRpb25zKTtcbiAgY29uc29sZS5pbmZvKHNldHRpbmdzKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLiRlbCA9ICQodGhpcyk7XG4gIHRoaXMuJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG4gIHRoaXMuZ3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLmdyaWRJZCk7XG4gIHRoaXMuY291bnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNldHRpbmdzLmNvdW50ZXJJZCk7XG4gIHRoaXMuY2FyZHMgPSB0aGlzLmdyaWQucXVlcnlTZWxlY3RvckFsbChzZXR0aW5ncy5jYXJkQ2xhc3MpO1xuICB0aGlzLnZpZXdlckZpbHRlckNoaXBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2V0dGluZ3Mudmlld2VyRmlsdGVyQ2hpcHNJZCk7XG4gIHRoaXMuJGNoaXBzID0gJCh0aGlzLnZpZXdlckZpbHRlckNoaXBzKTtcbiAgdGhpcy5wcm9iUGhvbmUgPSAoKC9pcGhvbmV8YW5kcm9pZHxpZXxibGFja2JlcnJ5fGZlbm5lYy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICB0aGlzLmZpbHRlcnMgPSB7XG4gICAgY2hpcHM6IFtdXG4gIH07XG4gIHRoaXMuaW5pdFZpZXdlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkZ3JpZCA9ICQodGhpcy5ncmlkKTtcbiAgICB2YXIgJG92ZXJsYXkgPSAkKCcjbGEtdmlld2VyLW92ZXJsYXknKTtcbiAgICBpZiAodGhpcy5wcm9iUGhvbmUpIHtcbiAgICAgIGlmICh0aGlzLmdyaWQuaXNvdG9wZSkge1xuICAgICAgICAkZ3JpZC5pc290b3BlKCdkZXN0cm95Jyk7XG4gICAgICB9XG4gICAgICBpZiAoISRncmlkLmZsaWNraXR5KSB7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly91bnBrZy5jb20vZmxpY2tpdHlAMi9kaXN0L2ZsaWNraXR5LnBrZ2QubWluLmpzJ10sIHRoaXMuZmxpY2tpdHlJbml0KTtcbiAgICAgICAgYXN5bmMoWydodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2pxdWVyeS5wYW56b29tQDMuMi4yL2Rpc3QvanF1ZXJ5LnBhbnpvb20ubWluLmpzJ10pO1xuICAgICAgfSBlbHNlIGlmICgkZ3JpZC5mbGlja2l0eSkge1xuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZmxpY2tpdHlJbml0LCAxMDApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJGdyaWQuZmxpY2tpdHkpIHtcbiAgICAgICAgJGdyaWQuZmxpY2tpdHkoJ2Rlc3Ryb3knKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkZ3JpZC5pc290b3BlKSB7XG4gICAgICAgIGFzeW5jKFsnaHR0cHM6Ly91bnBrZy5jb20vaXNvdG9wZS1sYXlvdXRAMy9kaXN0L2lzb3RvcGUucGtnZC5taW4uanMnXSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYXN5bmMoWydodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2lzb3RvcGUtcGFja2VyeUAyLjAuMC9wYWNrZXJ5LW1vZGUucGtnZC5taW4uanMnXSwgc2VsZi5pc290b3BlSW5pdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICgkZ3JpZC5pc290b3BlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoc2VsZi5pc290b3BlSW5pdCwgMTAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkKCdbZGF0YS1sZy1pbWFnZV0nLCAkZ3JpZCkuY2xpY2sob3BlbkxpZ2h0Ym94KTtcblxuICAgICRvdmVybGF5LmNsaWNrKGNsb3NlTGlnaHRCb3gpO1xuXG4gICAgZnVuY3Rpb24gb3BlbkxpZ2h0Ym94KCkge1xuICAgICAgdmFyIGltZ1VybCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWxnLWltYWdlJyk7XG4gICAgICB2YXIgc2hvd0xvYWRlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5sb2FkZXItY29udGFpbmVyJykuZmFkZUluKCdzbG93Jyk7XG4gICAgICB9LCAzMDApO1xuXG4gICAgICAkKCc8aW1nLz4nKVxuICAgICAgICAuYXR0cignc3JjJywgaW1nVXJsKVxuICAgICAgICAubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoc2hvd0xvYWRlcik7XG4gICAgICAgICAgJCgnLmxvYWRlci1jb250YWluZXInKS5oaWRlKCk7XG4gICAgICAgICAgJCgnLmltZy1jb250YWluZXIgLmltYWdlJywgJG92ZXJsYXkpLmh0bWwodGhpcyk7XG4gICAgICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkuZmFkZUluKCk7XG4gICAgICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkucGFuem9vbSh7XG4gICAgICAgICAgICBtaW5TY2FsZTogMSxcbiAgICAgICAgICAgIHBhbk9ubHlXaGVuWm9vbWVkOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgJCgnLnBhbnpvb20gLmNsb3NlJywgJG92ZXJsYXkpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAkb3ZlcmxheS5mYWRlSW4oJ2Zhc3QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZUxpZ2h0Qm94KCkge1xuICAgICAgJCgnLmltZy1jb250YWluZXIgLmltYWdlJywgJG92ZXJsYXkpLmh0bWwoJycpO1xuICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkuaGlkZSgpO1xuICAgICAgJG92ZXJsYXkuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgJCgnLmltZy1jb250YWluZXInLCAkb3ZlcmxheSkucGFuem9vbSgncmVzZXQnKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkY2hpcHMgPSBzZWxmLiRjaGlwcztcbiAgICB0aGlzLiRjaGlwcyA9IHNlbGYuaW5pdENoaXBzKCRjaGlwcyk7XG4gICAgdGhpcy5maXRlclJlc3VsdHMgPSB0aGlzLnZpZXdlckZpbHRlckNoaXBzLnF1ZXJ5U2VsZWN0b3IoJy5hdXRvY29tcGxldGUtY29udGVudCcpO1xuICAgICQoJy50b2dnbGUtZmlsdGVyIGEnKS5jbGljayh0b2dnbGVGaWx0ZXIpO1xuICAgIHRoaXMuaW5pdFZpZXdlcigpO1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyKCkge1xuICAgICAgdmFyIHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHZhciBmaWx0ZXJIZWlnaHQgPSBzZWxmLiRjaGlwcy5oZWlnaHQoKTtcbiAgICAgIHNoZWV0LmlubmVySFRNTCA9ICcuZmlsdGVyLW9uLnZpZXdlci1maWx0ZXIgeyBtaW4taGVpZ2h0OiAnICsgKGZpbHRlckhlaWdodCArIDMwKSArICdweDsgd2lsbC1jaGFuZ2U6IG1pbi1oZWlnaHQ7fSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNoZWV0KTtcbiAgICAgIHZhciBmaWx0ZXJUb2dnbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhcC10YXJnZXQtcm93LC52aWV3ZXItZmlsdGVyLC50b2dnbGUtZmlsdGVyJyk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGZpbHRlclRvZ2dsZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGZpbHRlclRvZ2dsZXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnZmlsdGVyLW9uJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuaW5pdFBsdWdpbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzZWxmLnByb2JQaG9uZSkge1xuICAgICAgc2VsZi5mbGlja2l0eUluaXQoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnByb2JQaG9uZSkge1xuICAgICAgJChzZWxmLmdyaWQpLmlzb3RvcGUoKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5pbml0TWF0ZXJpYWxpemVDaGlwcyA9IGZ1bmN0aW9uKCRjaGlwcykge1xuICAgIHZhciBmaWx0ZXJDaGlwcyA9IFtdO1xuICAgIHZhciBjaGlwc0FyciA9IFtdO1xuICAgIHZhciBhdXRvQ29tcGxldGVEYXRhID0ge307XG4gICAgdmFyIGNMID0gc2VsZi5jYXJkcy5sZW5ndGg7XG4gICAgdmFyIGZpbHRlcnMgPSBzZWxmLmZpbHRlcnM7XG4gICAgdmFyIGNhcmRzID0gc2VsZi5jYXJkcztcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY0w7IGsrKykge1xuICAgICAgdmFyIGNhcmRDaGlwcyA9IGNhcmRzW2tdLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXl3b3JkcycpLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgZmlyc3QgPSBjYXJkQ2hpcHNbMF0udHJpbSgpLnJlcGxhY2UoL1xccysvZywgJy0nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgZmlsdGVyQ2hpcHMucHVzaCh7XG4gICAgICAgIHRhZzogZmlyc3QsXG4gICAgICAgIGlkOiBmaXJzdFxuICAgICAgfSk7XG4gICAgICBjaGlwc0FyciA9IGNoaXBzQXJyLmNvbmNhdChjYXJkQ2hpcHMpO1xuICAgIH1cblxuICAgIHZhciBjbCA9IGNoaXBzQXJyLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gY2hpcHNBcnJbaV07XG4gICAgICBpZiAoIWF1dG9Db21wbGV0ZURhdGFbaXRlbV0pIHtcbiAgICAgICAgYXV0b0NvbXBsZXRlRGF0YVtpdGVtXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjaGlwT3B0aW9ucyA9IHNldHRpbmdzLmNoaXBPcHRpb25zO1xuICAgIGNoaXBPcHRpb25zLmRhdGEgPSBmaWx0ZXJDaGlwcztcbiAgICBjaGlwT3B0aW9ucy5hdXRvY29tcGxldGVPcHRpb25zLmRhdGEgPSBhdXRvQ29tcGxldGVEYXRhO1xuICAgICRjaGlwcy5tYXRlcmlhbF9jaGlwKGNoaXBPcHRpb25zKTtcbiAgICAkKCdpbnB1dCcsICRjaGlwcykuZm9jdXMoKTtcblxuICAgICRjaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkKSB7XG4gICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICBzZWxmLmluaXRQbHVnaW4oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkY2hpcHMub24oJ2NoaXAuc2VsZWN0JywgZnVuY3Rpb24oZSwgY2hpcCkge1xuICAgICAgZmlsdGVycy5zZWxlY3RlZCA9IGNoaXAudGFnO1xuICAgICAgc2VsZi5pbml0UGx1Z2luKCk7XG4gICAgfSk7XG5cbiAgICAkY2hpcHMub24oJ2NoaXAuYWRkJywgc2VsZi5pbml0UGx1Z2luKTtcbiAgICAkY2hpcHMub24oJ2NoaXAuZGVsZXRlJywgZnVuY3Rpb24oY2hpcCkge1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQgPT09IGNoaXAudGFnKSB7XG4gICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgfVxuICAgICAgc2VsZi5pbml0UGx1Z2luKCk7XG4gICAgfSk7XG4gIH07XG4gIHRoaXMuaW5pdENoaXBzID0gZnVuY3Rpb24oJGNoaXBzKSB7XG4gICAgaWYgKHNldHRpbmdzLm1hdGVyaWFsaXplQ2hpcHMpIHtcbiAgICAgIHRoaXMuaW5pdE1hdGVyaWFsaXplQ2hpcHMoJGNoaXBzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpbHRlcnMgPSBzZWxmLmZpbHRlcnM7XG4gICAgICAkKCcuY2hpcCcsICRjaGlwcykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0YWcgPSB0aGlzLmlubmVyVGV4dDtcbiAgICAgICAgY29uc29sZS5pbmZvKHRhZywgdGhpcyk7XG4gICAgICAgIGlmIChmaWx0ZXJzLnNlbGVjdGVkID09PSB0YWcpIHtcbiAgICAgICAgICBmaWx0ZXJzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoJy5jaGlwJywgJGNoaXBzKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgIGZpbHRlcnMuc2VsZWN0ZWQgPSB0YWc7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5pbml0UGx1Z2luKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGNoaXBzO1xuICB9O1xuICB0aGlzLmlzb3RvcGVJbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRjaGlwcyA9IHNlbGYuJGNoaXBzO1xuICAgIHZhciBmaWx0ZXJzID0gc2VsZi5maWx0ZXJzO1xuICAgIHZhciAkZ3JpZCA9ICQoc2VsZi5ncmlkKTtcbiAgICB2YXIgY2FyZHMgPSBzZWxmLmNhcmRzO1xuICAgIHZhciBpc290b3BlU2V0dGluZ3MgPSBzZXR0aW5ncy5pc290b3BlO1xuXG4gICAgdmFyIGNoaXBGaWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXl3b3JkcyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBpc01hdGNoZWQgPSB0cnVlO1xuICAgICAgaWYgKGZpbHRlcnMuc2VsZWN0ZWQpIHtcbiAgICAgICAgaXNNYXRjaGVkID0ga2V5d29yZHMuaW5kZXhPZihmaWx0ZXJzLnNlbGVjdGVkKSA+IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG1hdGVyaWFsQ2hpcHMgPSAkY2hpcHMubWF0ZXJpYWxfY2hpcCgnZGF0YScpO1xuICAgICAgICBpZiAobWF0ZXJpYWxDaGlwcykge1xuICAgICAgICAgIGZpbHRlcnMuY2hpcHMgPSBtYXRlcmlhbENoaXBzLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgICByZXR1cm4gYy50YWc7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmlsdGVycy5jaGlwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGYudmlld2VyRmlsdGVyQ2hpcHMucXVlcnlTZWxlY3RvckFsbCgnLmNoaXAnKSkubWFwKGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmlubmVyVGV4dDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVycy5jaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChrZXl3b3Jkcy5pbmRleE9mKGZpbHRlcnMuY2hpcHNbaV0pID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXNNYXRjaGVkO1xuICAgIH07XG4gICAgaXNvdG9wZVNldHRpbmdzLmZpbHRlciA9IGNoaXBGaWx0ZXI7XG5cbiAgICAkZ3JpZC5pc290b3BlKGlzb3RvcGVTZXR0aW5ncyk7XG5cbiAgICAkKCdpbWcnLCBjYXJkcykuZWFjaChmdW5jdGlvbihpLCBvYmopIHtcbiAgICAgICQoJzxpbWcvPicpXG4gICAgICAgIC5hdHRyKCdzcmMnLCBvYmouc3JjKVxuICAgICAgICAubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICRncmlkLmlzb3RvcGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYXJkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNhcmRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtaXRlbScpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLmZsaWNraXR5SW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkZ3JpZCA9ICQoc2VsZi5ncmlkKTtcbiAgICB2YXIgY2FyZHMgPSBzZWxmLmNhcmRzO1xuICAgIHZhciBjb3VudGVyID0gc2VsZi5jb3VudGVyO1xuICAgIHZhciBmbGlja2l0eUV4aXN0cyA9ICRncmlkLmZsaWNraXR5O1xuICAgIGNvdW50ZXIuY2xhc3NMaXN0LnJlbW92ZSgndGh1ZCcpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb3VudGVyLmNsYXNzTGlzdC5hZGQoJ3RodWQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZm9yICh2YXIgbSA9IDAsIG1sID0gY2FyZHMubGVuZ3RoOyBtIDwgbWw7IG0rKykge1xuICAgICAgdmFyIGZsaWNraXR5Q2FyZCA9IGNhcmRzW21dO1xuICAgICAgdmFyIGZpbHRlcnMgPSBzZWxmLmZpbHRlcnM7XG4gICAgICB2YXIgJGNoaXBzID0gc2VsZi4kY2hpcHM7XG4gICAgICB2YXIga2V5d29yZHMgPSBmbGlja2l0eUNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLWtleXdvcmRzJykuc3BsaXQoJywnKTtcbiAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICBmbGlja2l0eUNhcmQuY2xhc3NMaXN0LmFkZCgnaGlkZS1pdGVtJyk7XG4gICAgICBpZiAoZmlsdGVycy5zZWxlY3RlZCkge1xuICAgICAgICBpZiAoZmxpY2tpdHlDYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1rZXl3b3JkcycpLmluZGV4T2YoZmlsdGVycy5zZWxlY3RlZCkgPiAtMSkge1xuICAgICAgICAgIGZsaWNraXR5Q2FyZC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1pdGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbHRlcnMuY2hpcHMgPSAkY2hpcHMubWF0ZXJpYWxfY2hpcCgnZGF0YScpLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgICAgcmV0dXJuIGMudGFnO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGZMID0gZmlsdGVycy5jaGlwcy5sZW5ndGg7IGogPCBmTDsgaisrKSB7XG4gICAgICAgICAgaWYgKGtleXdvcmRzLmluZGV4T2YoZmlsdGVycy5jaGlwc1tqXSkgPiAtMSkge1xuICAgICAgICAgICAgZmxpY2tpdHlDYXJkLmNsYXNzTGlzdC5hZGQoJ2ZsaWNraXR5LWl0ZW0nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZsaWNraXR5RXhpc3RzKSB7XG4gICAgICAkZ3JpZC5mbGlja2l0eSgnZGVzdHJveScpO1xuICAgIH1cbiAgICB2YXIgJGNhcm91c2VsID0gJGdyaWQuZmxpY2tpdHkoc2V0dGluZ3MuZmxpY2tpdHkpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2FyZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgY2FyZCA9IGNhcmRzW2ldO1xuICAgICAgaWYgKGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbGlja2l0eS1pdGVtJykpIHtcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLWl0ZW0nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZsa3R5ID0gJGNhcm91c2VsLmRhdGEoJ2ZsaWNraXR5Jyk7XG4gICAgdmFyIHVwZGF0ZVN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsaWRlTnVtYmVyID0gZmxrdHkuc2VsZWN0ZWRJbmRleCArIDE7XG4gICAgICBjb3VudGVyLmlubmVySFRNTCA9IHNsaWRlTnVtYmVyICsgJy8nICsgZmxrdHkuc2xpZGVzLmxlbmd0aDtcbiAgICB9O1xuICAgICRjYXJvdXNlbC5vbignc2VsZWN0LmZsaWNraXR5JywgdXBkYXRlU3RhdHVzKTtcbiAgICB1cGRhdGVTdGF0dXMoKTtcbiAgfTtcbiAgdGhpcy5pbml0KCk7XG59O1xuIl0sImZpbGUiOiJsYS12aWV3ZXIuanMifQ==
