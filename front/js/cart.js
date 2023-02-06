// Récupérer les données de l'api
fetch(`http://localhost:3000/api/products`)
  .then((products) => products.json())
  .then((products) => {
    displayProducts(products);
  });

// on récupère le panier
let productsCart = JSON.parse(localStorage.getItem("itemInCart"));

function displayProducts(index) {
  // si il y a un panier avec une taille differante de 0 (donc supérieure à 0)
  if (productsCart && productsCart.length != 0) {
    // zone de correspondance clef/valeur de l'api et du panier grâce à l'id produit choisit dans le localStorage
    for (let choice of productsCart) {
      for (g = 0, h = index.length; g < h; g++) {
        if (choice._id === index[g]._id) {
          // création et ajout de valeurs à panier qui vont servir pour les valeurs dataset
          choice.name = index[g].name;
          choice.prix = index[g].price;
          choice.image = index[g].imageUrl;
          choice.description = index[g].description;
          choice.alt = index[g].altTxt;
        }
      }
    }
    display(productsCart);
  } else {
    //affichage en cas de panier vide
    let cart = document.querySelector("#cart__items");
    const emptyCart = `<p>Le panier est vide</p>`;
    cart.innerHTML = emptyCart;
  }
  //A l'écoute du bouton supprimer
  const btnDeleteItem = document.querySelectorAll(".cart__item .deleteItem");
  btnDeleteItem.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      deleteItemInCart(i);
    });
  });
  //A l'écoute des fonctions de modification quantité et prix total
  quantityModification();
  totalProduct();
}

//Affichage du panier sous forme de tableau
function display(productInCart) {
  // on déclare et on pointe la zone d'affichage
  let cart = document.querySelector("#cart__items");
  // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
  cart.innerHTML += productInCart
    .map(
      (
        choice
      ) => `<article class="cart__item" data-id="${choice._id}" data-color="${choice.couleur}" data-price="${choice.prix}" data-quantity="${choice.quantité}">
<div class="cart__item__img">
  <img src="${choice.image}" alt="${choice.alt}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${choice.name}</h2>
    <p>${choice.couleur}</p>
    <p>${choice.prix} €</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choice.quantité}"">
    </div>
    <div class="cart__item__content__settings__delete">
      <p class="deleteItem" id="deleteItem">Supprimer</p>
    </div>
  </div>
</div>
</article>`
    )
    .join("");
}
//-- suppression produit panier--//

function deleteItemInCart(index) {
  let newProductsCart = JSON.parse(localStorage.getItem("itemInCart"));
  newProductsCart.splice(index, 1);

  localStorage.itemInCart = JSON.stringify(newProductsCart);
  //rechargement de la page pour afficher nouveau panier
  return location.reload();
}

//-- modification quantité produit panier--//

function quantityModification() {
  const cart = document.querySelectorAll(".cart__item");

  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      let newCart = JSON.parse(localStorage.getItem("itemInCart"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of newCart)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.color === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.itemInCart = JSON.stringify(newCart);
          // MAJ du dataset quantité
          cart.dataset.quantity = eq.target.value;
          // actualiser les données du prix total
          totalProduct();
        }
    });
  });
}

//-- Total produit Panier --//

function totalProduct() {
  // déclaration variable en tant que nombre
  let totalArticle = 0;
  // déclaration variable en tant que nombre
  let totalPrix = 0;
  const cart = document.querySelectorAll(".cart__item");
  // pour chaque élément cart
  cart.forEach((cart) => {
    //je récupère les quantités des produits grâce au dataset
    totalArticle += JSON.parse(cart.dataset.quantity);
    // création d'un opérateur pour le total produit grâce au dataset
    totalPrix += cart.dataset.quantity * cart.dataset.price;
  });
  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}

//----Formulaire---//

//pointage des éléments du formulaire
let form = document.querySelector(".cart__order__form");
let email = document.querySelector("#email");
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let city = document.querySelector("#city");
let address = document.querySelector("#address");

//Validation email
email.addEventListener("change", function () {
  validEmail(this);
});

