//Storage controller - Will be responsible for adding/removing items to/from localStorage

//Item controller
ItemCtrl = (function() {
  // const Item = function(name, cost, id) {
  //   this.name = name;
  //   this.cost = cost;
  //   this.id = id;

  const data = {
    items: [
      {
        name: "Taxes",
        cost: 30,
        id: 0
      },
      {
        name: "Car Repair",
        cost: 150,
        id: 1
      },
      {
        name: "Bus Ticket",
        cost: 5,
        id: 2
      }
    ],
    curentItem: null,
    totalCosts: 0
  };

  //Public methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, cost) {
      const ID = data.items[data.items.length - 1].id + 1;
      //Parse cost to int
      cost = parseInt(cost);
      const newItem = { name: name, cost: cost, id: ID };
      data.items.push(newItem);
    }
  };
})();

//Ui controller
const UICtrl = (function() {
  UISelectors = {
    itemsList: "#items-list",
    nameInput: "#expense-name-input",
    costInput: "#expense-amount-input",
    addBtn: ".add-btn"
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

    addItemList: function(name, cost) {
      const li = document.createElement("li");

      li.classList.add("item");

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
    }
  };
})();

//App controler
const AppCtrl = (function(ItemCtrl, UICtrl) {
  const loadEventListeners = function() {
    const selectors = UICtrl.getSelectors();

    document
      .querySelector(selectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };
  //Add event listeners

  itemAddSubmit = function(e) {
    const inputValues = UICtrl.getInputValues();

    //Add new item to structure

    if (inputValues.name !== "" && inputValues.cost !== "") {
      ItemCtrl.addItem(inputValues.name, inputValues.cost);

      //Add new item to UI
      UICtrl.addItemList(inputValues.name, inputValues.cost);

      //Clear input values
      UICtrl.clearInputValues();
    }

    e.preventDefault();
  };

  return {
    init() {
      const items = ItemCtrl.getItems();

      if (items.length > 0) {
        UICtrl.loadItems(items);
      }

      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

AppCtrl.init();
