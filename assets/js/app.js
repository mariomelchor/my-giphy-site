$(document).ready(function() {

  var apiurl = 'api.giphy.com';
  var search = '/v1/gifs/search?';
  var apikey = 'dc6zaTOxFJmzC';

  var animal = 'q=dogs'
  var queryURL = 'http://'+ apiurl + search + animal +'&limit=18&api_key=' + apikey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (result) {

    console.log(result);
    var giphy = result;

   for ( var i = 0; i < giphy.data.length; i++ ) {
    var column = $('<div class="giphy-col col-sm-2">');
    var img    = $('<img>');

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
      console.log('helo');
     $(this).attr('src', giphy.data[i].images.fixed_height.url );
    });

   }

  });//ajax

});//document