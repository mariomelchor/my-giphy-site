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
  var offset = 0;
  var apiurl = 'https://api.giphy.com/v1/gifs/search?';
  var apikey = 'dc6zaTOxFJmzC';
  
  // Search Tags Array
  var giphyTags = [ 'nba', 'nfl', 'nhl', 'soccer', 'basketball', 'football', 'memes', 'sports', 'kobe', 'jordan' ];
  var currentTag = giphyTags[1];

  // Get value of form input when clicking submit add it to array
  $('#add-tag-submit').click(function(e) { 
    e.preventDefault();

    var value = $('#add-tag-input').val();

    // Check if value is not empty and is not currently in the giphyTags array
    if ( value && $.inArray( value, giphyTags ) === -1 ) {
      giphyTags.push(value);
      currentTag = value;

      // Render giphy images with value added to input
      initGiphy( value );
    }

  });

  // When .btn-tag is clicked
  $(document).on('click', '.btn-tag', function(e) {
    currentTag = $(this).html();
    initGiphy( currentTag );
  });

  // Play/Pause when .giphy-img is clicked
  $(document).on('click', '.giphy-img', function(e) {
    var img = $(this);
    var gif = img.attr('data-gif');
    var src = img.attr('src');

    img.attr('src', gif ).attr('data-gif', src );
  });

  // Event handler when you scroll to the bottom of page
  $(window).on('scroll', function() {
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();

    // if users scrolls to the bottom call the giphy API
    if ( (scrollHeight - scrollPosition) / scrollHeight === 0 ) {
      offset += 25;
      giphyAPI( currentTag );
    }
  });

  // function to init Giphy
  function initGiphy( tag ) {
    $('#giphy-row').empty();
    $('#giphy-row').append('<div class="grid-sizer">');

    renderTags();
    giphyAPI(tag);
  }

  // function to call the Giphy API
  function giphyAPI(search) {
    var queryURL = apiurl + 'q=' + search  +'&api_key=' + apikey + '&offset=' + offset;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(result) {
      renderGiphy(result.data);
    });
  }

  // function to display giphy images
  function renderGiphy(data) {
    $.each( data , function( index, giphy ) {

      var column    = $('<div class="giphy-col col-xs-12 col-sm-6 col-md-4 col-lg-3">');
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
      });

      userMeta.append( userImg );
      userMeta.append( userName );
      giphyMeta.append( userMeta );
      giphyMeta.append( linkIcon );

      var img = $('<img>');
      img.attr( 'data-gif', giphy.images.downsized.url );

      img.attr({
        src:    giphy.images.fixed_height_still.url,
        width:  giphy.images.fixed_height_still.width,
        height: giphy.images.fixed_height_still.height,
        class: 'giphy-img media-fluid center-block'
      });

      giphyItem.append( img );
      giphyItem.append( giphyMeta );
      column.append( giphyItem );

      // Masonry layout
      $column = $( column );
      $grid.append( $column ).masonry( 'appended', $column );
      $grid.imagesLoaded( function() {
        $grid.masonry('layout');
      });

    });
    
  }

  // function to display tags
  function renderTags() {
    $('#giphy-tags').empty();
    $.each( giphyTags, function( index, val ) {
      var giphyTag = $('<a href="#" class="btn btn-primary btn-tag">').html( val );
      $('#giphy-tags').append( giphyTag );
    });
  }

  // init giphy
  initGiphy( currentTag );

});