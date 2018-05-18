const Modal = Backbone.View.extend({
  tagName: 'div',
  className: 'modal',
  events: {
    'click button:first-child': 'make',
    'click button:last-child': 'close'
  },
  initialize: function() {},
  render: function() {
      
  }
});