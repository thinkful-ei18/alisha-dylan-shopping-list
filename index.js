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
  items: [
    { name: 'apples', checked: false, isEditing: false},
    { name: 'oranges', checked: false, isEditing: false},
    { name: 'milk', checked: true, isEditing: false},
    { name: 'bread', checked: false, isEditing: false}
  ],
  showChecked: false,
  search: ''
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
  const isVisible = (STORE.showChecked && item.checked) || search(item) === false
    ? 'hidden'
    : '';
  // make check button toggle text content
  const isChecked = item.checked ? 'shopping-item__checked' : '';
  let itemHtml = `
      <span class="shopping-item js-shopping-item ${isChecked}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>   
  `;
  if (item.isEditing) {
    itemHtml = `
    <form id='js-editing-form'>
      <input type='text' value ='${item.name}' id='js-edit-value'>
        <div class="shopping-item-controls">
          <button class="shopping-item-confirm js-item-confirm">
              <span class="button-label">confirm</span>
          </button>
          <button class="shopping-item-cancel js-item-cancel">
              <span class="button-label">cancel</span>
          </button>
        </div> 
      </form>
      `;
  }
  return `<li class="js-item-index-element ${isVisible}" data-item-index="${index}">
      ${itemHtml}
    </li>`;
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('submit', event => {
    event.preventDefault();
    const input = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    STORE.items.push(createNewStoreEntry(input));
    renderShoppingList();
  });
}

function createNewStoreEntry(input) {
  return {
    name: input,
    checked: false,
    isEditing: false
  };
}

function getId(event) {
  return event.closest('li').attr('data-item-index');
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
  $('#js-search-form').on('submit', event => {
    event.preventDefault();
    STORE.search = $('.js-shopping-list-search').val();   
    renderShoppingList();
  });
}

function search(item) {
  // console.log(item);
  if (STORE.search !== ''){
    console.log(item.name.substr(0, STORE.search.length) === STORE.search);
    return item.name.substr(0, STORE.search.length) === STORE.search;
  }
  return true;
}

function handleEdit(){
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    edit(event);
  });
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    edit(event);
  });
}

function edit(event){
  let itemID = getId($(event.currentTarget));
  STORE.items[itemID].isEditing = true;
  renderShoppingList();
}

function handleEditConfirm(){
  $('.js-shopping-list').on('click', '.js-item-confirm', event => {
    event.preventDefault();
    let itemID = getId($(event.currentTarget));
    STORE.items[itemID].name = $('#js-edit-value').val();
    STORE.items[itemID].isEditing = false;
    renderShoppingList();
  });
}

function handleEditCancel(){
  $('.js-shopping-list').on('click', '.js-item-cancel', event => {
    event.preventDefault();
    let itemID = getId($(event.currentTarget));
    STORE.items[itemID].isEditing = false;
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
  handleEdit();
  handleEditConfirm();
  handleEditCancel();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
