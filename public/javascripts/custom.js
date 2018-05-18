curName = null;
function openMakeModal(name) {
  $("#make-modal").removeClass("hidden");
  curName = name;
}

function closeMakeModal() {
  $("#make-modal").addClass("hidden");
}

function make() {
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
                    "/make-amiibo-card?name=" + encodeURIComponent(curName)
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
        .attr("src", "/make-amiibo-card?name=" + encodeURIComponent(curName));
      startAutoScrolling();
      setIntervalFroProgress();
    }
  );
}

function checkToMake(exist, notExist) {
  $.get("/check-if-any-making-process", function(data) {
    if (data.processNum > "2") {
      exist();
    } else {
      notExist();
    }
  });
}
__interval = null;
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

__intervalForProgress = null;
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
