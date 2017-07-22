$(document).ready(function() {

  // API
  var apiurl = 'http://api.giphy.com/v1/gifs/search?';
  var apikey = 'dc6zaTOxFJmzC';

  // Search Tags Array
  var giphyTags = [ 'badger', 'bat', 'bear', 'bird', 'bulldog', 'butterfly', 'camel', 'cat', 'caterpillar' ];

  // Displays tags in the DOM
  function renderTags() {
    $('#giphy-tags').empty();
    $.each( giphyTags, function( index, val ) {
       var giphyTag = $('<a href="#" class="btn btn-primary btn-tag">').html( val );
       $('#giphy-tags').append( giphyTag );
    });
  }

  renderTags();
  renderGiphyImg( giphyTags[1] );

  // Get value of form input when clicking submit add it to array
  $('#add-tag-submit').click(function(e) {
    e.preventDefault();

    var value = $('#add-tag-input').val();

    // Check if value is not empty and is not currently in the giphyTags array
    if ( value && $.inArray( value, giphyTags ) === -1 ) {
      giphyTags.push(value);
    }

    renderTags();
  });

  // When .btn-tag is clicked
  $(document).on('click', '.btn-tag', function(e) {
    var tagClicked = $(this).html();
    renderGiphyImg( tagClicked );
  });


  // Render giphy images itn the DOM
  function renderGiphyImg( tag ) {

    var search = 'q=' + tag;
    var queryURL = apiurl + search  +'&limit=18&api_key=' + apikey;

    $('#giphy-row').empty();

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function (result) {

      // console.log(result);

      $.each( result.data , function( index, giphy ) {
        // console.log(giphy);
        var column = $('<div class="giphy-col col-sm-4">');
        var img    = $('<img>');
        img.attr( 'data-gif', giphy.images.downsized.url );

        img.attr({
          src:    giphy.images.fixed_height_still.url,
          width:  giphy.images.fixed_height_still.width,
          height: giphy.images.fixed_height_still.height,
          class: 'giphy-img media-fluid center-block'
        });

        var giphyItem = $('<div class="giphy-item">');
        column.html( giphyItem.html( img ) );

        $('#giphy-row').append( column );


      });

    });

  }

  // Play/Pause when .giphy-img is clicked
  $(document).on('click', '.giphy-img', function(e) {
    var img = $(this);
    var gif = img.attr('data-gif');
    var src = img.attr('src');

    img.attr('src', gif ).attr('data-gif', src );
  });


});