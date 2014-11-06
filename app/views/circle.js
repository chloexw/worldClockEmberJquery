App.CircleView = Ember.View.extend({
  classNameBindings: ['isEdit:circle:noncircle'],
  isEdit: false,
  content: '<div id="dash"></div>'
});