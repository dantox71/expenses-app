//Storage controller
StorageCtrl = (() => {
  return {
    getItemsFromLocalStorage: () => {
      let items = JSON.parse(localStorage.getItem("items"));

      if (items === null) {
        return [];
      } else {
        return items;
      }
    },

    addItemToLocalStorage: (name, cost, id) => {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      items.push({ name: name, cost: cost, id: id });

      localStorage.setItem("items", JSON.stringify(items));
    },
    updateItemInLocalStorage: (newName, newCost, id) => {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(item => {
        if (item.id === id) {
          item.name = newName;
          item.cost = newCost;
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFomLocalStorage: id => {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromLocalStorage: id => {
      localStorage.clear("items");
    }
  };
})();
//Item controller
ItemCtrl = (() => {
  const data = {
    items: [],
    currentItem: null,
    totalCosts: 0
  };

  //Public methods
  return {
    logData: () => {
      return data;
    },

    getItems: () => {
      return data.items;
    },

    setData: () => {
      if (JSON.parse(localStorage.getItem("items")) === null) {
        data.items = [];
      } else {
        data.items = JSON.parse(localStorage.getItem("items"));
      }
    },

    addItem: (name, cost) => {
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

    getCurrentId: () => {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id;
      } else {
        ID = 0;
      }

      return ID;
    },

    setCurrentItem: id => {
      id = id.split("-");
      id = parseInt(id[1]);

      data.items.forEach(item => {
        if (item.id === id) {
          data.currentItem = {
            name: item.name,
            cost: item.cost,
            id: id
          };
        }
      });
    },

    getCurrentItem: () => {
      return data.currentItem;
    },

    updateItem: (name, cost) => {
      const currentItem = data.currentItem;
      data.items.forEach(item => {
        if (currentItem.id === item.id) {
          item.name = name;
          item.cost = cost;
        }
      });
    },

    deleteItem: id => {
      data.items.forEach((item, index) => {
        if (item.id === id) {
          data.items.splice(index, 1);
        }
      });
    },

    clearItems: () => {
      data.items = [];
    }
  };
})();

//Ui controller
const UICtrl = (() => {
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
    loadItems: items => {
      let html = "";

      items.forEach(item => {
        html += `
          <li class="item" id="item-${item.id}">
          <div><strong>${item.name}:</strong>${item.cost}</div>
          <i class="edit-item fa fa-pencil" aria-hidden="true"></i>
          </li>
      
        `;
      });

      document.querySelector(UISelectors.itemsList).innerHTML = html;
    },

    addItemList: (name, cost, id) => {
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

    getInputValues: () => {
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        cost: document.querySelector(UISelectors.costInput).value
      };
    },

    getSelectors: () => {
      return UISelectors;
    },

    clearInputValues: () => {
      (document.querySelector(UISelectors.nameInput).value = ""),
        (document.querySelector(UISelectors.costInput).value = "");
    },

    setInputValues: (name, cost) => {
      document.querySelector(UISelectors.nameInput).value = name;
      document.querySelector(UISelectors.costInput).value = cost;
    },

    editStateOn: () => {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.editBtn).style.display = "inline";
    },
    editStateOff: () => {
      document.querySelector(UISelectors.addBtn).style.display = "block";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.editBtn).style.display = "none";
    },

    updateItemList: function(name, cost, idToUpdate) {
      let listItems = document.querySelectorAll(UISelectors.itemsListItems);

      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
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

    deleteItemList: idToDelete => {
      let listItems = document.querySelectorAll(UISelectors.itemsListItems);
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        let id = listItem.id;
        id = id.split("-");
        id = parseInt(id[1]);

        if (id === idToDelete) {
          document.querySelector(`#item-${idToDelete}`).remove();
        }
      });
    },

    clearItemsList: () => {
      let itemsList = document.querySelectorAll(UISelectors.itemsListItems);
      itemsList = Array.from(itemsList);

      itemsList.forEach(item => {
        item.remove();
      });
    }
  };
})();

//App controler
const AppCtrl = ((ItemCtrl, StorageCtrl, UICtrl) => {
  const loadEventListeners = () => {
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

  itemAddSubmit = e => {
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

  itemUpdateClick = e => {
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

  itemUpdateSubmit = e => {
    const currentItem = ItemCtrl.getCurrentItem();
    const newInput = UICtrl.getInputValues();

    //Update item in file structure
    ItemCtrl.updateItem(newInput.name, newInput.cost);

    //Update item in UI
    UICtrl.updateItemList(newInput.name, newInput.cost, currentItem.id);

    //Update item in localStorage
    StorageCtrl.updateItemInLocalStorage(
      newInput.name,
      newInput.cost,
      currentItem.id
    );

    //Turn off edit state
    UICtrl.editStateOff();
    //Clear inputs
    UICtrl.clearInputValues();
    e.preventDefault();
  };

  itemBackClick = e => {
    UICtrl.editStateOff();

    e.preventDefault();
  };

  itemDeleteSubmit = e => {
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete item from file structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete particular item from localStorage
    StorageCtrl.deleteItemFomLocalStorage(currentItem.id);

    //Delete item from UI
    UICtrl.deleteItemList(currentItem.id);

    //Cler edit state
    UICtrl.editStateOff();
    //Clear Inputs
    UICtrl.clearInputValues();
    e.preventDefault();
  };

  clearItemsSubmit = e => {
    //Clear items from file structure
    ItemCtrl.clearItems();

    //Clear all items from localStorage
    StorageCtrl.clearItemsFromLocalStorage();

    //Clear items from UI
    UICtrl.clearItemsList();

    e.preventDefault();
  };

  return {
    init() {
      const items = StorageCtrl.getItemsFromLocalStorage();
      //Set data structure
      ItemCtrl.setData();

      UICtrl.editStateOff();

      if (items.length > 0) {
        UICtrl.loadItems(items);
      }

      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();
