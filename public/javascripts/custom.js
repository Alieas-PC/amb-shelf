const cardModel = new CardModel({});

new MakeModalView({
  model: cardModel,
  make: function() {
    __interval = null;
    __intervalForProgress = null;

    function startAutoScrolling() {
      clearInterval(__interval);

      __interval = setInterval(() => {
        const body = $("#ifr-making")[0].contentDocument.body;

        body.scrollTop = body.scrollHeight;
      }, 500);
    }

    function stopAutoScrolling() {
      clearInterval(__interval);
    }

    function setIntervalFroProgress() {
      clearInterval(__intervalForProgress);

      __intervalForProgress = setInterval(() => {
        $.get("/progress", function(data) {
          $("#progress-bar").progress({
            percent: data.progress
          });
          if (data.progress >= 100) {
            clearInterval(__intervalForProgress);
          }
        });
      }, 500);
    }

    checkToMake(
      function() {
        const c = confirm(
          "There's an existed running process. Do you want to stop it before start making?"
        );

        if (c) {
          $.get("/kill-other-makerp", function() {
            setTimeout(function() {
              checkToMake(
                function() {
                  alert("Process was not killed.");
                },
                function() {
                  $("#ifr-making")
                    .on("load", () => {
                      setTimeout(() => stopAutoScrolling(), 500);
                    })
                    .attr(
                      "src",
                      "/make-amiibo-card?name=" +
                        encodeURIComponent(cardModel.get("name"))
                    );
                  startAutoScrolling();
                  setIntervalFroProgress();
                }
              );
            }, 1000);
          });
        }
      },
      function() {
        $("#ifr-making")
          .on("load", () => {
            setTimeout(() => stopAutoScrolling(), 500);
          })
          .attr(
            "src",
            "/make-amiibo-card?name=" +
              encodeURIComponent(cardModel.get("name"))
          );
        startAutoScrolling();
        setIntervalFroProgress();
      }
    );
  },
  close: function() {
    checkToMake(
      function() {
        const sure = confirm("Are you sure to stop current making process?");
        if (sure) {
          $.get("/kill-other-makerp");
          cardModel.set({
            isOpen: false
          });
        }
      },
      function() {
        cardModel.set({
          isOpen: false
        });
      }
    );
  }
}).attchTo("body");

function openMakeModal(item) {
  cardModel.set({
    isOpen: true,
    name: item.name,
    series: "Zelda",
    imgSrc: item.imgSrc
  });
}

function checkToMake(exist, notExist) {
  $.get("/check-if-any-making-process", function(data) {
    if (data.processNum >= "3") {
      exist();
    } else {
      notExist();
    }
  });
}

function showBtn(e) {
  $(e.target)
    .find(".btn-group")
    .removeClass("hidden");
}

function hideBtn(e) {
  $(e.target)
    .find(".btn-group")
    .addClass("hidden");
}

function markWithGot(name) {
  $.get("/mark-with-got?name=" + encodeURIComponent(name));
}
