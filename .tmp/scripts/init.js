(function($) {
		$(function() {
			var $contWrap = $('#la-content-wrapper');
			$('.button-collapse').sideNav({
				onOpen: function(el) {
					setTimeout(function() {
						Materialize.showStaggeredList('#nav-mobile');
					}, 50);
					$contWrap.addClass('la-blur');
				},
				onClose: function(el) {
					$('li', el).css({
						opacity: 0
					})
					$contWrap.removeClass('la-blur');
				}
			});
			$navbar = $('#la-navbar-flex');
			$(window).on('scroll', function() {
				var y_scroll_pos = window.pageYOffset;
				if (y_scroll_pos > 350 && !$navbar.hasClass('navbar-fixed')) {
					$navbar.removeClass('reveal');
					$navbar.addClass('navbar-fixed');
					setTimeout(function() {
						$navbar.addClass('reveal');
					}, 300);
				}
				if (y_scroll_pos < 20) {
					$navbar.removeClass('navbar-fixed');
					$navbar.addClass('reveal');
				}
			});
		
			var canvass = document.querySelectorAll('.shootingstar'),
				cL = canvass.length;
			
			for (i = 0; i < cL; ++i) {
				shower(canvass[i], cL);
			}
			setTimeout(function() { pHead.classList.remove('zoom');},1000)
			
			
			// end of document ready
		})
	})(jQuery); // end of jQuery name space


	var probPhone = ((/iphone|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase()) && 'ontouchstart' in document.documentElement);
	var $navbar = {};


	function loadContactInfo() {
		$navbar.removeClass('navbar-fixed');		
		var contactMethods = document.getElementById('contact-methods');
		contactMethods.innerHTML = atob('PGEgaHJlZj0ic21zOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0ic21zLWxpbmsgaWNvbiBpY29uLWNoYXQgaWNvbi1jaGF0LWRpbXMiPlNNUzxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPjxhIGhyZWY9Im1haWx0bzppbmZvQGx1Y2t5YXBlLmNvbT9zdWJqZWN0PSU1QldXVyUyMElucXVpcmUlNUQiIGNsYXNzPSJpY29uIGljb24tZW52ZWxvcGUgaWNvbi1lbnZlbG9wZS1kaW1zIj5FbWFpbDxkaXY+aW5mb0BsdWNreWFwZS5jb208L2Rpdj48L2E+PGEgaHJlZj0idGVsOjEtNjA0LTM0MC03OTI1IiBjbGFzcz0iaWNvbiBpY29uLXBob25lLWNhbGwgaWNvbi1waG9uZS1jYWxsLWRpbXMiPlRlbDxkaXY+NjA0LTM0MC03OTI1PC9kaXY+PC9hPg==');
		if (0 && !probPhone) {
			var smsLink = document.querySelector('.sms-link');
			document.querySelector('.contact-methods').removeChild(smsLink);
		};
	}
	function draw(canvas) {
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			ctx.lineWidth = .8;
			ctx.lineCap = 'round';

			var tailW = canvas.width,
				tailH = canvas.height,
				i = 0,
				s = tailW / tailH,
				clear = function() {

					ctx.clearRect(0, 0, tailW, tailH);

				},
				tail = function() {
					clear();
					ctx.beginPath();
					ctx.moveTo(i * s, i);
					ctx.lineTo(tailW, tailH);
					ctx.stroke();
					if (i < tailH) {
						setTimeout(tail, 0);
					}					
					i = i + 2;
				},
				meteor = function () {
					clear();
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(i * s, i);
					ctx.stroke();
					if (i < tailH) {
						setTimeout(meteor, 0);
					} else {
						ctx.lineWidth = .75;
						ctx.strokeStyle = 'rgba(255, 255, 255, .8)';
						i = 0;
						setTimeout(tail, 100);
					}
					i++;

				};

			meteor();
		
		}
	}
	function shower(canvas, cL) {
		var small = (probPhone)? .6 : 1,
			rN = ((Math.random()/2) * small ) + .5,
			rotate = Math.random() * Math.PI * 2 * 25,
			s =  Math.random() * Math.floor(Math.random() * cL) + 1,
			delay = Math.random() * 4000 * s,
			x = (screen.width * Math.random())/ screen.width * 100,
			y = (screen.height * Math.random()) / screen.height * 80;
		if(y > 60) {
			rN = rN * .6
		}
		var transform = ' translate('+ x +'vw, ' + y + 'vh) scale(' + rN + ') rotate(' + rotate + 'deg)';
		
		canvas.style.transform = transform;

		draw(canvas);
		setTimeout(function() { shower(canvas, cL); 	canvas.style.display = 'block'; }, delay);
	}

	
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG5cdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkY29udFdyYXAgPSAkKCcjbGEtY29udGVudC13cmFwcGVyJyk7XG5cdFx0XHQkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG5cdFx0XHRcdG9uT3BlbjogZnVuY3Rpb24oZWwpIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0TWF0ZXJpYWxpemUuc2hvd1N0YWdnZXJlZExpc3QoJyNuYXYtbW9iaWxlJyk7XG5cdFx0XHRcdFx0fSwgNTApO1xuXHRcdFx0XHRcdCRjb250V3JhcC5hZGRDbGFzcygnbGEtYmx1cicpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRvbkNsb3NlOiBmdW5jdGlvbihlbCkge1xuXHRcdFx0XHRcdCQoJ2xpJywgZWwpLmNzcyh7XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQkY29udFdyYXAucmVtb3ZlQ2xhc3MoJ2xhLWJsdXInKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkbmF2YmFyID0gJCgnI2xhLW5hdmJhci1mbGV4Jyk7XG5cdFx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgeV9zY3JvbGxfcG9zID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdFx0XHRpZiAoeV9zY3JvbGxfcG9zID4gMzUwICYmICEkbmF2YmFyLmhhc0NsYXNzKCduYXZiYXItZml4ZWQnKSkge1xuXHRcdFx0XHRcdCRuYXZiYXIucmVtb3ZlQ2xhc3MoJ3JldmVhbCcpO1xuXHRcdFx0XHRcdCRuYXZiYXIuYWRkQ2xhc3MoJ25hdmJhci1maXhlZCcpO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkbmF2YmFyLmFkZENsYXNzKCdyZXZlYWwnKTtcblx0XHRcdFx0XHR9LCAzMDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh5X3Njcm9sbF9wb3MgPCAyMCkge1xuXHRcdFx0XHRcdCRuYXZiYXIucmVtb3ZlQ2xhc3MoJ25hdmJhci1maXhlZCcpO1xuXHRcdFx0XHRcdCRuYXZiYXIuYWRkQ2xhc3MoJ3JldmVhbCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcblx0XHRcdHZhciBjYW52YXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNob290aW5nc3RhcicpLFxuXHRcdFx0XHRjTCA9IGNhbnZhc3MubGVuZ3RoO1xuXHRcdFx0XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgY0w7ICsraSkge1xuXHRcdFx0XHRzaG93ZXIoY2FudmFzc1tpXSwgY0wpO1xuXHRcdFx0fVxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHsgcEhlYWQuY2xhc3NMaXN0LnJlbW92ZSgnem9vbScpO30sMTAwMClcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvLyBlbmQgb2YgZG9jdW1lbnQgcmVhZHlcblx0XHR9KVxuXHR9KShqUXVlcnkpOyAvLyBlbmQgb2YgalF1ZXJ5IG5hbWUgc3BhY2VcblxuXG5cdHZhciBwcm9iUGhvbmUgPSAoKC9pcGhvbmV8YW5kcm9pZHxpZXxibGFja2JlcnJ5fGZlbm5lYy8pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuXHR2YXIgJG5hdmJhciA9IHt9O1xuXG5cblx0ZnVuY3Rpb24gbG9hZENvbnRhY3RJbmZvKCkge1xuXHRcdCRuYXZiYXIucmVtb3ZlQ2xhc3MoJ25hdmJhci1maXhlZCcpO1x0XHRcblx0XHR2YXIgY29udGFjdE1ldGhvZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1tZXRob2RzJyk7XG5cdFx0Y29udGFjdE1ldGhvZHMuaW5uZXJIVE1MID0gYXRvYignUEdFZ2FISmxaajBpYzIxek9qRXROakEwTFRNME1DMDNPVEkxSWlCamJHRnpjejBpYzIxekxXeHBibXNnYVdOdmJpQnBZMjl1TFdOb1lYUWdhV052YmkxamFHRjBMV1JwYlhNaVBsTk5VenhrYVhZK05qQTBMVE0wTUMwM09USTFQQzlrYVhZK1BDOWhQanhoSUdoeVpXWTlJbTFoYVd4MGJ6cHBibVp2UUd4MVkydDVZWEJsTG1OdmJUOXpkV0pxWldOMFBTVTFRbGRYVnlVeU1FbHVjWFZwY21VbE5VUWlJR05zWVhOelBTSnBZMjl1SUdsamIyNHRaVzUyWld4dmNHVWdhV052YmkxbGJuWmxiRzl3WlMxa2FXMXpJajVGYldGcGJEeGthWFkrYVc1bWIwQnNkV05yZVdGd1pTNWpiMjA4TDJScGRqNDhMMkUrUEdFZ2FISmxaajBpZEdWc09qRXROakEwTFRNME1DMDNPVEkxSWlCamJHRnpjejBpYVdOdmJpQnBZMjl1TFhCb2IyNWxMV05oYkd3Z2FXTnZiaTF3YUc5dVpTMWpZV3hzTFdScGJYTWlQbFJsYkR4a2FYWStOakEwTFRNME1DMDNPVEkxUEM5a2FYWStQQzloUGc9PScpO1xuXHRcdGlmICgwICYmICFwcm9iUGhvbmUpIHtcblx0XHRcdHZhciBzbXNMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNtcy1saW5rJyk7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFjdC1tZXRob2RzJykucmVtb3ZlQ2hpbGQoc21zTGluayk7XG5cdFx0fTtcblx0fVxuXHRmdW5jdGlvbiBkcmF3KGNhbnZhcykge1xuXHRcdGlmIChjYW52YXMuZ2V0Q29udGV4dCkge1xuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IC44O1xuXHRcdFx0Y3R4LmxpbmVDYXAgPSAncm91bmQnO1xuXG5cdFx0XHR2YXIgdGFpbFcgPSBjYW52YXMud2lkdGgsXG5cdFx0XHRcdHRhaWxIID0gY2FudmFzLmhlaWdodCxcblx0XHRcdFx0aSA9IDAsXG5cdFx0XHRcdHMgPSB0YWlsVyAvIHRhaWxILFxuXHRcdFx0XHRjbGVhciA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0Y3R4LmNsZWFyUmVjdCgwLCAwLCB0YWlsVywgdGFpbEgpO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRhaWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjbGVhcigpO1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKGkgKiBzLCBpKTtcblx0XHRcdFx0XHRjdHgubGluZVRvKHRhaWxXLCB0YWlsSCk7XG5cdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdGlmIChpIDwgdGFpbEgpIHtcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQodGFpbCwgMCk7XG5cdFx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdFx0XHRpID0gaSArIDI7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1ldGVvciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjbGVhcigpO1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKDAsIDApO1xuXHRcdFx0XHRcdGN0eC5saW5lVG8oaSAqIHMsIGkpO1xuXHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHRpZiAoaSA8IHRhaWxIKSB7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KG1ldGVvciwgMCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSAuNzU7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAuOCknO1xuXHRcdFx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KHRhaWwsIDEwMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkrKztcblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRtZXRlb3IoKTtcblx0XHRcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gc2hvd2VyKGNhbnZhcywgY0wpIHtcblx0XHR2YXIgc21hbGwgPSAocHJvYlBob25lKT8gLjYgOiAxLFxuXHRcdFx0ck4gPSAoKE1hdGgucmFuZG9tKCkvMikgKiBzbWFsbCApICsgLjUsXG5cdFx0XHRyb3RhdGUgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDIgKiAyNSxcblx0XHRcdHMgPSAgTWF0aC5yYW5kb20oKSAqIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNMKSArIDEsXG5cdFx0XHRkZWxheSA9IE1hdGgucmFuZG9tKCkgKiA0MDAwICogcyxcblx0XHRcdHggPSAoc2NyZWVuLndpZHRoICogTWF0aC5yYW5kb20oKSkvIHNjcmVlbi53aWR0aCAqIDEwMCxcblx0XHRcdHkgPSAoc2NyZWVuLmhlaWdodCAqIE1hdGgucmFuZG9tKCkpIC8gc2NyZWVuLmhlaWdodCAqIDgwO1xuXHRcdGlmKHkgPiA2MCkge1xuXHRcdFx0ck4gPSByTiAqIC42XG5cdFx0fVxuXHRcdHZhciB0cmFuc2Zvcm0gPSAnIHRyYW5zbGF0ZSgnKyB4ICsndncsICcgKyB5ICsgJ3ZoKSBzY2FsZSgnICsgck4gKyAnKSByb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJztcblx0XHRcblx0XHRjYW52YXMuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXG5cdFx0ZHJhdyhjYW52YXMpO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNob3dlcihjYW52YXMsIGNMKTsgXHRjYW52YXMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IH0sIGRlbGF5KTtcblx0fVxuXG5cdCJdLCJmaWxlIjoiaW5pdC5qcyJ9
