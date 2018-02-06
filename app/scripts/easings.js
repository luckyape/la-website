/*
t = current time
b = start value
c = change in value
d = duration


Sinusoidal - multiplier of 1 (super light object, like a feather)
Quadratic - multiplier of 2
Cubic - multiplier of 3
Quartic - multiplier of 4
Quintic - multiplier of 5
Circular - multiplier of 6
Exponential - multiplier of 10 (super heavy object, like a truck)


*/


Math.linearTween = function (t, b, c, d) {
	return c*t/d + b;
};
// quadratic easing in - accelerating from zero velocity
Math.easeInQuad = function (t, b, c, d) {
	t /= d;
	return c*t*t + b;
};
// quadratic easing out - decelerating to zero velocity
Math.easeOutQuad = function(t, b, c, d) {
	t /= d;
	return -c * t * (t - 2) + b;
};

// cubic easing in - accelerating from zero velocity
Math.easeInCubic = function(t, b, c, d) {
	t /= d;
	return c * t * t * t + b;
};
// cubic easing out - decelerating to zero velocity
Math.easeOutCubic = function(t, b, c, d) {
	t /= d;
	t--;
	return c * (t * t * t + 1) + b;
};
// cubic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutCubic = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t * t + b;
	t -= 2;
	return c / 2 * (t * t * t + 2) + b;
};
// quartic easing in - accelerating from zero velocity
Math.easeInQuart = function(t, b, c, d) {
	t /= d;
	return c * t * t * t * t + b;
};
// quartic easing out - decelerating to zero velocity
Math.easeOutQuart = function(t, b, c, d) {
	t /= d;
	t--;
	return -c * (t * t * t * t - 1) + b;
};
// quartic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuart = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t * t * t + b;
	t -= 2;
	return -c / 2 * (t * t * t * t - 2) + b;
};
// quintic easing in - accelerating from zero velocity
Math.easeInQuint = function(t, b, c, d) {
	t /= d;
	return c * t * t * t * t * t + b;
};
// quintic easing out - decelerating to zero velocity
Math.easeOutQuint = function(t, b, c, d) {
	t /= d;
	t--;
	return c * (t * t * t * t * t + 1) + b;
};
// quintic easing in/out - acceleration until halfway, then deceleration
Math.easeInOutQuint = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t * t * t * t + b;
	t -= 2;
	return c / 2 * (t * t * t * t * t + 2) + b;
};
// sinusoidal easing in - accelerating from zero velocity
Math.easeInSine = function(t, b, c, d) {
	return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};
// sinusoidal easing out - decelerating to zero velocity
Math.easeOutSine = function(t, b, c, d) {
	return c * Math.sin(t / d * (Math.PI / 2)) + b;
};
// sinusoidal easing in/out - accelerating until halfway, then decelerating
Math.easeInOutSine = function(t, b, c, d) {
	return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};
// exponential easing in - accelerating from zero velocity
Math.easeInExpo = function(t, b, c, d) {
	return c * Math.pow(2, 10 * (t / d - 1)) + b;
};
// exponential easing out - decelerating to zero velocity
Math.easeOutExpo = function(t, b, c, d) {
	return c * (-Math.pow(2, -10 * t / d) + 1) + b;
};
// exponential easing in/out - accelerating until halfway, then decelerating
Math.easeInOutExpo = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	t--;
	return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};
// circular easing in - accelerating from zero velocity
Math.easeInCirc = function(t, b, c, d) {
	t /= d;
	return -c * (Math.sqrt(1 - t * t) - 1) + b;
};// circular easing out - decelerating to zero velocity
Math.easeOutCirc = function(t, b, c, d) {
	t /= d;
	t--;
	return c * Math.sqrt(1 - t * t) + b;
};// circular easing in/out - acceleration until halfway, then deceleration
Math.easeInOutCirc = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	t -= 2;
	return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
};
Math.easeOutBounce = function ( t, b, c, d) {
		var g = 7.5625;
		if ((t/=d) < (1/2.75)) {
			return c*(g*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(g*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(g*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(g*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}


Math.easeInOutElastic = function ( t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	}

Math.easeInOutBack = function ( t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}


