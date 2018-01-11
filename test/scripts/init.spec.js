describe("Sidenav Plugin", function () {
  beforeEach(function() {
    loadFixtures('../app/includes/sidenav.html');
  });
  
  describe("Sidenav", function () {
    var normalActivator, normalSidenav;

    beforeEach(function() {
      normalActivator = $('.sidenav-trigger');
      normalSidenav = $('.sidenav');
    });

    afterEach(function() {
      if (M.Sidenav._sidenavs.length) {
        $(".button-collapse").sideNav('destroy');
      }
    });

    it("should open sidenav from left", function (done) {
      $(".button-collapse").sidenav();
      var sidenavRect = normalSidenav[0].getBoundingClientRect();
      var overlay = $($('.button-collapse')[0].M_Sidenav._overlay);
      var dragTarget = $($('.button-collapse')[0].M_Sidenav.dragTarget);

      expect(M.Sidenav._sidenavs.length).toEqual(1, 'Should initialized sidenav');
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

  });
});