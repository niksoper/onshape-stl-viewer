function init() {
  var bGetElements = document.getElementById('get-elements');
  bGetElements.addEventListener('click', getElements);
  displayOutput('Ready!');
}

function displayOutput(output) {
  var outputElement = document.getElementById('output');
  outputElement.innerHTML = output;
}

function getElements() {
  displayOutput('Getting elements')

  var dfd = $.Deferred();
  $.ajax('/api/elements'+ window.location.search, {
      dataType: 'json',
      type: 'GET',
      success: function(data) {
         displayOutput(JSON.stringify(data, null, 2))
      },
      error: function(err) {
        displayOutput(err)
      }
  });
  return dfd.promise();
}

init();