const validEmail = function (inputEmail) {
  //creation de la reg exp pour validation email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  //recupération de la balise emailErrorMsg
  let emailErrorMsg = inputEmail.nextElementSibling;
  //test de l'expression email
  if (emailRegExp.test(inputEmail.value)) {
    emailErrorMsg.innerHTML = "";
    return true;
  } else {
    emailErrorMsg.innerHTML = "Adresse Email Non Valide";
    emailErrorMsg.style.color = "white";
    return false;
  }
};
//Validation Prénom
firstName.addEventListener("change", function () {
  validFirstName(this);
});
const validFirstName = function (inputFirstName) {
  //creation de la reg exp pour validation prénom

  let firtNameRegExp = new RegExp("[A-zàâäãåçéèêëíìîïñóòôöõúùûüýÿæœs-]$");

  let firstNameErrorMsg = inputFirstName.nextElementSibling;
  if (firtNameRegExp.test(inputFirstName.value)) {
    firstNameErrorMsg.innerHTML = "";
    return true;
  } else {
    firstNameErrorMsg.innerHTML = "Non valide";
    firstNameErrorMsg.style.color = "white";
    return false;
  }
};

//Validation Nom
lastName.addEventListener("change", function () {
  validLastName(this);
});
const validLastName = function (inputLastName) {
  //creation de la reg exp pour validation nom

  let LastNameRegExp = new RegExp("[A-zàâäãåçéèêëíìîïñóòôöõúùûüýÿæœs-]$");

  let LastNameErrorMsg = inputLastName.nextElementSibling;
  if (LastNameRegExp.test(inputLastName.value)) {
    LastNameErrorMsg.innerHTML = "";
    return true;
  } else {
    LastNameErrorMsg.innerHTML = "Non valide";
    LastNameErrorMsg.style.color = "white";
    return false;
  }
};

//Validation Adresse
address.addEventListener("change", function () {
  validAddress(this);
});
const validAddress = function (inputAddress) {
  //creation de la reg exp pour validation adresse

  let addressRegExp = new RegExp("[A-zàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ0-9._-]s*$");

  let addressErrorMsg = inputAddress.nextElementSibling;
  if (addressRegExp.test(inputAddress.value)) {
    addressErrorMsg.innerHTML = "";
    return true;
  } else {
    addressErrorMsg.innerHTML = "Non valide";
    addressErrorMsg.style.color = "white";
    return false;
  }
};

//Validation Ville
city.addEventListener("change", function () {
  validCity(this);
});
const validCity = function (inputCity) {
  //creation de la reg exp pour validation ville

  let cityRegExp = new RegExp("[A-zàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ0-9._-]s*$");

  let cityErrorMsg = inputCity.nextElementSibling;
  if (cityRegExp.test(inputCity.value)) {
    cityErrorMsg.innerHTML = "";
    return true;
  } else {
    cityErrorMsg.innerHTML = "Non valide";
    cityErrorMsg.style.color = "white";
    return false;
  }
};

// définition du panier qui ne comportera que les id des produits choisi du local storage
let products = [];
function tableauId() {
  // appel des ressources
  let panier = JSON.parse(localStorage.getItem("itemInCart"));
  // récupération des id produit dans products
  if (panier && panier.length > 0) {
    for (let indice of panier) {
      products.push(indice._id);
    }
  }
}

//Ecouter la validation de la commande
form.addEventListener("submit", function (e) {
  e.preventDefault();
  tableauId();
  //vérification des données du formulaire
  if (
    validAddress(form.address) &&
    validCity(form.city) &&
    validEmail(form.email) &&
    validLastName(form.lastName) &&
    validFirstName(form.firstName)
  ) {
    const contact = {
      email: document.querySelector("#email").value,
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      city: document.querySelector("#city").value,
      address: document.querySelector("#address").value,
    };
    //récupétation des valeurs du form dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));
    //Définition des informations à transmettre
    const informationToSend = {
      contact,
      products,
    };
    //envoyer vers le serveur
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",

      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(informationToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        //
        localStorage.setItem("orderId", data.orderId);
        document.location.href = "confirmation.html";
      })
      .catch((err) => {
        alert("Il y a eu une erreur : " + err);
      });
  }
});
