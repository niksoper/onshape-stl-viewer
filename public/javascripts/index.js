var partStudioElementId;

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
    var partStudio = elements.find(e => e.elementType === 'PARTSTUDIO')
    if (partStudio) {
      partStudioElementId = partStudio.id;
      console.log('GOT ELEMENT ID', partStudioElementId)
    } else {
      console.log('FAILED TO GET ELEMENT ID')
    }

    displayOutput(JSON.stringify(elements, null, 2))
  })
}

function getParts() {
  return apiGet('Getting parts', '/api/parts', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  })
}

function getConfiguration() {
  var queryParams = '?documentId=' + getQueryParam('documentId') + '&workspaceId=' + getQueryParam('workspaceId') + '&elementId=' + partStudioElementId
  return apiGet('Getting configuration', '/api/configuration', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  }, queryParams)
}

function apiGet(placeholder, apiPath, onResponse, queryParams) {
  displayOutput(placeholder)

  if (!queryParams) {
    queryParams = window.location.search;
  }

  var dfd = $.Deferred();
  $.ajax(apiPath + queryParams, {
      dataType: 'json',
      type: 'GET',
      success: onResponse,
      error: displayOutput,
  });

  return dfd.promise();
}

function getQueryParam(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param)
}

init();