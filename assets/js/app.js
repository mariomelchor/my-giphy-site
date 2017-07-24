$(document).ready(function() {

  // init Masonry after all images have loaded
  var $grid = $('#giphy-row').imagesLoaded( function() {
    $grid.masonry({
      itemSelector: '.giphy-col',
      columnWidth: '.grid-sizer',
      percentPosition: true
    });
  });


  // API
  var apiurl = 'https://api.giphy.com/v1/gifs/search?';
  var apikey = 'dc6zaTOxFJmzC';

  // Search Tags Array
  var giphyTags = [ 'nba', 'nfl', 'nhl', 'soccer', 'basketball', 'football', 'memes', 'sports', 'kobe', 'jordan' ];

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

      // Run function to display new tags added to giphyTags array
      renderTags();

      // Render giphy images with value added to input
      renderGiphyImg( value );
    }

  });

  // When .btn-tag is clicked
  $(document).on('click', '.btn-tag', function(e) {
    var tagClicked = $(this).html();
    renderGiphyImg( tagClicked );
  });


  // Render giphy images in the DOM
  function renderGiphyImg( tag ) {

    var search = 'q=' + tag;
    var queryURL = apiurl + search  +'&limit=18&api_key=' + apikey;

    $('#giphy-row').empty();
    // Needed for masonsry
    $('#giphy-row').append('<div class="grid-sizer">');

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function (result) {

      // console.log(result);

      $.each( result.data , function( index, giphy ) {
        // console.log(giphy);
        var column    = $('<div class="giphy-col col-sm-4">');
        var giphyItem = $('<div class="giphy-item">');
        var giphyMeta = $('<div class="giphy-meta">');
        var userMeta  = $('<div class="giphy-user">');
        var userImg   = $('<img class="img-avatar">');
        var giphyUrl  = giphy.bitly_url;
        var linkIcon  = '<a href="'+ giphyUrl +'" class="giphy-link pull-right"><span class="glyphicon glyphicon-new-window"></span></a>';

        if ( typeof giphy.user != 'undefined' ) {
          var userName = giphy.user.display_name;
          var avatar_url = giphy.user.avatar_url;
        } else {
          var userName = 'Giphy';
          var avatar_url = 'https://media2.giphy.com/avatars/studiosoriginals/j3JBzK5twdv8.jpg';
        }

        userImg.attr({
          src: avatar_url,
          width: '36'
        });;

        userMeta.append( userImg );
        userMeta.append( userName );
        giphyMeta.append( userMeta );
        giphyMeta.append( linkIcon );
        // giphyMeta.append( '<div class="text-uppercase">Rating: ' + giphy.rating + '</div>');

        var img = $('<img>');
        img.attr( 'data-gif', giphy.images.downsized.url );

        img.attr({
          src:    giphy.images.downsized_still.url,
          width:  giphy.images.downsized_still.width,
          height: giphy.images.downsized_still.height,
          class: 'giphy-img media-fluid center-block'
        });

        giphyItem.append( img );
        giphyItem.append( giphyMeta );
        column.append( giphyItem );

        // Masonry layout
        $column =  $( column );
        $grid.append( $column ).masonry( 'appended', $column );
        $grid.imagesLoaded( function() {
          $grid.masonry('layout');
        });

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