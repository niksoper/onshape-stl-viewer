var partStudioElementId;

function init() {
  document.getElementById('get-elements').addEventListener('click', getElements);
  document.getElementById('get-parts').addEventListener('click', getParts);
  document.getElementById('get-configuration').addEventListener('click', getConfiguration);
  document.getElementById('test-button').addEventListener('click', getTest);
  displayOutput('Ready!');
}

function displayOutput(output) {
  var outputElement = document.getElementById('output');
  outputElement.innerHTML = output;
}

function getElements() {
  return apiGet('Getting elements', 'json', '/api/elements', function(elements) {
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
  return apiGet('Getting parts', 'json', '/api/parts', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  })
}

function getConfiguration() {
  var queryParams = '?documentId=' + getQueryParam('documentId') + '&workspaceId=' + getQueryParam('workspaceId') + '&elementId=' + partStudioElementId
  return apiGet('Getting configuration', 'json', '/api/configuration', function(parts) {
    displayOutput(JSON.stringify(parts, null, 2))
  }, queryParams)
}

function getTest() {
  return apiGet('Running test', 'text', '/api/test', function(result) {
    console.log('RESULT', result)
    displayOutput(result)
  })
}

function apiGet(placeholder, dataType, apiPath, onResponse, queryParams) {
  displayOutput(placeholder)

  if (!queryParams) {
    queryParams = window.location.search;
  }

  var dfd = $.Deferred();
  $.ajax(apiPath + queryParams, {
      dataType: dataType,
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