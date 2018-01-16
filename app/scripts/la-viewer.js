;(function($) {

  var laViewer = function() {

    var options = {
      gridId: 'viewer-cards',
      counterId: 'viewer-counter',
      cardClass: '.viewer-item',
      viewerFilterChipsId: 'viewer-filter-chips',
      filterChipsId: 'viewer-filter-chips',
      cardChipClass: '.card-action .chip',
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

    var self = this;
    this.$el = $(this);
    this.$document = $(document);
    this.grid = document.getElementById(options.gridId);
    this.counter = document.getElementById(options.counterId);
    this.cards = this.grid.querySelectorAll(options.cardClass);
    this.viewerFilterChips = document.getElementById(options.viewerFilterChipsId);
    this.$chips = $(this.viewerFilterChips);
    this.probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) && 'ontouchstart' in document.documentElement);
    this.filters = {
      chips: []
    };

    this.init = function() {
      var cL = self.cards.length;
      var chipsStr = '';
      var filterChips = [];
      var chipsArr = [];
      var autoCompleteData = {};
      var cards = self.cards;
      var grid = self.grid;
      var $grid = $(grid);
      var $chips = self.$chips;
      for (var i = 0; i < cL; i++) {
        var cardChips = cards[i].getAttribute('data-keywords').split(',');
        var first = cardChips[0].trim().replace(/\s+/g, '-').toLowerCase();
        filterChips.push({
          tag: first,
          id: first
        });
        chipsArr = chipsArr.concat(cardChips);
      }

      var l = chipsArr.length;
      while (l--) {
        var item = chipsArr[l];
        if (!autoCompleteData[item]) {
          chipsArr.unshift(item);
          autoCompleteData[item] = true;
        }
      }

      self.$chips = self.initChips($chips, filterChips, autoCompleteData);

      $('.toggle-filter a').click(function() {
        var sheet = document.createElement('style');
        var filterHeight = self.$chips.height();
        sheet.innerHTML = '.filter-on.viewer-filter { min-height: ' + (filterHeight + 30) + 'px; will-change: min-height;}';
        document.body.appendChild(sheet);
        var filterToggles = document.querySelectorAll('.viewer-filter,.toggle-filter');
        for (var i = 0, l = filterToggles.length; i < l; i++) {
          filterToggles[i].classList.toggle('filter-on');
        }
      });

      if (this.probPhone) {
        if (this.grid.isotope) {
          $grid.isotope('destroy');
        }
        if (!$grid.flickity) {
          async(['https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js'], this.flickityInit);
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
    }
    this.initPlugin = function() {
      if (self.probPhone) {
        self.flickityInit();
      } else if (!this.probPhone) {
        $(self.grid).isotope();
      }
    }

    this.initChips = function($chips, filterChips, autoCompleteData) {

      var filters = self.filters;
      $chips.material_chip({
        data: filterChips,
        placeholder: '...',
        autocompleteOptions: {
          data: autoCompleteData,
          limit: Infinity,
          minLength: 1
        }
      });
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
      $chips.on('chip.add', this.whichPlugin);
      $chips.on('chip.delete', function(chip) {
        if (filters.selected === chip.tag) {
          filters.selected = null;
        }
        self.initPlugin();
      });
      return $chips;
    }
    this.isotopeInit = function() {
      var $chips = self.$chips;
      var filters = self.filters;
      var $grid = $(self.grid);
      var cards = self.cards;
      var isotopeOptions = options.isotope;

      var chipFilter = function() {
        var keywords = this.getAttribute('data-keywords').split(',');
        var isMatched = true;
        if (filters.selected) {
          isMatched = keywords.indexOf(filters.selected) > -1;
        } else {
          filters.chips = $chips.material_chip('data').map(function(c) {
            return c.tag;
          });
          for (var i = 0; i < filters.chips.length; i++) {
            if (keywords.indexOf(filters.chips[i]) > -1) {
              return true;
            }
          }
          return false;
        }
        return isMatched;
      };
      isotopeOptions.filter = chipFilter;

      $grid.isotope(isotopeOptions);
      
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
    }
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

      for (var i = 0, l = cards.length; i < l; i++) {
        var card = cards[i];
        var filters = self.filters;
        var $chips = self.$chips;
        var keywords = card.getAttribute('data-keywords').split(',');
        card.classList.remove('flickity-item');
        card.classList.add('hide-item');
        if (filters.selected) {
          if (card.getAttribute('data-keywords').indexOf(filters.selected) > -1) {
            card.classList.add('flickity-item');
          }
        } else {
          filters.chips = $chips.material_chip('data').map(function(c) {
            return c.tag;
          });
          for (var j = 0, fL = filters.chips.length; j < fL; j++) {
            if (keywords.indexOf(filters.chips[j]) > -1) {
              card.classList.add('flickity-item');
            }
          }
        }
      }
      if (flickityExists) {
        $grid.flickity('destroy');
      }
      var $carousel = $grid.flickity(options.flickity);
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
    }
    this.init();
  };
  $(function() {
    var viewer = new laViewer();
    $('.info-spot').click(function() {
      $('.tap-target').tapTarget('open');
    });
  });
})(jQuery);
