const Modal = Backbone.Model.extend({
    
});


const ModalView = Backbone.View.extend({
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
