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

const STORE = [
  { name: 'apples', checked: false },
  { name: 'oranges', checked: false },
  { name: 'milk', checked: true },
  { name: 'bread', checked: false }
];

/**
 * push the list to the DOM
 */
function renderShoppingList() {
  let renderedItems = arrayMap(STORE);
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
    <li class="js-item-index-element" data-item-index="${index}">
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
    STORE.push(createNewStoreEntry(input));
    renderShoppingList();
  });
  console.log('`handleNewItemSubmit` ran');
}

function createNewStoreEntry(input) {
  return {
    name: input,
    checked: false
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
    STORE[itemID].checked = !STORE[itemID].checked;
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    let itemID = getId($(event.currentTarget));
    STORE.splice(itemID, 1);
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
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
