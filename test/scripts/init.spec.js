describe("Sidenav Plugin", function () {
  beforeEach(function() {
    loadFixtures('sidenav/sidenavFixture.html');
  }); 

  describe("Sidenav", function () {
    var normalActivator, normalSidenav;

    beforeEach(function() {
      normalActivator = $('.sidenav-trigger');
      normalSidenav = $('.sidenav');
    });

    afterEach(function() {
      if (M.Sidenav._sidenavs.length) {
        $(".button-collapse").sidenav('destroy');
      }
    });

    it("should not break from multiple initializations", function() {
      expect(M.Sidenav._sidenavs.length).toEqual(0, 'no sidenavs initialized');

      $(".button-collapse").sidenav();
      $(".button-collapse").sidenav();
      $(".button-collapse").sidenav();

      expect(M.Sidenav._sidenavs.length).toEqual(1, 'only 1 sidenav initialized after multiple calls on the same element');

      var dragTarget = $($('.button-collapse')[0].M_Sidenav.dragTarget);
      expect(dragTarget.length).toEqual(1, 'Should generate only one dragTarget.');

      var overlay = $($('.button-collapse')[0].M_Sidenav._overlay);
      expect(overlay.length).toEqual(1, 'Should generate only one overlay.');
    });

    it("should open sidenav from left", function (done) {
      $(".button-collapse").sidenav();
      var sidenavRect = normalSidenav[0].getBoundingClientRect();
      var overlay = $($('.button-collapse')[0].M_Sidenav._overlay);
      var dragTarget = $($('.button-collapse')[0].M_Sidenav.dragTarget);

      expect(dragTarget.length).toEqual(1, 'Should generate only one dragTarget.');
      expect(overlay.length).toEqual(1, 'Should generate only one overlay.');
      expect(sidenavRect.left).toEqual(-sidenavRect.width * 1.05, 'Should be hidden before sidenav is opened.');

      click(normalActivator[0]);

      setTimeout(function() {
        sidenavRect = normalSidenav[0].getBoundingClientRect();
        expect(sidenavRect.left).toEqual(0, 'Should be shown after sidenav is closed.');

        click(overlay[0]);

        done();
      }, 500);
    });

    it("should have working callbacks", function (done) {
      var openStart = false;
      var openEnd = false;
      var closeStart = false;
      var closeEnd = false;

      $(".button-collapse").sidenav({
        onOpenStart: function() {
          openStart = true;
        },
        onOpenEnd: function() {
          openEnd = true;
        },
        onCloseStart: function() {
          closeStart = true;
        },
        onCloseEnd: function() {
          closeEnd = true;
        }
      });
      var overlay = $($('.button-collapse')[0].M_Sidenav._overlay);

      click(normalActivator[0]);

      expect(openStart).toEqual(true, 'Open start should fire immediately after open');
      expect(openEnd).toEqual(false, 'Open end should not fire immediately after open');

      setTimeout(function() {
        expect(openEnd).toEqual(true, 'Open end should fire after open animation');

        click(overlay[0]);

        expect(closeStart).toEqual(true, 'Close start should fire immediately after close');
        expect(closeEnd).toEqual(false, 'Close end should not fire immediately after close');

        setTimeout(function() {
          expect(closeEnd).toEqual(true, 'Close end should fire after close animation');

          done();
        }, 400);
      }, 400);
    });

    it("should destroy correctly", function (done) {
      expect(M.Sidenav._sidenavs.length).toEqual(0, 'no sidenavs initialized');
      $(".button-collapse").sidenav();
      var overlay = $($('.button-collapse')[0].M_Sidenav._overlay);
      var dragTarget = $($('.button-collapse')[0].M_Sidenav.dragTarget);
      expect(M.Sidenav._sidenavs.length).toEqual(1, 'one sidenav initialized');
      expect($.contains(document, overlay[0])).toEqual(true, 'overlay should be in DOM');
      expect($.contains(document, dragTarget[0])).toEqual(true, 'dragTarget should be in DOM');
      $(".button-collapse").sidenav('destroy');


      setTimeout(function() {
        expect(M.Sidenav._sidenavs.length).toEqual(0, 'sidenav destroyed');
        expect($.contains(document, overlay[0])).toEqual(false, 'overlay should be deleted');
        expect($.contains(document, dragTarget[0])).toEqual(false, 'dragTarget should be deleted');
        done();
      }, 100);
    });
  });
});