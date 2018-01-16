/* exported initScroller */
/* global  window, document, getComputedStyle, probPhone */
(function aboutPage() {
	'use strict';

	var panel = document.getElementById('panels');
	var pHead = document.getElementById('panel-header');
	var clouds = panel.querySelectorAll('.cloud');
	
	var docHeight = document.documentElement.clientHeight;
	var paused = false;
	var stuck = false;
	var screen = window.screen;
	var origHeadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('top'));
	var headPos = null;
	var vh = (100 / docHeight);
	var navbar = document.getElementById('la-navbar-flex');
	// var scrollHeight = document.body.scrollHeight;//  window.innerHeight
	var pausePos = 60;
	// scroll pause position
	window.onbeforeunload = function() {
		panel.style.visibility = 'hidden';
		window.scrollTo(0, 0);
	};

	/*
	 * Initiates scrolling effect
	 */
	function initScroller() {
		var l = clouds.length;
		for (var i = 0; i < l; i++) {
			if (clouds[i].getBoundingClientRect().bottom * (100 / docHeight) > 80) {
				clouds[i].classList.add('blurred');
			}
		}
		storyFade();
		window.addEventListener('scroll', storyFade);
	}
	/*
	 * Initiates meteor shower effect
	 */
	function initMeteorShower() {
		var canvass = document.querySelectorAll('.shootingstar');
		var cL = canvass.length;
		for (var i = 0; i < cL; ++i) {
			shower(canvass[i], cL);
		}
	}

	/*
	 * Triggered by scroll
	 */
	function storyFade() {
		var scrollY = window.scrollY;
		headPos = pHead.getBoundingClientRect();

		if (!paused && !stuck && origHeadTop - headPos.top > pausePos) {
			pause();
		} else if (paused) {
			var panelPos = panel.getBoundingClientRect();
			var headPosH = headPos.height;
			if (!stuck && headPos.bottom >= panelPadTop - scrollY + 40) {
				pHead.style.position = 'absolute';
				pHead.style.top = panelPadTop - headPosH - 20 + 'px';
				pHead.style.left = 0;
				pHead.classList.remove('bounce');
				stuck = true;
				// paused = false;
			} else if (headPos.top >= origHeadTop) {
				pause();
			}

			if (panelPos.height > panelPos.bottom) {
				var unblur = panel.querySelector('p.blurred');
				var blur = panel.querySelectorAll('p:not(.blurred)');
				var uPos;
				var uVh;
				var bPos;
				var bVh;
				// this should just keep one array of objects and do it own iterating but no issue
				if (blur.length) {
					blur = blur[blur.length - 1];
					bPos = blur.getBoundingClientRect();
					bVh = bPos.bottom * vh;

					if (bVh > 80) {
						blur.classList.add('blurred');
						blur = null;
						return;
					}
				} else {
					pHead.classList.add('bounce');
				}

				if (unblur) {
					uPos = unblur.getBoundingClientRect();
					uVh = uPos.bottom * vh;
					if (uVh <= 80) {
						unblur.classList.remove('blurred');
						unblur = null;
					}
				}
			}
		}

		function pause() {
			headPos = pHead.getBoundingClientRect();
			pHead.style.position = 'fixed';
			pHead.style.left = headPos.left + 'px';
			pHead.style.top = headPos.top + 'px';
			paused = true;
			stuck = false;
		}
	}

	/*
	 * Facilitate scroll experince for mobile
	 */
	function initMobileScroll() {
		var scrollKill = true;

		var sheet = document.createElement('style');
		sheet.innerHTML = '.la-about-page.probPhone .panel-header { padding-top: ' + (0.20 * screen.height) + 'px; padding-bottom: ' + (0.80 * screen.height) + 'px; will-change: padding-top,padding-bottom;}';
		document.body.appendChild(sheet);
		panel.style.paddingTop = 0;
		panel.style.marginTop = 0;

		window.addEventListener('touchstart', startMotion, false);
		window.addEventListener('scroll', preventMotion, false);
		window.addEventListener('touchmove', preventMotion, false);
		/*
		 * Initiats normal scroll
		 */
		function startMotion() {
			if (scrollKill && window.scrollY === 0) {
				pHead.classList.add('mobile-scroll');
				pHead.classList.remove('bounce');
				setTimeout(function() {
					scrollKill = false;
					navbar.style.top = '-64px';
				}, 500);
			}
		}
		/*
		 * Initiats normal scroll
		 */
		function preventMotion(event) {
			if (scrollKill) {
				window.scrollTo(0, 0);
				event.preventDefault();
				event.stopPropagation();
				// navbar.setAttribute('style','');
			} else if (window.scrollY < -10 && !scrollKill) {
				pHead.classList.add('bounce');
				pHead.classList.remove('mobile-scroll');
				navbar.style.top = '0px';
				scrollKill = true;
			}
		}
	}
	/*
	 * Init based on client
	 */
	function init() {
		if (!probPhone) {
			initScroller();
		} else if (probPhone) {
			initMobileScroll();
		}
	}

	function scrollResize() {
		window.scrollTo(0, 0);
		pHead.setAttribute('style', '');
		paused = false;
		stuck = false;
		panelPadTop = parseFloat(getComputedStyle(panel).getPropertyValue('padding-top'));
		docHeight = document.documentElement.clientHeight;
		origHeadTop = parseFloat(getComputedStyle(pHead).getPropertyValue('top'));
		storyFade();
		init();
	}
	window.addEventListener('resize', scrollResize, true);
	init();
	initMeteorShower();
})();
