paceOptions = {
  elements: {
    selectors: ['#ifr-making']
  }
}

function openMakeModal() {
  $('#make-modal').removeClass('hidden');
}

function closeMakeModal() {
  $('#make-modal').addClass('hidden');
}

function make() {
  checkToMake(
    function() {
      const c = confirm(
        "There's existed running process. Do you want to stop it before start making?"
      );

      if (c) {
        $.get('/kill-other-makerp', function() {
          setTimeout(function() {
            checkToMake(
              function() {
                alert('Process was not killed.');
              },
              function() {
                $('#ifr-making').attr('src', '/make-amiibo-card');
              }
            );
          }, 1000);
        });
      }
    },
    function() {
      $('#ifr-making').attr('src', '/make-amiibo-card');
    }
  );
}

function checkToMake(exist, notExist) {
  $.get('/check-if-any-making-process', function(data) {
    if (data.processNum > '2') {
      exist();
    } else {
      notExist();
    }
  });
}
