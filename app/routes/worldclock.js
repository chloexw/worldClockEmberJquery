import Ember from 'ember';

var WorldclockRoute = Ember.Route.extend({

  cachedCities: null,
  
  model: function() {
    return this.store.find('city');
  },
  
  setupController: function(controller, model) {
    controller.set('content', model);
  }
});


export default WorldclockRoute;
