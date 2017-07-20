$(document).ready(function() {

  // Search Tags Array
  var giphyTags = [ 'badger', 'bat', 'bear', 'bird', 'bulldog', 'butterfly', 'camel', 'cat', 'caterpillar' ];

  var apiurl = 'api.giphy.com';
  var search = '/v1/gifs/search?';
  var apikey = 'dc6zaTOxFJmzC';

  var animal = 'q=dogs'
  var queryURL = 'http://'+ apiurl + search + animal +'&limit=18&api_key=' + apikey;

  // Displays tags in the DOM
  function renderTags() {
    $('#giphy-tags').empty();
    $.each( giphyTags, function( index, val ) {
       var giphyTag = $('<a href="#" class="btn btn-default btn-block">').html( val );
       $('#giphy-tags').append( giphyTag );
    });
  }

  renderTags();

  // Get value of form input when clicking submit add it to array
  $('#add-tag-submit').click(function(e) {
    e.preventDefault();

    var value = $('#add-tag-input').val();
    giphyTags.push(value);

    renderTags();

  });

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (result) {

    // console.log(result);
    var giphy = result;
    var gif;

   for ( var i = 0; i < giphy.data.length; i++ ) {
    var column = $('<div class="giphy-col col-sm-2">');
    var img    = $('<img>');

    gif = giphy.data[i].images.downsized.url;
    // console.log(gif);

    img.attr({
      src:    giphy.data[i].images.fixed_height_still.url,
      width:  giphy.data[i].images.fixed_height_still.width,
      height: giphy.data[i].images.fixed_height_still.height,
      class: 'giphy-img center-block'
    });

    var giphyItem = $('<div class="giphy-item">');
    column.html( giphyItem.html(img) );

    $('#giphy-row').append( column );

    $(document).on('click', '.giphy-img', function(e) {
      // console.log('helo');
     $(this).attr('src', gif );
    });

   }

  });//ajax

});//document