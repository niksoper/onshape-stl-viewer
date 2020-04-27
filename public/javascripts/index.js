(function() {
  $.ready(function() {
    $('#get-elements').click(getElements)
    displayOutput('Ready!')
  })

  function getElements() {
    displayOutput('Getting elements')

    var dfd = $.Deferred();
    $.ajax('/api/elements'+ window.location.search, {
        dataType: 'json',
        type: 'GET',
        success: function(data) {
           displayOutput(data)
        },
        error: function(err) {
          displayOutput(err)
        }
    });
    return dfd.promise();
  }

  function displayOutput(output) {
    $('#output').html(output)
  }

})();
