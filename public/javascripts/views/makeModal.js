const MakeModalView = Backbone.View.extend({
  className: "modal hidden",
  template: _.template(""),
  initialize: function(options) {
    this.opts = {
      make: options.make,
      close: options.close
    };

    $.get("/javascripts/views/html/makeModal.html", html => {
      this.template = _.template(html);

      this.listenTo(this.model, "change:progress", this.changeProgress);

      this.listenTo(this.model, "change:isOpen", this.changeVisibility);

      this.listenTo(this.model, "change", this.render);
    });
  },
  events: {
    "click button:first-child": "make",
    "click button:last-child": "close"
  },

  attchTo: function(el) {
    $(el).append(this.render().el);
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));

    return this;
  },
  changeVisibility: function(e, a) {
    if (this.model.get("isOpen")) {
      this.$el.removeClass("hidden");
    } else {
      this.$el.addClass("hidden");
    }
  },
  open: function() {
    this.model.set("isOpen", true);
  },
  close: function() {
    this.opts.close();
  },
  make: function() {
    this.opts.make();
  },
  changeProgress: function(e) {
    this.$("ui indicating progress").progress({
      percent: this.model.get("progress")
    });
  }
});

const CardModel = Backbone.Model.extend({
  initialize: function() {
    this.set({
      name: "",
      series: "",
      imgSrc: "",
      progress: "",
      isOpen: false,
      isMade: false
    });
  }
});
