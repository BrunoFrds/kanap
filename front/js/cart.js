//------ Affichage des produits séléctionnés dans la page panier ------//

// Récupération des données dans le local Storage
let getPanier = JSON.parse(localStorage.getItem("cart"));

// Création d'une boucle qui va parcourir chaque produit dans le panier
for (const produitPanier of getPanier) {
  // Ajout d'une variable pour la section cart__items
  const cartItems = document.getElementById("cart__items");

  // Création et ajout de l'article cart__item
  const cartItem = document.createElement("article");
  cartItems.appendChild(cartItem);
  cartItem.classList.add("cart__item");

  // Création et ajout de la div cart__item__img
  const cartItemImg = document.createElement("div");
  cartItem.appendChild(cartItemImg);
  cartItemImg.classList.add("cart__item__img");

  // Création et ajout de la div cart__item__content
  const cartItemContent = document.createElement("div");
  cartItem.appendChild(cartItemContent);

  // Création et ajout de la div contenant le nom, la couleur et le prix du produit
  const cartItemContentDescription = document.createElement("div");
  cartItemContent.appendChild(cartItemContentDescription);

  // Création et ajout de la couleur
  const cartItemColor = document.createElement("p");
  cartItemColor.innerHTML = produitPanier[0].color;
  cartItemContentDescription.appendChild(cartItemColor);

  //Création et ajout du nom, du prix et de l'image à partir des données de l'API

  // Envoie de la requête HTTP auprès du service web
  fetch("http://localhost:3000/api/products/" + produitPanier[0].id)
    // Récupération des données depuis l'API
    .then((response) => response.json())

    // Transfert des données de l'API vers le panier
    .then((dataProduct) => {
      //Création et ajout de l'image
      const imgCartItem = document.createElement("img");
      const altCartItem = document.createElement("p");
      imgCartItem.src = dataProduct.imageUrl;
      imgCartItem.setAttribute(
        "alt",
        (altCartItem.innerHTML = dataProduct.altTxt)
      );
      cartItemImg.appendChild(imgCartItem);

      // Ajout du nom
      const cartItemName = document.createElement("h2");
      cartItemName.innerHTML = dataProduct.name;
      cartItemContentDescription.appendChild(cartItemName);

      // Ajout du prix
      const cartItemPrice = document.createElement("p");
      cartItemPrice.innerHTML = dataProduct.price + " €";
      cartItemPrice.classList.add("itemPrice");
      cartItemContentDescription.appendChild(cartItemPrice);
    });

  //--- Possibilité de changer la quantité ---//

  // Création et ajout de la div cart__item__content__settings
  const cartItemContentSettings = document.createElement("div");
  cartItemContent.appendChild(cartItemContentSettings);

  // Création et ajout de la div contenant la quantité
  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
  const cartItemQuantity = document.createElement("p");
  cartItemQuantity.innerHTML = "Qté : ";
  cartItemContentSettingsQuantity.appendChild(cartItemQuantity);

  // Création de l'input quantité
  const itemQuantity = document.createElement("input");
  itemQuantity.setAttribute("type", "number");
  itemQuantity.classList.add("itemQuantity");
  itemQuantity.setAttribute("name", "itemQuantity");
  itemQuantity.setAttribute("min", "1");
  itemQuantity.setAttribute("max", "100");
  itemQuantity.value = produitPanier[0].quantity;
  cartItemContentSettingsQuantity.appendChild(itemQuantity);

  // Création d'une dataset pour l'id, la couleur des produits et la quantité dans les inputs
  itemQuantity.setAttribute("data-id", produitPanier[0].id);
  itemQuantity.setAttribute("data-color", produitPanier[0].color);
  itemQuantity.setAttribute("data-value", produitPanier[0].quantity);

  // Création d'un évènement au changement de la valeur dans le champs de texte
  itemQuantity.addEventListener("change", (event) => {
    // Création d'une variable pour la nouvelle valeur de l'input
    let inputValue = event.target.valueAsNumber;

    // Modification de la data-value avec la nouvelle valeur
    itemQuantity.setAttribute("data-value", inputValue);

    if (
      produitPanier[0].id == itemQuantity.dataset.id &&
      produitPanier[0].color == itemQuantity.dataset.color
    ) {
      // Modification de la quantité du produit dans le tableau du panier et enregistrement dans le local storage
      (produitPanier[0].quantity = Number(itemQuantity.dataset.value)),
        localStorage.setItem("cart", JSON.stringify(getPanier));
    }
    // Rechargement de la page au changement de la quantité
    window.location.reload();
  });

  //--- Possibilité de supprimer un produit ---//

  // Création et ajout du bouton supprimer
  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
  const buttonDelete = document.createElement("button");
  buttonDelete.innerHTML = "Supprimer";
  buttonDelete.classList.add("btnDelete");
  cartItemContentSettingsDelete.appendChild(buttonDelete);

  // Création d'une dataset pour l'id et la couleur des produits dans les boutons "supprimer"
  buttonDelete.setAttribute("data-id", produitPanier[0].id);
  buttonDelete.setAttribute("data-color", produitPanier[0].color);

  // Création d'un évènement au click du bouton "supprimer"
  buttonDelete.addEventListener("click", () => {
    // On filtre le panier
    getPanier = getPanier.filter(
      (product) =>
        product[0].id != buttonDelete.dataset.id ||
        product[0].color != buttonDelete.dataset.color
    );

    // On envoie le nouveau tableau de produit dans le local storage
    localStorage.setItem("cart", JSON.stringify(getPanier));

    // Rechargement de la page à la suppression du produit
    window.location.reload();
  });
}

