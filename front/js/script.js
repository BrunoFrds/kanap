//------ Affichage des produits dans la page d'accueil à partir des données de l'API ------//

// Envoie de la requête HTTP auprès du service web
fetch("http://localhost:3000/api/products")
  // Récupération des données depuis l'API
  .then((response) => response.json())

  // Transfert des données de l'API vers la page d'accueil
  .then((dataItem) => {
    // Boucle permettant de générer les cards des différents produits
    for (const infoItem of dataItem) {
      const dataId = infoItem._id;
      const dataAlt = infoItem.altTxt;
      const dataName = infoItem.name;
      const dataDescription = infoItem.description;

      // Création d'une variable pour l'élément items
      const items = document.getElementById("items");

      // Création du lien produit et ajout dans la section "items"
      const lienItem = document.createElement("a");
      items.appendChild(lienItem);
      lienItem.classList.add("lienItem");

      // Création d' un évènement renvoyant à la page produit
      lienItem.addEventListener("click", () => {
        window.location = "product.html?id=" + dataId;
      });

      // Création de la card produit et ajout dans le lien
      const cardItem = document.createElement("article");
      lienItem.appendChild(cardItem);
      cardItem.classList.add("cardItem");

      // Création de l'élément pour l'image
      const imgItem = document.createElement("img");
      const altItem = document.createElement("p");
      imgItem.src = infoItem.imageUrl;
      imgItem.setAttribute("alt", (altItem.innerHTML = dataAlt));
      imgItem.classList.add("imgItem");

      // Création de l'élément pour le nom
      const nameItem = document.createElement("h3");
      nameItem.classList.add("productName");

      // Création de l'élément pour la description
      const descriptionItem = document.createElement("p");
      descriptionItem.classList.add("productDescription");

      // Ajout des éléments image, nom et description dans la card
      cardItem.appendChild(imgItem);
      cardItem.appendChild(nameItem);
      cardItem.appendChild(descriptionItem);

      // Affichage des informations "nom" et "description"
      nameItem.innerHTML = dataName;
      descriptionItem.innerHTML = dataDescription;
    }
  });
