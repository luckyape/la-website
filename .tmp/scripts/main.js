/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
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
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICpcbiAqICBXZWIgU3RhcnRlciBLaXRcbiAqICBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwczovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlXG4gKlxuICovXG4vKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIENoZWNrIHRvIG1ha2Ugc3VyZSBzZXJ2aWNlIHdvcmtlcnMgYXJlIHN1cHBvcnRlZCBpbiB0aGUgY3VycmVudCBicm93c2VyLFxuXHQvLyBhbmQgdGhhdCB0aGUgY3VycmVudCBwYWdlIGlzIGFjY2Vzc2VkIGZyb20gYSBzZWN1cmUgb3JpZ2luLiBVc2luZyBhXG5cdC8vIHNlcnZpY2Ugd29ya2VyIGZyb20gYW4gaW5zZWN1cmUgb3JpZ2luIHdpbGwgdHJpZ2dlciBKUyBjb25zb2xlIGVycm9ycy4gU2VlXG5cdC8vIGh0dHA6Ly93d3cuY2hyb21pdW0ub3JnL0hvbWUvY2hyb21pdW0tc2VjdXJpdHkvcHJlZmVyLXNlY3VyZS1vcmlnaW5zLWZvci1wb3dlcmZ1bC1uZXctZmVhdHVyZXNcblx0dmFyIGlzTG9jYWxob3N0ID0gQm9vbGVhbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09ICdsb2NhbGhvc3QnIHx8XG5cdFx0Ly8gWzo6MV0gaXMgdGhlIElQdjYgbG9jYWxob3N0IGFkZHJlc3MuXG5cdFx0d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnWzo6MV0nIHx8XG5cdFx0Ly8gMTI3LjAuMC4xLzggaXMgY29uc2lkZXJlZCBsb2NhbGhvc3QgZm9yIElQdjQuXG5cdFx0d2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLm1hdGNoKFxuXHRcdFx0L14xMjcoPzpcXC4oPzoyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pKXszfSQvXG5cdFx0KVxuXHQpO1xuXG5cdGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yICYmXG5cdFx0KHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgfHwgaXNMb2NhbGhvc3QpKSB7XG5cdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJ3NlcnZpY2Utd29ya2VyLmpzJylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlZ2lzdHJhdGlvbikge1xuXHRcdFx0XHQvLyB1cGRhdGVmb3VuZCBpcyBmaXJlZCBpZiBzZXJ2aWNlLXdvcmtlci5qcyBjaGFuZ2VzLlxuXHRcdFx0XHRyZWdpc3RyYXRpb24ub251cGRhdGVmb3VuZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIHVwZGF0ZWZvdW5kIGlzIGFsc28gZmlyZWQgdGhlIHZlcnkgZmlyc3QgdGltZSB0aGUgU1cgaXMgaW5zdGFsbGVkLFxuXHRcdFx0XHRcdC8vIGFuZCB0aGVyZSdzIG5vIG5lZWQgdG8gcHJvbXB0IGZvciBhIHJlbG9hZCBhdCB0aGF0IHBvaW50LlxuXHRcdFx0XHRcdC8vIFNvIGNoZWNrIGhlcmUgdG8gc2VlIGlmIHRoZSBwYWdlIGlzIGFscmVhZHkgY29udHJvbGxlZCxcblx0XHRcdFx0XHQvLyBpLmUuIHdoZXRoZXIgdGhlcmUncyBhbiBleGlzdGluZyBzZXJ2aWNlIHdvcmtlci5cblx0XHRcdFx0XHRpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHVwZGF0ZWZvdW5kIGV2ZW50IGltcGxpZXMgdGhhdCByZWdpc3RyYXRpb24uaW5zdGFsbGluZyBpcyBzZXQ6XG5cdFx0XHRcdFx0XHQvLyBodHRwczovL3NsaWdodGx5b2ZmLmdpdGh1Yi5pby9TZXJ2aWNlV29ya2VyL3NwZWMvc2VydmljZV93b3JrZXIvaW5kZXguaHRtbCNzZXJ2aWNlLXdvcmtlci1jb250YWluZXItdXBkYXRlZm91bmQtZXZlbnRcblx0XHRcdFx0XHRcdHZhciBpbnN0YWxsaW5nV29ya2VyID0gcmVnaXN0cmF0aW9uLmluc3RhbGxpbmc7XG5cblx0XHRcdFx0XHRcdGluc3RhbGxpbmdXb3JrZXIub25zdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRzd2l0Y2ggKGluc3RhbGxpbmdXb3JrZXIuc3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdpbnN0YWxsZWQnOlxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQXQgdGhpcyBwb2ludCwgdGhlIG9sZCBjb250ZW50IHdpbGwgaGF2ZSBiZWVuIHB1cmdlZCBhbmQgdGhlXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBmcmVzaCBjb250ZW50IHdpbGwgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBjYWNoZS5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIEl0J3MgdGhlIHBlcmZlY3QgdGltZSB0byBkaXNwbGF5IGEgXCJOZXcgY29udGVudCBpc1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gYXZhaWxhYmxlOyBwbGVhc2UgcmVmcmVzaC5cIiBtZXNzYWdlIGluIHRoZSBwYWdlJ3MgaW50ZXJmYWNlLlxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0XHRjYXNlICdyZWR1bmRhbnQnOlxuXHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdUaGUgaW5zdGFsbGluZyAnICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlcnZpY2Ugd29ya2VyIGJlY2FtZSByZWR1bmRhbnQuJyk7XG5cblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gSWdub3JlXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBkdXJpbmcgc2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uOicsIGUpO1xuXHRcdFx0fSk7XG5cdH1cbn0pO1xuIl0sImZpbGUiOiJtYWluLmpzIn0=
