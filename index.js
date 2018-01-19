'use strict';

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.

const STORE = {
  items :[
    { name: 'apples', checked: false, searchResult: true },
    { name: 'oranges', checked: false, searchResult: true },
    { name: 'milk', checked: true, searchResult: true },
    { name: 'bread', checked: false, searchResult: true }
  ],
  showChecked: false,
  searching: '',
  
};

/**
 * push the list to the DOM
 */
function renderShoppingList() {
  let renderedItems = arrayMap(STORE.items);
  $('.js-shopping-list').html(renderedItems);
}

/**
 * map over the STORE array
 * @param {array} arr 
 */
function arrayMap(arr) {
  return arr.map((item, index) => itemToHTML(item, index));
}


/**
 * pull values from STORE
 * @param {object} item 
 * @param {number} index 
 */
function itemToHTML(item, index) {
  return `
    <li class="js-item-index-element ${(STORE.showChecked && item.checked) || item.searchResult === false ? 'hidden' : ''}" data-item-index="${index}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>
  `;
}



function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('submit', event => {
    event.preventDefault();
    const input = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    STORE.items.push(createNewStoreEntry(input));
    renderShoppingList();
  });
  console.log('`handleNewItemSubmit` ran');
}

function createNewStoreEntry(input) {
  return {
    name: input,
    checked: false,
    searchResult: true
  };
}

function getId(event) {
  return event
    .closest('li')
    .attr('data-item-index');
}
/**
 * listen for when 'check' is clicked on the DOM
 * adjust 'checked' property 
 * re-render page
 */
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    let itemID = getId($(event.currentTarget));
    STORE.items[itemID].checked = !STORE.items[itemID].checked;
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    let itemID = getId($(event.currentTarget));
    STORE.items.splice(itemID, 1);
    renderShoppingList();
  });
}

// press a toggle to show all items or unchecked items
function handleShowChecked() {
  $('#js-showChecked').on('click', event => {
    STORE.showChecked = !STORE.showChecked;
    renderShoppingList();
  });
}

/**
 * User can type in a search term and get a filtered item list by title
 */
function handleSearch() {
  $('.js-shopping-list-search').on('keyup', event => {
    STORE.searching = $('.js-shopping-list-search').val();
    STORE.items.forEach(function (item) {
      item.name.substr(0, STORE.searching.length) !== STORE.searching ? item.searchResult = false : item.searchResult = true ;
    });
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleShowChecked();
  handleSearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
