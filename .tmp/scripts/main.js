/* eslint-env browser */
(function main() {
  'use strict';
  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                  // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
  }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuKGZ1bmN0aW9uIG1haW4oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHNlcnZpY2Ugd29ya2VycyBhcmUgc3VwcG9ydGVkIGluIHRoZSBjdXJyZW50IGJyb3dzZXIsXG4gIC8vIGFuZCB0aGF0IHRoZSBjdXJyZW50IHBhZ2UgaXMgYWNjZXNzZWQgZnJvbSBhIHNlY3VyZSBvcmlnaW4uIFVzaW5nIGFcbiAgLy8gc2VydmljZSB3b3JrZXIgZnJvbSBhbiBpbnNlY3VyZSBvcmlnaW4gd2lsbCB0cmlnZ2VyIEpTIGNvbnNvbGUgZXJyb3JzLiBTZWVcbiAgLy8gaHR0cDovL3d3dy5jaHJvbWl1bS5vcmcvSG9tZS9jaHJvbWl1bS1zZWN1cml0eS9wcmVmZXItc2VjdXJlLW9yaWdpbnMtZm9yLXBvd2VyZnVsLW5ldy1mZWF0dXJlc1xuICB2YXIgaXNMb2NhbGhvc3QgPSBCb29sZWFuKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgfHxcbiAgICAvLyBbOjoxXSBpcyB0aGUgSVB2NiBsb2NhbGhvc3QgYWRkcmVzcy5cbiAgICB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdbOjoxXScgfHxcbiAgICAvLyAxMjcuMC4wLjEvOCBpcyBjb25zaWRlcmVkIGxvY2FsaG9zdCBmb3IgSVB2NC5cbiAgICB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUubWF0Y2goXG4gICAgICAvXjEyNyg/OlxcLig/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPykpezN9JC9cbiAgICApXG4gICk7XG5cbiAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IgJiZcbiAgICAod2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cHM6JyB8fCBpc0xvY2FsaG9zdCkpIHtcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3Rlcignc2VydmljZS13b3JrZXIuanMnKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgIC8vIHVwZGF0ZWZvdW5kIGlzIGZpcmVkIGlmIHNlcnZpY2Utd29ya2VyLmpzIGNoYW5nZXMuXG4gICAgICAgIHJlZ2lzdHJhdGlvbi5vbnVwZGF0ZWZvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gdXBkYXRlZm91bmQgaXMgYWxzbyBmaXJlZCB0aGUgdmVyeSBmaXJzdCB0aW1lIHRoZSBTVyBpcyBpbnN0YWxsZWQsXG4gICAgICAgICAgLy8gYW5kIHRoZXJlJ3Mgbm8gbmVlZCB0byBwcm9tcHQgZm9yIGEgcmVsb2FkIGF0IHRoYXQgcG9pbnQuXG4gICAgICAgICAgLy8gU28gY2hlY2sgaGVyZSB0byBzZWUgaWYgdGhlIHBhZ2UgaXMgYWxyZWFkeSBjb250cm9sbGVkLFxuICAgICAgICAgIC8vIGkuZS4gd2hldGhlciB0aGVyZSdzIGFuIGV4aXN0aW5nIHNlcnZpY2Ugd29ya2VyLlxuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXBkYXRlZm91bmQgZXZlbnQgaW1wbGllcyB0aGF0IHJlZ2lzdHJhdGlvbi5pbnN0YWxsaW5nIGlzIHNldDpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vc2xpZ2h0bHlvZmYuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvc3BlYy9zZXJ2aWNlX3dvcmtlci9pbmRleC5odG1sI3NlcnZpY2Utd29ya2VyLWNvbnRhaW5lci11cGRhdGVmb3VuZC1ldmVudFxuICAgICAgICAgICAgdmFyIGluc3RhbGxpbmdXb3JrZXIgPSByZWdpc3RyYXRpb24uaW5zdGFsbGluZztcblxuICAgICAgICAgICAgaW5zdGFsbGluZ1dvcmtlci5vbnN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHN3aXRjaCAoaW5zdGFsbGluZ1dvcmtlci5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2luc3RhbGxlZCc6XG4gICAgICAgICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgb2xkIGNvbnRlbnQgd2lsbCBoYXZlIGJlZW4gcHVyZ2VkIGFuZCB0aGVcbiAgICAgICAgICAgICAgICAgIC8vIGZyZXNoIGNvbnRlbnQgd2lsbCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGNhY2hlLlxuICAgICAgICAgICAgICAgICAgLy8gSXQncyB0aGUgcGVyZmVjdCB0aW1lIHRvIGRpc3BsYXkgYSBcIk5ldyBjb250ZW50IGlzXG4gICAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGU7IHBsZWFzZSByZWZyZXNoLlwiIG1lc3NhZ2UgaW4gdGhlIHBhZ2UncyBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3JlZHVuZGFudCc6XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBpbnN0YWxsaW5nICcgK1xuICAgICAgICAgICAgICAgICAgICAnc2VydmljZSB3b3JrZXIgYmVjYW1lIHJlZHVuZGFudC4nKTtcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAvLyBJZ25vcmVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmluZyBzZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb246JywgZSk7XG4gICAgICB9KTtcbiAgfVxufSkoKTtcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
