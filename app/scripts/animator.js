class Animator {

	constructor(options) {
		var jobs = Object.keys(options.jobs);
		var jL = jobs.length;
		this.jobs = jobs;
		this.jL = jL;
		this.tasks = new Array(jL);
		this.reversedAt = new Array(jL);
		this.tLs = new Array(jL);
		this.elems = [];
		this.props = [];
		this.jobElemProps = new Array(jL);
		this.propVals = new Array(jL);
		this.needDeltas = [];
		this.pauseOffsets = new Array(jL);
		this.complete = new Array(jL);
		this.paused = new Array(jL);
		this.transformFuncs = ['rotate', 'translateX', 'translateY', 'scaleX', 'scaleY', 'skewX', 'skewY'];
		this.tFL = this.transformFuncs.length;
		for (var i = 0; i < jL; i++) {
			var job = jobs[i];
			var tasks = options.jobs[job];
			this.prepareTasks(tasks, i);
		}
		debugger;
		if (options.autostart) {
			this.start(jobs);
		}
	}
	prepareTasks(tasks, jobIndex) {

		var taskProps = [];
		var tL = tasks.length;
		this.props[jobIndex] = [];
		this.needDeltas[jobIndex] = [];
		this.tLs[jobIndex] = tL;
		for (var i = 0; i < tL; i++) {
			/*
			 * Reverse sort styles so we can use
			 * manage completed tasks later
			 */
			var task = tasks[i];
			var settings = task.settings;
			var sL = task.sL || settings.length;
			task.sL = sL;
			if (!task.elem) {
				task.elem = document.getElementById(task.elemId);
			}
			if (this.isElement(task.elem)) {
				if (settings.constructor === Array && settings[0]) {
					// settings.sort(this.orderSettingStarts);
					/*
					 *
					 * /
					for (var j = 0; j < sL; j++) {
						/*
						 * Determine when task starts, the smallest setting value of s
						 * /
						var s = settings[j].s;
						if (s === parseInt(s, 10)) {
							if (task.s === undefined || task.s > s) {
								task.s = s;
							}
						} else {
							throw 's needs to be an integer';
						}
					}
					/*
					 * sort settings in reverse order so last to finish is first
					 */
					settings.sort(this.reverseOrderSettingCompletion);
				} else {
					console.log('No settings provided for task ' + task.name);
				}
			} else {
				throw 'DOM Element (elem) or Element Id (elemId) required.';
			}
		}
		/*
		 *  order tasks so the first in the index finishes last
		 */
		tasks.sort(this.reverseOrderTaskStarts);
		var taskElemProps = [];
		for (var i = 0; i < tL; i++) {
			var task = tasks[i];
			var settings = task.settings;
			var sL = settings.length;
			var elems = this.elems;
			var props = this.props;
			task.sL = sL;

			var elemIndex = elems.indexOf(task.elem.id);
			if (elemIndex === -1) {
				elemIndex = elems.length;
				elems[elemIndex] = task.elem;
			}
			task.elemIndex = elemIndex;

			for (var j = 0; j < sL; j++) {
				var setting = settings[j];
				setting.isColor = (setting.prop.indexOf('color') > -1);

				if (setting.prop === 'transform') {
					/*
					 * Delta transforms provided as key value pairs
					 *
					 */
					setting.delta = this.getTransformDeltas(setting, setting.delta);
					setting.isTransform = true;
				} else if (setting.delta) {
					setting.delta = this.validatePropVals(setting, setting.delta);
				} else {
					/*
					 * flag if its necessary to calculate deltas
					 * when animation run
					 */
					this.needDeltas[job].push({ taskIndex: i, settingIndex: j });
				}

				props[elemIndex] = props[elemIndex] || [];
				var propIndex = props[elemIndex].indexOf(setting.prop);
				if (propIndex === -1) {
					propIndex = props[elemIndex].length;
					props[elemIndex][propIndex] = setting.prop;
				}
				setting.propIndex = propIndex;

				taskElemProps[taskElemProps.length] = {
					elemIndex: elemIndex,
					propIndex: propIndex,
					elem: elems[elemIndex],
					prop: props[elemIndex][propIndex],
					isRGB: (setting.isColor),
					isTransform: (setting.isTransform)
				};

				/*
			
				 * Flatten intructions into props array,
				 * starting values captured when animation is fired
				 * from getElementVals()


				if()
				taskProps[taskProps.length] = {
					name: task.name,
					elem: task.elem,
					prop: setting.prop,
					isRGB: (setting.isColor),
					isTransform: (setting.isTransform)
				};*/
			}
		}


		this.tasks[jobIndex] = tasks;
		this.jobElemProps[jobIndex] = taskElemProps;
	}
	reverseOrderSettingCompletion(a, b) {
		if (a.t === parseInt(a.t, 10)) {
			return (b.s + b.t) - (a.s + a.t);
		} else {
			throw 't needs to be an integer';
		}
	}
	reverseOrderTaskStarts(a, b) {
		return (b.settings[0].s + b.settings[0].t) - (a.settings[0].s + a.settings[0].t);
	}
	orderSettingStarts(a, b) {
		if (a.s === parseInt(a.s, 10) && b.s === parseInt(b.s, 10)) {
			return a.s - b.s;
		} else {
			throw 's needs to be an integer';
		}
	}
	getTransformDeltas(setting, deltas) {
		var methods = []
		for (var i = 0; i < this.tFL; i++) {
			var func = this.transformFuncs[i];
			if (deltas[func]) {
				var method = deltas[func];
				var delta = this.validatePropVals(setting, deltas[func].delta);
				methods[methods.length] = { func: func, delta: delta, easing: method.easing };
			}
		}
		return methods;
	}
	start(jobs, reverse) {

		if (typeof jobs === 'string' || jobs instanceof String) {
			jobs = [jobs];
		}
		if (jobs.constructor === Array) {
			var self = this;
			var jL = jobs.length;
			var jobIndexes = new Array(jL);
			for (var i = 0; i < jL; i++) {
				var jobIndex = this.jobs.indexOf(jobs[i]);
				jobIndexes[i] = jobIndex;
				var tasks = this.tasks[jobIndex];
				this.runtime = 0;
				this.direction = (reverse) ? -1 : 1;
				this.complete[jobIndex] = false;
				this.reversedAt[jobIndex]  = false;
				this.getElementVals(jobIndex);
				if (this.needDeltas[jobIndex].length) {
					this.getMissingDeltas(jobIndex);
				}
			}
			requestAnimationFrame(function(s) {
				self.runTasks(jobIndexes, s);
			});
		} else {
			throw 'Jobs must be passed as array';
		}
	}
	pause(jobs) {
		var self = this;

		if (typeof jobs === 'string' || jobs instanceof String) {
			getPauseTime(jobs);
		} else if (jobs.constructor === Array) {
			var jL = jobs.length;
			for (var i = 0; i < jL; i++) {
				getPauseTime(jobs[i]);
			}
		} else {
			throw 'Jobs must be passed as array or string';
		}

		function getPauseTime(job) {
			var jobIndex = self.jobs.indexOf(job);
			if (!self.paused[jobIndex]) {
				self.paused[jobIndex] = self.runtime;
			}
		}
	}

	restart(jobs) {
		var self = this;
		if (typeof jobs === 'string' || jobs instanceof String) {
			getOffset(job)
		} else if (jobs.constructor === Array) {
			var jL = jobs.length;
			for (var i = 0; i < jL; i++) {
				var job = jobs[i];
				getOffset(job);
			}
		} else {
			throw 'Jobs must be passed as array or string';
		}

		function getOffset(job) {
			var jobIndex = self.jobs.indexOf(job);
			if (self.paused[jobIndex]) {
				self.pauseOffsets[jobIndex] = self.runtime - self.paused[jobIndex];
				self.paused[jobIndex] = false;
			}
		}
	}

	reverse(jobs) {
		var self = this;
		if(!this.tasksReversed) {
			/* 
			 * Ordering of array gets flipped 
			 * and cached into new arrays
			*/
		}
		if (typeof jobs === 'string' || jobs instanceof String) {
			reverseJob(job)
		} else if (jobs.constructor === Array) {
			var jL = jobs.length;
			for (var i = 0; i < jL; i++) {
				var job = jobs[i];
				reverseJob(job);
			}
		} else {
			throw 'Jobs must be passed as array or string';
		}

		function reverseJob(job) {
			var jobIndex = self.jobs.indexOf(job);
			self.reversedAt[jobIndex] = (self.reversedAt[jobIndex])? false : self.runtime;
			self.tLs[job] = self.tasks[jobIndex].length;
		}
	}
	validatePropVals(propObj, propVal) {
		/*
		 * Color based CSS needs to be HEX value,
		 * if not px terminated string or integer is acceptable
		 */
		if (propObj.prop.indexOf('color') > -1 || propObj.isRGB) {
			/* is a hex value, convert to number value */
			if (propObj.isRGB) {
				/*
				 * RGB values should only be provided by getPropertyValue passed from getElementVals()
				 * and assumed valid for now. Needs to be turned into an array of [r,g,b]
				 */
				propVal = this.splitRGBString(propVal);

			} else if (propObj.isColor && this.isHex(propVal)) {
				/* convert hex values to integer */
				propVal = this.hexToRgb(propVal.substr(1));
			} else {
				throw 'delta value ' + propVal + ' needs to be a hex value for ' + propObj.prop;
			}
		} else if (propObj.isTransform) {

			propVal = Rematrix.parse(propVal);
			//propVal = this.calcTransform(propVal);
		} else {
			if (typeof propVal === 'string' && propVal.slice(-2) === 'px') {
				propVal = propVal.slice(0, -2);
			}
			if (!isNaN(propVal)) {
				propVal = parseInt(propVal, 10);
			} else {
				throw 'CSS properties must be px values, delta values should be integer for ' + propObj.prop;
			}
		}
		return propVal;
	}

	calcTransform(matrix) {
		/*
		 * transform vals are always returned as css matrix formation, values
		 * dont require validation however is returned as string 
		 * CSS transform property uses methods in order
		 * these formulas assume translate() is first, rotate() second, skew() 3rd, scale() can go wherever.
		 */
		console.info(matrix)
		var matrixVals = matrix.split('(')[1].split(')')[0].split(',');
		var a = parseFloat(matrixVals[0]);
		var b = parseFloat(matrixVals[1]);
		var c = parseFloat(matrixVals[2]);
		var d = parseFloat(matrixVals[3]);
		var e = parseFloat(matrixVals[4]);
		var f = parseFloat(matrixVals[5]);
		var a2 = Math.pow(a, 2);
		var b2 = Math.pow(b, 2);
		var c2 = Math.pow(c, 2);
		var d2 = Math.pow(d, 2);
		var propVals = {};
		var scale = Math.sqrt(a2 + b2);
		var scaleX = Math.sqrt(a2 + c2);
		var scaleY = Math.sqrt(b2 + d2);
		var rotationRads = Math.atan2(b, a);
		if (rotationRads < 0) {
			rotationRads += (2 * Math.PI);
		}
		var skew = Math.atan2(a * c + b * d, a2 + b2);
		skew /= (Math.PI / 180);
		propVals.scaleX = Math.round(scaleX * 100 + Number.EPSILON) / 100;
		propVals.scaleY = Math.round(scaleY * 100 + Number.EPSILON) / 100;
		propVals.skew = Math.round(skew * 100 + Number.EPSILON) / 100;
		propVals.rotate = Math.round(rotationRads * (180 / Math.PI));
		propVals.tranformX = e;
		propVals.tranformY = f;

		return propVals;
	}
	splitRGBString(propVal) {
		propVal = propVal.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
		return [parseInt(propVal[1]), parseInt(propVal[2]), parseInt(propVal[3])];
	}
	isElement(elem) {
		return (
			typeof HTMLElement === "object" ? elem instanceof HTMLElement :
			elem && typeof elem === "object" && elem !== null && elem.nodeType === 1 && typeof elem.nodeName === "string"
		);
	}
	isHex(str) {
		return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str);
	}
	hexToRgb(hex) {
		var bigint = parseInt(hex, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		return [r, g, b];
	}
	camelCaseToDash(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	};

	getElementVals(job) {
		var jobProps = this.jobElemProps[job];
		var propVals = this.propVals;
		var jPL = jobProps.length;
		for (var i = 0; i < jPL; i++) {
			var prop = jobProps[i];

			var val = this.getPropertyVal(prop);
			if (val === undefined) {
				val = 0;
			}
			propVals[prop.elemIndex] = propVals[prop.elemIndex] || [];
			propVals[prop.elemIndex][prop.propIndex] = val;
		}
	}

	getPropertyVal(prop) {
		var propName = this.camelCaseToDash(prop.prop);
		var propVal = getComputedStyle(prop.elem).getPropertyValue(propName);
		propVal = this.validatePropVals(prop, propVal);
		return propVal;
	}
	/*
	 * Missing delta exist bacause config only provides target.
	 * Targets should be parsed at the time the tasks run, not on init
	 * For this reason target setting have this additional overhead when tasks are fired.
	 */
	getMissingDeltas(job) {
		var tasks = this.tasks[job];
		var missingDeltas = this.needDeltas[job];
		var l = missingDeltas.length;
		var delta;
		for (var i = 0; i < l; i++) {
			var obj = missingDeltas[i];
			var task = tasks[obj.taskIndex];
			var setting = task.settings[obj.settingIndex];
			var start = this.propVals[job][obj.settingIndex];
			var end = this.validatePropVals(setting, setting.target);
			if (end === parseInt(end)) {
				delta = (end - start);
			} else if (Array.isArray(end)) {
				delta = [];
				delta[0] = parseInt(end[0]) - parseInt(start[0]);
				delta[1] = parseInt(end[1]) - parseInt(start[1]);
				delta[2] = parseInt(end[2]) - parseInt(start[2]);
			}
			setting.delta = delta;
		}
		this.needDeltas[job] = [];
	}

	runTasks(jobs, s, timestamp) {
		var self = this;
		var timestamp = timestamp || s + 1;
		this.runtime = timestamp - s;
		for (var j = 0; j < this.jL; j++) {
			var job = jobs[j];
			var tasks = this.tasks[job];
			var tL = this.tLs[job];
			for (var i = 0; i < tL; i++) {
				var task = tasks[i];
				var lastTaskSetting = task.settings[0];

				if (lastTaskSetting.complete) {
					if (!i) {
						console.info('complete all!');
						this.complete[job] = true;
					}
					/* The Last item finishes first, so reduce index by 1 */
					this.tLs[job]--;
					this.resetSettings(task)
					console.info('complete task!', task);
					if (lastTaskSetting.cb) {
						lastTaskSetting.cb(this);
					}
					break;
				} else {
					this.adjustProps(task, job);
				}
			}
		}
		if (!this.complete[job]) {
			requestAnimationFrame(function(timestamp) {
				self.runTasks(jobs, s, timestamp);
			});
		} else {
			debugger;
		}
	}
	resetSettings(task) {
		/*
		 * Once task is finsihed some of the objects values are no longer correct
		 * Its likely the last reposition is missing so use the endVal to insure perfect pos
		 */
		var sL = task.settings.length;
		var corrected = [];
		task.sL = sL;
		for (var i = 0; i < sL; i++) {
			var setting = task.settings[i];
			if (corrected.indexOf(setting.prop) === -1) {
				
				/* WRONG */

				task.elem.style[setting.prop] = setting.startVal + (setting.delta * task.direction);
				corrected[corrected.length] = setting.prop;
			}
			delete setting.startVal, setting.endVal;
		}
	}
	/*
		refreshStarVal(setting, task) {
			var prop = setting.prop;
			var taskName = task.name;
			var propObj = setting;
			propObj.elem = task.elem;
			propObj.isRGB = (propObj.isColor);
			var probVal = this.getPropertyVal(propObj);
			this.propVals[propObj.elem.id][prop] = probVal;
			return probVal;
		}
	*/
	adjustProps(task, job) {
		if (this.paused[job]) return;
		var settings = task.settings;
		var elem = task.elem;
		var reversedAt = this.reversedAt[job] || false;
		var sL = (!reversedAt)? task.sL : settings.length;
		var direction = this.direction;
		console.info('adjustProps', sL);

		for (var i = 0; i < sL; i++) {
			var setting = settings[i];
			var sS = setting.s;
			var end = setting.endTime;
			var runtime = (!reversedAt)? this.runtime : reversedAt*2 - this.runtime;
			if (sS > this.runtime ) continue;
			var sT = setting.t;
			var delta = setting.delta;
			var prop = setting.prop;

			if (setting.startVal === undefined) {
				/*
				 * First frame of task setting,
				 * grab starting point
				 * and end time for later
				 */
				setting.startVal = this.propVals[task.elemIndex][setting.propIndex];
				setting.endTime = sS + sT;
				setting.complete = false;
			}
			/*
			 * else if (this.initVals[task.name][prop] !== false) {
			 *  this.initVals[task.name][prop].val = false;
			 * }
			 */
			var startVal = setting.startVal;
			var offset = (this.pauseOffsets[job]) ? this.pauseOffsets[job] : 0;
			/*
			 * the settings are sorted in reverse order of completion
			 * if settings[0] is complete we are done
			 */

			if (!reversedAt && end + offset < runtime) {
				/* Last srtting finishes first so reduce sL */
				task.sL--;
				console.info(startVal, 'end reached for ' + prop);
				if (prop === 'transform') {}
				//elem.style[prop] = startVal + (delta * direction);
				setting.complete = true;
				// delete setting.startVal;
				break;
			} else if(reversedAt && sS > runtime) {
				continue;
			}
			/*
			 * if setting's start time has passed
			 */
			if (sS <= this.runtime) {
				/*
				 * calculate progress based on provided option
				 */
				var v;
				var t = runtime - sS - offset;
				var progress = t / sT;
				var b = 0;
				var d = sT;
				var c;
				

				if (setting.isTransform) {
					var transform = [];
					var dL = delta.length;
					for (var j = 0; j < dL; j++) {
						var method = delta[j];
						var val;
						if (method.easing) {
							c = method.delta;
							val = parseInt(Math[method.easing](t, b, c, d), 10);
						} else {
							val = progress * method.delta;
						}
						transform[j] = Rematrix[method.func](val);
					}
					transform[transform.length] = startVal;
					transform = transform.reduce(Rematrix.multiply);
					this.propVals[task.elemIndex][setting.propIndex] = transform;
					v = 'matrix3d(' + transform.join(', ') + ')';
				} else if (setting.isColor) {
					var rgb = [];
					for (var j = 0; j < 3; j++) {
						rgb[j] = parseInt(startVal[j] + (progress * delta[j]), 10);
					}
					this.propVals[task.elemIndex][setting.propIndex] = rgb;
					v = 'rgb(' + rgb.join(',') + ')';
				} else {
					if (setting.easing && Math[setting.easing]) {
						c = delta;
						v = parseInt((Math[setting.easing](t, b, c, d)) + startVal, 10);
						this.propVals[task.elemIndex][setting.propIndex] = v;
					} else {
						v = parseInt(((progress * delta) + startVal), 10);
						this.propVals[task.elemIndex][setting.propIndex] = v;
					}
					v += 'px';
				}
				elem.style[prop] = v;
			}
		}
	}
}
