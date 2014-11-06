import Ember from 'ember';
import Utils from './utils';

var WorldclockController = Ember.ArrayController.extend({

  timerInterval: 1000/6,
  timer: null,
  edit: false,
  canvas: false,

  actions: {
    editCity: function() {
      var curr = this.get('edit');
      this.set('edit', !curr);
    },
    doneEdit: function() {
      this.set('edit', false);
    },
    delete: function(id) {
      this.store.find('city', id).then(function (book) {
          book.deleteRecord();
          book.save();
      });
    },
    addcity: function() {
      this.transitionTo('addcity');
    },
    displayCanvas: function() {
      var curr = this.get('canvas');
      this.set('canvas', !curr);
    }
  },

  contentDidChange: function() {
    this.updateCityInfo();
  }.observes('content'),

  updateCityInfo: function() {
    var content = this.get('content');
    content = content.toArray();
    
    for (var i=0, iLen=content.length; i<iLen; i++) {
      this.updateTimeForCity(content[i]);
    }

    // cancel any other timers that might be assigned since the last time
    Ember.run.cancel(this.get('timer'));
    this.set('timer', Ember.run.later(this, 'updateCityInfo', this.get('timerInterval')));
  },

  updateTimeForCity: function(city) {
    var myTime       = new Date(),
        utcTime      = new Date(new Date().setMinutes(new Date().getMinutes()+myTime.getTimezoneOffset())),
        cityTime     = new Date(new Date(utcTime.getTime()).setMinutes(new Date().getMinutes()+city.get('timezoneOffset'))),
        isToday      = cityTime.getDate() === myTime.getDate(),
        isTomorrow   = cityTime.getDate() > myTime.getDate() || cityTime.getMonth() > myTime.getMonth() || cityTime.getFullYear() > myTime.getFullYear(),
        hourTimeDiff = parseInt((cityTime.getTime() - myTime.getTime()) / (1000 * 60 * 60),10),
        fmtString    = '%@ hour%@ ahead';

    if(hourTimeDiff <  0) {
      fmtString = '%@ hour%@ behind';
      hourTimeDiff *= -1;
    } else if(hourTimeDiff === 0) {
      fmtString = '';
    }
    
    var diffString = fmtString.fmt(hourTimeDiff, hourTimeDiff !== 1 ? 's' : ''),
        localTime  = '',
        localTime2 = '',
        hours      = cityTime.getHours(),
        millisec   = cityTime.getMilliseconds(),
        seconds    = cityTime.getSeconds(),
        minutes    = cityTime.getMinutes();

    if (hours > 11) {
      if (hours > 12) {
        hours = hours - 12;
      }
      localTime = hours + ':' + Utils.addZeroes(minutes) + ' PM';
      localTime2 = hours + ':' + minutes + ':' + seconds + ':' + millisec + ' PM';
    } else {
      // If it is midnight, show it as 12 instead of 0.
      if(hours === 0) {
        hours = 12;
      }
      localTime = hours + ':' + Utils.addZeroes(minutes) + ' AM';
      localTime2 = hours + ':' + minutes + ':' + seconds + ':' + millisec + ' AM';
    }
    Ember.set(city, 'hours', diffString);
    Ember.set(city, 'day', isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Yesterday');
    Ember.set(city, 'localTime', localTime);
    Ember.set(city, 'localTime2', localTime2);
  }
});


export default WorldclockController;
