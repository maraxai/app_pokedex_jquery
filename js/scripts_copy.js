// begin IIFE (Immediately Invoked Function Expression), purpose: avoid global pollution
var pokemonRepository = (function() {
  // array for API (Application Program Interface) elements and their properties (Pokemons)
  var pokemons = [];
  // API URL to a database
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  // DOM (Document Object Model) Modification, i.e. creation of HTML elements in conjunction with API records
  function addListItem(pokemon) {
    //DOM search for first <ul> tag in HTML document
    var $ul = document.querySelector('ul');
    //DOM creation of <li> <tag>
    var $li = document.createElement('li');
    //DOM attachment of newly created li element to ul element
    $ul.appendChild($li);
    //DOM creation of button element
    var $btn = document.createElement('button');
    //DOM creation of class indentifier
    $btn.classList.add('listButton');
    $li.appendChild($btn);
    $btn.innerText = pokemon.name;


    // select the div for the PokemonDetails
  //  var $PokemonDiv = document.querySelector('div');
    //add a class name
//    $PokemonDiv.classList.add('pokemonDetails');
    /*add event listener to button, on 'click', an anonymous function with the parameter 'event' will be executed
    the function invokes the function showDetails and the designated property values of the Pokemon element array are listed
    Interesting: I tried to place the code line31-35 in the showDetails function (because it just makes sense) but somehow
    it did not work and had to place it back here, no detail content if this code is missing*/
    // add event show Pokemon Details
//    $btn.addEventListener('click', function (event) {
  //    showDetails(pokemon);
//    });
    // add event open model
    $btn.addEventListener('click', function () {
      showModal(pokemon.name, 'Hi Svenja, I want the properties of height, type and of course the image, right here! Can you please show me how to do it. ');
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
    var $modalContainer = document.querySelector('#modal-container');
  //  var $PokemonDiv = document.querySelector('div');
    $modalContainer.innerHTML = 'name: ' + item.name + '<br>' +
    '<img src="' + item.imageUrl + '" >' + '<br>' +
      'height: ' + item.height + ' inches'+'<br>' +
      'type: ' + item.types ;
      console.log(item.name);
//    $btn.addEventListener('click', function (event) {
//        showModal('test', 'more tests');
//      });
    });
  }
  // adds an API record to the array pokemons with the .push method
  function add(item) {
    pokemons.push(item);
  }
  //return all records from the array pokemons
  function getAll() {
    return pokemons;
  }
  // function loads the API list -
  function loadList() {
    /* 'fetch' requests the API data,
    a promise with a resolved (.then()) and a rejection case (.catch())
    is returned with the .json() method - here's the asynchronous function
    NO REAL CLUE WHAT IS REALLY GOING ON HERE - I WOULD HAVE TO CHECK
    THIS OUT ON MY OWN, LINE BY LINE, FOR 2 WEEKS AT LEAST*/
    return fetch(apiUrl).then(function (response) {
      return response.json();
    })
      .then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
       console.error(e);
     })
  }
  // similar to lines 66-80, i.e. asynchronous function, get details from API
  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
      })
      .then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
      })
      .catch(function (e) {
        console.error(e);
      });
  }

   //code for modal - DOM, add class to div for modal
   function showModal(title, text) {
     var $modalContainer = document.querySelector('#modal-container');
     //$modalContainer.classList.add('is-visible'); //? is removed in example, error?
     // for modal content
     var modal = document.createElement('div');
     modal.classList.add('modal');
     //add modal content
     var closeButtonElement = document.createElement('button');
     closeButtonElement.classList.add('modal-close');
     closeButtonElement.innerText = 'Close';
     closeButtonElement.addEventListener('click', hideModal);

     var titleElement = document.createElement('h1');
     titleElement.innerText = title;

     var contentElement = document.createElement('p');
     contentElement.innerText = text;

     modal.appendChild(closeButtonElement);
     modal.appendChild(titleElement);
     modal.appendChild(contentElement);
     $modalContainer.appendChild(modal);

     $modalContainer.classList.add('is-visible');


  }

  //  document.querySelector('#show-modal').addEventListener('click', () => {
  //    showModal('different Title', 'Different text! Pay Attention!');
  //  });

    function hideModal() {
      var $modalContainer = document.querySelector('#modal-container');
      $modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
      var $modalContainer = document.querySelector('#modal-container');
      if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
        hideModal();

      }
    });


   // I guess this is a better way to NOT forget the returns of all functions?
   return {
     add: add,
     getAll: getAll,
     //search: search,
     loadList: loadList,
     showDetails : showDetails,
     loadDetails: loadDetails,
     addListItem : addListItem
   };

})();
//END OF IIFE

/*the remaining codes calls functions within the IIFE /
function loadList is applied as a method to the array of pokemons / .then() refers
to promises but where is the promise here?
I HAVE NO CLUE WHAT IS REALLY GOING ON HERE, IT'S A FUNCTION IN THE FUNCTION IN THE FUNCTION*/
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon){
      //the function addListItem is applied as a method to the array of the records / DOM
      pokemonRepository.addListItem(pokemon);
    });
});
