// Récupération de l'id du produit via l' URL
//la variable params récupère l'url de la page

let params = new URLSearchParams(document.location.search);

// la variable id va récupérer la valeur du paramètre _id
let id = params.get("_id");

const imageAlt = document.querySelector("article div.item__img");
const titre = document.getElementById("title");
const prix = document.getElementById("price");
const description = document.getElementById("description");
const boutonAdd = document.getElementById("addToCart");

getArticles();

function getArticles() {
  // On récupère uniquement le produit dont on a besoin via le paramètre dans la requête
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (response) {
      return response.json();
    })

    .catch((error) => {
      document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    })

    .then(function (produitsKanap) {
      // On place les données reçues via l'API aux bons endroits sur la page
      produit = produitsKanap;
      imageAlt.innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
      titre.textContent = produit.name;
      prix.textContent = produit.price;
      description.textContent = produit.description;
      let couleurOption = document.getElementById("colors");
      for (let couleur of produit.colors) {
        // ajout des balises d'option couleur avec leur valeur
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      }
    });
}

let productAdded = {
  _id: id,
};

//choix couleur dynamique
let colorChoice = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
colorChoice.addEventListener("input", (ec) => {
  let productColor;
  // on récupère la valeur de la cible de l'évenement dans couleur
  productColor = ec.target.value;
  // on ajoute la couleur à l'objet du panier
  productAdded.couleur = productColor;
});

// choix quantité dynamique
let selectQuantity = document.querySelector('input[id="quantity"]');
let productQuantity;

selectQuantity.addEventListener("input", (eq) => {
  // on récupère la valeur de la cible de l'évenement dans couleur
  productQuantity = eq.target.value;
  // on ajoute la quantité à l'objet du panier
  productAdded.quantité = productQuantity;
});

const addToCartButton = document.querySelector("#addToCart");

// On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :

addToCartButton.addEventListener("click", () => {
  if (
    // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
    productAdded.quantité < 1 ||
    productAdded.quantité > 100 ||
    productAdded.quantité === undefined ||
    productAdded.couleur === "" ||
    productAdded.couleur === undefined
  ) {
    // joue l'alerte
    alert(
      "Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100"
    );
    // si ça passe le controle
  } else {
    let productsCart = JSON.parse(localStorage.getItem("itemInCart"));
    // JSON.parse -> converti données JSON du localstorage en objet javascript

    // si produit présent dans localstorage

    if (productsCart) {
      for (let choice of productsCart) {
        //comparateur d'égalité des articles actuellement choisis et ceux déja choisis
        if (choice._id === id && choice.couleur === productAdded.couleur) {
          // on modifie la quantité d'un produit existant dans le panier du localstorage
          //définition de additionQuantity qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
          let additionQuantity =
            parseInt(choice.quantité) + parseInt(productQuantity);
          // on convertit en JSON le résultat précédent dans la zone voulue
          choice.quantité = JSON.stringify(additionQuantity);
          // on renvoit un nouveau produit dans le localStorage
          return (localStorage.itemInCart = JSON.stringify(productsCart));
        }
      }
      productsCart.push(productAdded);
      localStorage.setItem("itemInCart", JSON.stringify(productsCart));
    }
    // si pas de produit présent dans localstorage
    else {
      productsCart = [];
      productsCart.push(productAdded);
      localStorage.setItem("itemInCart", JSON.stringify(productsCart));
    }
  }
});
