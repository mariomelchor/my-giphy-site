$(document).ready(function() {

  // init Masonry after all images have loaded
  var $grid = $('#giphy-row').imagesLoaded( function() {
    $grid.masonry({
      itemSelector: '.giphy-col',
      columnWidth: '.giphy-col',
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

  // Handlebars Template
  var source = $('#giphy-template').html();
  var template = Handlebars.compile(source);

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
  function initGiphy(tag) {
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

      // Giphy object to handlebars template
      var html = template(giphy);
      var $column = $(html);
 
      // Append columns and re-render masonry
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
  initGiphy(currentTag);

});