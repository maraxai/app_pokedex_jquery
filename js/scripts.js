// IIFE
var $pokemonRepository = (function() {
  var $pokemons = [];

  // API to pull pokemon data
  var $apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // DOM elements, list of buttons and button eventhandler
  function addListItem(item) {
    var $ul = $('ul');
    var $li = $('<li></li>');
    var $btn = $('<button></button>');
    $btn.addClass('listButton');
    $btn.text(item.name);
    $ul.append($li);
    $li.append($btn);

    $btn.on('click', function() {
      showDetails(item);
    });
  }

  // loads detail data from array and displays them in the modal
  function showDetails(item) {
    $pokemonRepository.loadDetails(item).then(function() {
      showModal(item.name, item.imageUrl, item.height, item.types);
    });
  }

  // DOM elements of the modal modal
  function showModal(name, image, height, types) {
    var $modalContainer = $('#modal-container');
    $modalContainer.addClass('is-visible');

    $modalContainer.html('');

    var $modal = $('<div></div>');
    $modal.addClass('modal');
    var $closeButtonElement = $('<button></button>');
    $closeButtonElement.addClass('modal-close');
    $closeButtonElement.text('close');
    $closeButtonElement.on('click', hideModal);
    var $contentNameElement = $('<h1></h1>');
    $contentNameElement.text(name);
    var $contentImageElement = $('<img>');
    $contentImageElement.attr('src', image);
    //  $contentImageElement.image(image);
    var $contentHeightElement = $('<p></p>');
    $contentHeightElement.text('height: ' + height + ' inches');

    var $contentTypesElement = $('<p></p>');
    $contentTypesElement.text('types: ' + types);

    $modal.append($closeButtonElement);
    $modal.append($contentNameElement);
    $modal.append($contentImageElement);
    $modal.append($contentHeightElement);
    $modal.append($contentTypesElement);
    $modalContainer.append($modal);
  }

  // hides modal
  function hideModal() {
    var $modalContainer = $('#modal-container');
    $modalContainer.removeClass('is-visible');
    //  $('.modal').empty();  does not work
    //  $('.modal').reset(); // does not work
    //    $('.modal').remove(); WORKS but no longer necessary bc syntax of .html('') is fixed
  }

  // adds an API record to the array $pokemons with the .push method
  function add(item) {
    $pokemons.push(item);
  }

  //return all records from the array $pokemons
  function getAll() {
    return $pokemons;
  }

  // function loads the API list - promise, asynchronous function
  function loadList() {
    return $.ajax($apiUrl)
      .then(function(response) {
        response.results.forEach(function(item) {
          var $pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add($pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // similar to lines 66-80, i.e. asynchronous function, get details from API
  function loadDetails(item) {
    var $url = item.detailsUrl;
    return $.ajax($url)
      .then(function(details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // close modal with close-button
  var $closeButtonElement = $('<button></button>');
  $closeButtonElement.addClass('modal-close');
  $closeButtonElement.text('close');
  $closeButtonElement.on('click', hideModal);

  // close modal with esc
  $(window).on('keydown', e => {
    var $modalContainer = $('#modal-container');
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  // close modal by clicking somewhere in the modal container
  var $modalContainer = $('#modal-container');
  $modalContainer.on('click', e => {
    var target = e.target;
    if ($(target).is($modalContainer)) {
      hideModal();
    }
  });

  // returns all functions
  return {
    add: add,
    getAll: getAll,
    //search: search,
    loadList: loadList,
    showDetails: showDetails,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showModal: showModal,
    hideModal: hideModal,
  };
  //close modal by clicking outside the modal
})();
//END OF IIFE

// calls the data from within the IIFE
$pokemonRepository.loadList().then(function() {
  $pokemonRepository.getAll().forEach(function($pokemon) {
    $pokemonRepository.addListItem($pokemon);
  });
});
