class Animator {

  constructor(options) {
    var tasks = options.tasks;
    var tL = tasks.length;
    var self = this;

    tasks.props = [];

    for (var i = 0; i < tasks.length; i++) {
      /*
       * Reverse sort styles so we can use
       * manage completed tasks later
       */
      var task = tasks[i];
      task.settings.sort(function orederSettingStarts(a, b) {
        return a.start - b.start;
      });
      task.startTime = task.settings[0].startTime;
      task.settings.sort(function reverseOrderSettingCompletion(a, b) {
        return (b.startTime + b.t) - (a.startTime + a.t);
      });
      var taskProps = task.settings.map(function(obj) {
        return {
          elem: task.elem,
          prop: obj.prop
        };
      });
      tasks.props = tasks.props.concat(taskProps);
      task.completes = task.settings[0].startTime + task.settings[0].t;
    }

    tasks.sort(function reverseoOrderTaskStarts(a, b) {
      return (b.settings[0].startTime + b.settings[0].t) - (a.settings[0].startTime + a.settings[0].t);
    });

    this.tasks = options.tasks;
    this.tL = tasks.length;

    if (options.autostart) {
      this.start();
    }
  };
  camelCaseToDash(str) {
    return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
  };
  getStartingVals() {
    var props = this.tasks.props;
    var initVals = {};
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var propVal = getComputedStyle(prop.elem).getPropertyValue(this.camelCaseToDash(prop.prop));
      initVals[prop.elem.id] = initVals[prop.elem.id] || {};
      initVals[prop.elem.id][prop.prop] = parseInt(propVal);
    }
    this.initVals = initVals;
    console.info(initVals);
  };
  start(reverse) {
    var self = this;
    this.direction = (reverse)? -1 : 1;
    this.complete = false;
    this.getStartingVals();
    requestAnimationFrame(function(startTime) {
      self.runTasks(startTime);
    });
  };
  runTasks(startTime, timestamp) {
    var self = this;
    var timestamp = timestamp || startTime + 1;
    var tL = this.tL;
    this.runtime = timestamp - startTime;

    for (var i = 0; i < this.tL; i++) {
      var task = this.tasks[i];
      // console.info(this.runtime, task.startTime);
      var lastTaskSetting = task.settings[0];
      if (lastTaskSetting.startTime + lastTaskSetting.t < this.runtime) {
        if (!i) {
          console.info('complete all!');
          this.complete = true;
        }
        var endVal = this.initVals[task.elem.id][lastTaskSetting.prop] + (this.direction * lastTaskSetting.target);
        task.elem.style[lastTaskSetting.prop] = endVal;
        console.info(this.initVals[task.elem.id],lastTaskSetting.prop,this.direction,lastTaskSetting.target);

        console.info('complete task!',endVal, lastTaskSetting.prop);
        break;
      } else if (task.startTime <= this.runtime) {
        // console.info('runTask', task.startTime, this.runtime);
        this.adjustProps(task);
      }
    }

    if (!this.complete) {
      requestAnimationFrame(function(timestamp) {
        self.runTasks(startTime, timestamp);
      });
    }
  };

  adjustProps(task) {

    var settings = task.settings;
    var elem = task.elem;
    var tL = settings.length;

    for (var i = 0; i < tL; i++) {
      var setting = settings[i];
      var settingStartTime = setting.startTime;
      var t = setting.t;
      var startPoint = this.initVals[task.elem.id][setting.prop];
      var target = setting.target;
      var prop = setting.prop;
      var end = settingStartTime + t;
      var direction = this.direction;

      /*
       * the settings are sorted in reverse order of completion
       * if settings[0] is complete we are done
       */
      if(end < this.runtime){
        console.info('end reached');
        elem.style[prop] = startPoint + (direction * target);
        break;
      }
      if (settingStartTime <= this.runtime) {
        var v;
        var progress = (this.runtime - settingStartTime) / t;
        if (setting.easing && Math[setting.easing]) {
          v = Math[setting.easing](this.runtime - settingStartTime, 0, target, t) * direction;
        } else {
          v = progress * target * direction;
        }
       
        elem.style[prop] = v + startPoint + 'px';
        /*
         * once we hit a complete progess the
         * this frame is finished
         */
        if (progress >= 1) {
          console.info('progress complete');
          elem.style[prop] = startPoint + (direction * target); 
          break;
        }
      }
    }
  }

}
