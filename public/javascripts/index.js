function init() {
  document.getElementById('get-elements').addEventListener('click', getElements);
  document.getElementById('get-parts').addEventListener('click', getParts);
  document.getElementById('get-configuration').addEventListener('click', getConfiguration);
  displayOutput('Ready!');
}

function displayOutput(output) {
  var outputElement = document.getElementById('output');
  outputElement.innerHTML = output;
}

function getElements() {
  return apiGet('Getting elements', '/api/elements', function(elements) {
    displayOutput(JSON.stringify(elements, null, 2))
  })
}

function getParts() {
  return apiGet('Getting parts', '/api/parts', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  })
}

function getConfiguration() {
  return apiGet('Getting configuration', '/api/configuration', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  })
}

function apiGet(placeholder, apiPath, onResponse) {
  displayOutput(placeholder)

  var dfd = $.Deferred();
  $.ajax(apiPath + window.location.search, {
      dataType: 'json',
      type: 'GET',
      success: onResponse,
      error: displayOutput,
  });

  return dfd.promise();
}

init();