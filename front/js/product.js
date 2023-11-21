//------ Affichage du produit séléctionné dans la page produit ------//

// Récupération de l'URL de la page affiché
const urlProduct = new URL(window.location.href);

// Récupération de l'id de l'URL en question
const urlId = urlProduct.searchParams.get("id");

// Envoie de la requête HTTP auprès du service web
fetch("http://localhost:3000/api/products/" + urlId)
  // Récupération des données depuis l'API
  .then((response) => response.json())

  // Transfert des données de l'API vers la page produit
  .then((dataKanap) => {
    const idKanap = dataKanap._id;
    const imgKanap = dataKanap.imageUrl;
    const altKanap = dataKanap.altTxt;
    const nameKanap = dataKanap.name;
    const priceKanap = dataKanap.price;
    const descriptionKanap = dataKanap.description;

    // Création de la variable pour la div image
    const itemImg = document.getElementsByClassName("item__img");

    // Création de l'élément image et ajout à la div
    const itemImgKanap = document.createElement("img");
    const itemAltKanap = document.createElement("p");
    itemImgKanap.src = dataKanap.imageUrl;
    itemImgKanap.setAttribute("alt", (itemAltKanap.innerHTML = altKanap));
    itemImg[0].appendChild(itemImgKanap);

    // Création et ajout des variable pour les éléments nom et prix
    const itemTitle = document.getElementById("title");
    const itemPrice = document.getElementById("price");
    itemTitle.innerHTML = nameKanap;
    itemPrice.innerHTML = priceKanap;

    // Création et ajout de la variable pour la description
    const itemDescription = document.getElementById("description");
    itemDescription.innerHTML = descriptionKanap;

    //--- Selection des couleurs ---//

    // Création d'une variable pour la liste des couleurs
    const colorKanap = dataKanap.colors;

    // Création d'une variable pour le select
    const selectColors = document.getElementById("colors");
    for (const color of colorKanap) {
      // Création et insertion des choix de couleur
      const colorOptionNew = document.createElement("option");
      colorOptionNew.value = color;
      colorOptionNew.text = color;

      // Ajout des options au select
      selectColors.appendChild(colorOptionNew);
    }

    // Création d'une variable pour le bouton "Ajouter au panier"
    const btnPanier = document.getElementById("addToCart");

    // Ajout d'un évènement pour empêcher le bouton d'actualiser la page
    btnPanier.addEventListener("click", (Event) => {
      Event.preventDefault();

      // Création de variables pour la couleur, la quantité et l'id
      let color = document.querySelector("#colors").value;
      let quantityChoice = document.querySelector("#quantity").value;
      let quantity = Number(quantityChoice);
      let id = idKanap;

      //Création d'une variable pour tester et stopper la boucle
      let boucle = 0;

      // Création d'un tableau contenant l'id, la couleur et la quantité
      let infoKanap = [{ id, color, quantity }];

      // Récupération des données du local storage
      let produitPanier = JSON.parse(localStorage.getItem("cart"));

      // Condition pour savoir si le local storage est vide ou pas
      // Si vide, alors création d'un nouveau tableau et ajout du produit
      if (!produitPanier) {
        produitPanier = [];
        produitPanier.push(infoKanap);
        localStorage.setItem("cart", JSON.stringify(produitPanier));
      }
      // Si non vide, alors création d'une boucle qui va parcourir les produits du local storage
      else {
        for (const infoProduit of produitPanier) {
          // Si l'id et la couleur sont les mêmes alors on incrémente la quantité
          if (infoProduit[0].id === id && infoProduit[0].color === color) {
            infoProduit[0].quantity += quantity;
            boucle = 1;
          }
        }
        //Si l'id ou la couleur sont différentes, alors on ajoute le produit
        if (boucle == 0) {
          produitPanier.push(infoKanap);
        }

        localStorage.setItem("cart", JSON.stringify(produitPanier));
      }
    });
  });