//--- Ajout de la quantité totale et du prix total ---/

// Création d'une variable pour le span "totalQuantity"
const totalQuantity = document.getElementById("totalQuantity");

// Création d'une variable pour la quantité totale
let totalQuantityValue = 0;

// Création d'une boucle qui va parcourir les éléments du panier
for (const productQuantity of getPanier) {
  // Nombre de produits total
  totalQuantityValue += productQuantity[0].quantity;

  // Ajout du total dans le span
  totalQuantity.innerHTML = totalQuantityValue;
}

// Création d'une variable pour le span "totalPrice"
const totalPrice = document.getElementById("totalPrice");

// Création d'une variable pour le prix total
let totalPriceValue = 0;

// Création d'une boucle qui va parcourir les éléments du panier
for (const productPrice of getPanier) {
  // Récupération du prix de chaque produit

  // Envoie de la requête HTTP auprès du service web
  fetch("http://localhost:3000/api/products/" + productPrice[0].id)
    // Récupération des données depuis l'API
    .then((response) => response.json())

    // Transfert des données de l'API vers le panier
    .then((dataPrice) => {
      const itemPrice = dataPrice.price;

      // Prix total de chaque lot d'article
      let totalPriceProduct = productPrice[0].quantity * itemPrice;

      // Prix total du panier
      totalPriceValue += totalPriceProduct;

      // Ajout du total dans le span
      totalPrice.innerHTML = totalPriceValue;
    });
}

//------ Formulaire ------//

// Création de variables pour les différents éléments du formulaire

const cartOrderForm = document.querySelector(".cart__order__form");

const firstNameClient = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");

const lastNameClient = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

const addressClient = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");

const cityClient = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");

const emailClient = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Création de variables pour les valeurs du formulaire
let firstNameValue, lastNameValue, addressValue, cityValue, emailValue;

//--- Validation des champs de texte ---//

// Création de variable Regex pour les prénom ,nom et ville
const regexName = /^[a-zA-ZÀ-ÿ-\s]{3,20}$/;

// Création d'une variable Regex pour l'adresse
const regexAddress = /^[0-9]+[\s]+[a-zA-ZÀ-ÿ-\s]+$/;

// Création d'une variable Regex pour l'email
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Ajout de conditions pour vérifier la validité des données du formulaire avec regex
firstNameClient.addEventListener("change", (text) => {
  firstNameValue;
  if (regexName.test(firstNameClient.value) == true) {
    firstNameErrorMsg.innerHTML = "";
    firstNameValue = text.target.value;
  } else {
    firstNameErrorMsg.innerHTML = "Champs invalide.";
  }
});

lastNameClient.addEventListener("change", (text) => {
  lastNameValue;
  if (regexName.test(lastNameClient.value) == true) {
    lastNameErrorMsg.innerHTML = "";
    lastNameValue = text.target.value;
  } else {
    lastNameErrorMsg.innerHTML = "Le nom est invalide.";
  }
});

addressClient.addEventListener("change", (text) => {
  addressValue;
  if (regexAddress.test(addressClient.value) == true) {
    addressErrorMsg.innerHTML = "";
    addressValue = text.target.value;
  } else {
    addressErrorMsg.innerHTML = "L'adresse est invalide.";
  }
});

cityClient.addEventListener("change", (text) => {
  cityValue;
  if (regexName.test(cityClient.value) == true) {
    cityErrorMsg.innerHTML = "";
    cityValue = text.target.value;
  } else {
    cityErrorMsg.innerHTML = "Le nom de la ville est invalide.";
  }
});

emailClient.addEventListener("change", (text) => {
  emailValue;
  if (regexEmail.test(emailClient.value) == true) {
    emailErrorMsg.innerHTML = "";
    emailValue = text.target.value;
  } else {
    emailErrorMsg.innerHTML = "L'email est invalide.";
  }
});

//--- Validation du formulaire et envoie vers la page confirmation ---//

// Création d'un évènement à la validation du formulaire
cartOrderForm.addEventListener("submit", (event) => {
  // Ajout d'un preventDefaut pour empêcher la page de recharger au click
  event.preventDefault();

  // Envoie des valeurs validées du formulaire vers le local storage ainsi que les id des produits sous forme de tableau
  if (
    firstNameValue &&
    lastNameValue &&
    addressValue &&
    cityValue &&
    emailValue
  ) {
    //  Récupération de l'id des produits dans un tableau pour l'envoi vers le back-end
    const idData = JSON.parse(localStorage.getItem("cart"));

    // Création d'un tableau vide qui contiendra les id des produits
    let products = [];

    // Boucle pour récupérer les id de chaques produits du panier dans le tableau
    for (const idProduct of idData) {
      products.push(idProduct[0].id);
    }

    // Envoie du formulaire validé et des id des produits vers le local storage
    const clientData = {
      // Création d'un objet formulaire contenant les données du formulaire
      contact: {
        firstName: firstNameValue,
        lastName: lastNameValue,
        address: addressValue,
        city: cityValue,
        email: emailValue,
      },
      products,
    };
    // Envoie vers le local storage
    localStorage.setItem("client", JSON.stringify(clientData));

    //--- Récupération du numéro de commande ---//

    // Requête POST sur l'API
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })
      // Récupération des données dans la réponse de la requête
      .then((response) => response.json())
      .then((data) => {
        let responseServer = data;

        // Récupération de l'id de la commande
        const orderedId = responseServer.orderId;

        // Lien vers la page de confirmation
        window.location = "confirmation.html?id=" + orderedId;
      });
  }
});
