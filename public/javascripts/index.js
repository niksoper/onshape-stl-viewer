(function() {
  $.ready(function() {
    $('#get-elements').click(getElements)
  })

  function getElements() {
    var dfd = $.Deferred();
    $.ajax('/api/elements'+ window.location.search, {
        dataType: 'json',
        type: 'GET',
        success: function(data) {
           displayOutput(data)
        },
        error: function() {
        }
    });
    return dfd.promise();
  }

  function displayOutput(output) {
    $('#output').html(output)
  }

})();
