//Storage controller - Will be responsible for adding/removing items to/from localStorage
StorageCtrl = (function() {
  return {
    addItemToLocalStorage: function(name, cost, id) {}
  };
})();
//Item controller
ItemCtrl = (function() {
  // const Item = function(name, cost, id) {
  //   this.name = name;
  //   this.cost = cost;
  //   this.id = id;

  const data = {
    items: [],
    currentItem: null,
    totalCosts: 0
  };

  //Public methods
  return {
    logData: function() {
      return data;
    },

    getItems: function() {
      return data.items;
    },

    addItem: function(name, cost) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Parse cost to int
      cost = parseInt(cost);
      const newItem = { name: name, cost: cost, id: ID };
      data.items.push(newItem);
    },

    getCurrentId: function() {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id;
      } else {
        ID = 0;
      }

      return ID;
    },

    setCurrentItem: function(id) {
      id = id.split("-");
      id = parseInt(id[1]);

      data.items.forEach(function(item) {
        if (item.id === id) {
          data.currentItem = {
            name: item.name,
            cost: item.cost,
            id: id
          };
        }
      });
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    updateItem: function(name, cost) {
      const currentItem = data.currentItem;
      data.items.forEach(function(item) {
        if (currentItem.id === item.id) {
          item.name = name;
          item.cost = cost;
        }
      });
    },

    deleteItem: function(id) {
      data.items.forEach(function(item, index) {
        if (item.id === id) {
          data.items.splice(index, 1);
        }
      });
    },

    clearItems: function() {
      data.items = [];
    }
  };
})();

//Ui controller
const UICtrl = (function() {
  UISelectors = {
    itemsList: "#items-list",
    itemsListItems: "#items-list li",
    nameInput: "#expense-name-input",
    costInput: "#expense-amount-input",
    addBtn: ".add-btn",
    editBtn: ".edit-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn"
  };

  return {
    loadItems: function(items) {
      let html = "";

      items.forEach(function(item) {
        html += `
          <li class="item" id="item-${item.id}">
          <div><strong>${item.name}:</strong>${item.cost}</div>
          <i class="edit-item fa fa-pencil" aria-hidden="true"></i>
          </li>
      
        `;
      });

      document.querySelector(UISelectors.itemsList).innerHTML = html;
    },

    addItemList: function(name, cost, id) {
      const li = document.createElement("li");

      li.classList.add("item");
      li.id = `item-${id}`;

      li.innerHTML = `
      <div><strong>${name}:</strong>${cost}</div>
          <i class="edit-item fa fa-pencil" aria-hidden="true"></i>`;

      document
        .querySelector(UISelectors.itemsList)
        .insertAdjacentElement("beforeend", li);
    },

    getInputValues: function() {
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        cost: document.querySelector(UISelectors.costInput).value
      };
    },

    getSelectors: function() {
      return UISelectors;
    },

    clearInputValues: function() {
      (document.querySelector(UISelectors.nameInput).value = ""),
        (document.querySelector(UISelectors.costInput).value = "");
    },

    setInputValues: function(name, cost) {
      document.querySelector(UISelectors.nameInput).value = name;
      document.querySelector(UISelectors.costInput).value = cost;
    },

    editStateOn: function() {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.editBtn).style.display = "inline";
    },
    editStateOff: function() {
      document.querySelector(UISelectors.addBtn).style.display = "block";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.editBtn).style.display = "none";
    },

    updateItemList: function(name, cost, idToUpdate) {
      let listItems = document.querySelectorAll(UISelectors.itemsListItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        let id = listItem.id;
        id = id.split("-");
        id = parseInt(id[1]);

        if (id === idToUpdate) {
          document.querySelector(`#item-${idToUpdate}`).innerHTML = `
          <div><strong>${name}:</strong>${cost}</div>
          <i class="edit-item fa fa-pencil" aria-hidden="true"></i>
          `;
        }
      });
    },

    deleteItemList: function(idToDelete) {
      let listItems = document.querySelectorAll(UISelectors.itemsListItems);
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        let id = listItem.id;
        id = id.split("-");
        id = parseInt(id[1]);

        if (id === idToDelete) {
          document.querySelector(`#item-${idToDelete}`).remove();
        }
      });
    },

    clearItemsList: function() {
      let itemsList = document.querySelectorAll(UISelectors.itemsListItems);
      itemsList = Array.from(itemsList);

      itemsList.forEach(function(item) {
        item.remove();
      });
    }
  };
})();

//App controler
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListeners = function() {
    const selectors = UICtrl.getSelectors();

    //Add event listeners

    document
      .querySelector(selectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    document
      .querySelector(selectors.itemsList)
      .addEventListener("click", itemUpdateClick);

    document
      .querySelector(selectors.editBtn)
      .addEventListener("click", itemUpdateSubmit);

    document
      .querySelector(selectors.backBtn)
      .addEventListener("click", itemBackClick);

    document
      .querySelector(selectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    document
      .querySelector(selectors.clearBtn)
      .addEventListener("click", clearItemsSubmit);
  };

  itemAddSubmit = function(e) {
    const inputValues = UICtrl.getInputValues();

    if (inputValues.name !== "" && inputValues.cost !== "") {
      //Add new item to structure
      ItemCtrl.addItem(inputValues.name, inputValues.cost);

      //get id newly created item
      const currentId = ItemCtrl.getCurrentId();

      //Add new item to UI
      UICtrl.addItemList(inputValues.name, inputValues.cost, currentId);

      //Add to localStorage
      StorageCtrl.addItemToLocalStorage(
        inputValues.name,
        inputValues.cost,
        currentId
      );

      //Clear input values
      UICtrl.clearInputValues();
    }

    e.preventDefault();
  };

  itemUpdateClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      const id = e.target.parentNode.id;

      //Set Current Item
      ItemCtrl.setCurrentItem(id);

      const currentItem = ItemCtrl.getCurrentItem();

      //Set current input values
      UICtrl.setInputValues(currentItem.name, currentItem.cost);

      //Fill values with current item's data
      UICtrl.getInputValues(currentItem.name, currentItem.cost);
      UICtrl.editStateOn(); //Turn on edit state
    }
  };

  itemUpdateSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();
    const newInput = UICtrl.getInputValues();

    //Update item in file structure
    ItemCtrl.updateItem(newInput.name, newInput.cost);

    //Update item in UI
    UICtrl.updateItemList(newInput.name, newInput.cost, currentItem.id);

    //Turn off edit state
    UICtrl.editStateOff();
    //Clear inputs
    UICtrl.clearInputValues();
    e.preventDefault();
  };

  itemBackClick = function(e) {
    UICtrl.editStateOff();

    e.preventDefault();
  };

  itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete item from file structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete item from UI
    UICtrl.deleteItemList(currentItem.id);
    //Clear Inputs
    UICtrl.clearInputValues();
    e.preventDefault();
  };

  clearItemsSubmit = function(e) {
    //Clear items from file structure
    ItemCtrl.clearItems();

    //Clear items from UI
    UICtrl.clearItemsList();

    e.preventDefault();
  };

  return {
    init() {
      const items = ItemCtrl.getItems();

      UICtrl.editStateOff();

      if (items.length > 0) {
        UICtrl.loadItems(items);
      }

      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();
