/*Génération de l'URL de l'API selon le choix de produit à vendre
**********************************************/

const produitSell = "cameras"  //Au choix entre : "cameras" - "furniture" - "teddies"
const APIURL = "http://localhost:3000/api/" + produitSell + "/";

//id du produit pour permettre un tri dans l'API

let idProduit = "";

/*Préparation des requis pour le script
**********************************************/

/*L'utilisateur à besoin d'un panier dans le localStorage de son navigateur
Vérifier si le panier existe dans le localStorage, sinon le créer et l'envoyer dans le localStorage au premier chargement du site quelque soit la page*/

if(localStorage.getItem("userPanier")){
	console.log("Administration : le panier de l'utilisateur existe dans le localStorage");
}else{
	console.log("Administration : Le panier n'existe pas, il va être créer et l'envoyer dans le localStorage");
  	//Le panier est un tableau de produits
  	let panierInit = [];
  	localStorage.setItem("userPanier", JSON.stringify(panierInit));
  };

  	//Tableau et objet demandé par l'API pour la commande
  	let contact;
  	let products = [];

	//L'user a maintenant un panier
	let userPanier = JSON.parse(localStorage.getItem("userPanier"));

/*Appel de l'API
**********************************************/

getProduits = () =>{
	return new Promise((resolve) =>{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Administration : connection ok");

				//L'appel est réussi => suppression des message d'erreur
				error = document.getElementById("error");
				//On supprime le message d'erreur s'il existe
				if(error){
					error.remove();
				}
			}else{
				console.log("Administration : ERROR connection API");
			}
		}
		request.open("GET", APIURL + idProduit);
		request.send();
	});
};


/*Création du HTML après appel de l'API
**********************************************/

	//Build la liste des produits en vente sur la page index
	async function allProductsList(){
		const produits = await getProduits();

		//Création de la section accueillant la liste des produits
		let listProduct = document.createElement("section")
		listProduct.setAttribute("class", "list-product");
		//Ajout de la section dans le HTML
		let main = document.getElementById("main");
		main.appendChild(listProduct);

		//Pour chaque produit de l'API on créé l'encadré HTML du produit
		produits.forEach((produit) =>
		{ 
      	//création des élements de la structure de la liste des produits en vente
      	//Une div conteneur/2 div(block gauche et droit)/une image/le nom(titre)/le prix(p)/le lien(a)
      	let produitBlock = document.createElement("div");
      	let produitLeft = document.createElement("div");
      	let produitRight = document.createElement("div");
      	let produitImage = document.createElement("img");
      	let produitNom = document.createElement("h2");
      	let produitPrix = document.createElement("p");
      	let produitLink = document.createElement("a");

      	//Ajout des attributs au balise pour la création du style via le css
      	produitBlock.setAttribute("class", "list-product__block");
      	produitLeft.setAttribute("class", "list-product__block--left");
      	produitRight.setAttribute("class", "list-product__block--right");
      	produitImage.setAttribute("src", produit.imageUrl);
      	produitImage.setAttribute("alt", "image du produit"); 
      	produitLink.setAttribute("href", "product.html?id=" + produit._id);

     	//Block conteneur en flex
      	//Block gauche comprend l'image du produit
     	//Bloc droit comprend le nom/prix/le lien du produit
     	listProduct.appendChild(produitBlock);
     	produitBlock.appendChild(produitLeft);
     	produitLeft.appendChild(produitImage);
     	produitBlock.appendChild(produitRight);
     	produitRight.appendChild(produitNom);
     	produitRight.appendChild(produitPrix);
     	produitRight.appendChild(produitLink);

      	//Déterminer le contenu des balises
      	produitNom.textContent = produit.name;
      	produitPrix.textContent = produit.price / 100 + " euros";
      	produitLink.textContent = "Voir le produit";
      });
	};

/*Build de la page du produit sélectionné
**********************************************/

async function detailProduit(){
    //Collecter l'URL après le ?id= pour le récupérer uniquement sur l'API
    idProduit = location.search.substring(4);
    const produitSelected = await getProduits();
    console.log("Administration : Vous regardez la page du produit id_"+produitSelected._id);

    //Faire apparaitre la fiche produit initialement en display none
    let section = document.getElementById("section");
    section.style.display = "block";
    
    //Remplissage de la fiche produit
    document.getElementById("imgProduct").setAttribute("src", produitSelected.imageUrl);
    document.getElementById("nameProduct").innerHTML = produitSelected.name;
    document.getElementById("descriptionProduct").innerHTML = produitSelected.description;
    document.getElementById("priceProduct").innerHTML = produitSelected.price / 100 + " euros";

    
    //Selon le type de produit (ligne 3) création des options
    switch(produitSell){
    	case "cameras":
    	produitSelected.lenses.forEach((produit)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = produit;
    	});
    	break;
    	case "furniture":
    	produitSelected.varnish.forEach((produit)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = produit;
    	});
    	break;
    	case "teddies":
    	produitSelected.colors.forEach((produit)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = produit;
    	});
    	break;
    	default:
    	console.log("Administration : Veuillez bien renseigner la variable produitSell ligne 2 du fichier script.js");
    }
};

 /*Fonction ajouter le produit au panier de l'utilisateur
 **********************************************/
 addPanier = () =>{
  	//Au clic de l'user pour mettre le produit dans le panier
  	let inputBuy = document.getElementById("ajouterProduitPanier");
  	inputBuy.addEventListener("click", async function() {
  		const produits = await getProduits();
  	//Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
  	userPanier.push(produits);
  	localStorage.setItem("userPanier", JSON.stringify(userPanier));
  	console.log("Administration : le produit a été ajouté au panier");
  	alert("Vous avez ajouté ce produit dans votre panier")
  });
  };

/*Page panier
**********************************************/

addition = () =>{
    //Vérifie si un prduit est dans le panier
    if(JSON.parse(localStorage.getItem("userPanier")).length > 0){
      //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif
      document.getElementById("panierVide").remove();

      //Création de la structure principale du tableau  
      let facture = document.createElement("table");
      let ligneTableau = document.createElement("tr");
      let colonneNom = document.createElement("th");
      let colonnePrixUnitaire = document.createElement("th");
      let colonneRemove = document.createElement("th");
      let ligneTotal = document.createElement("tr");
      let colonneRefTotal = document.createElement("th");
      let colonnePrixPaye = document.createElement("td");

      //Placement de la structure dans la page et du contenu des entetes
      let factureSection = document.getElementById("basket-resume");
      factureSection.appendChild(facture);
      facture.appendChild(ligneTableau);
      ligneTableau.appendChild(colonneNom);
      colonneNom.textContent = "Nom du produit";
      ligneTableau.appendChild(colonnePrixUnitaire);
      colonnePrixUnitaire.textContent = "Prix du produit";
      /*ligneTableau.appendChild(colonneRemove);
      colonneRemove.textContent = "Annuler un produit";
      */

      //Pour chaque produit du panier, on créé une ligne avec le nom, le prix
      
      //Init de l'incrémentation de l'id des lignes pour chaque produit
      let i = 0;
      
      JSON.parse(localStorage.getItem("userPanier")).forEach((produit)=>{
        //Création de la ligne
        let ligneProduit = document.createElement("tr");
        let nomProduit = document.createElement("td");
        let prixUnitProduit = document.createElement("td");
        let removeProduit = document.createElement("i");

        //Attribution des class pour le css
        ligneProduit.setAttribute("id", "produit"+i);
        removeProduit.setAttribute("id", "remove"+i);
        removeProduit.setAttribute('class', "fas fa-trash-alt annulerProduit");
        //Pour chaque produit on créer un event sur l'icone de la corbeille pour annuler ce produit
        //bind permet de garder l'incrementation du i qui représente l'index tu panier au moment de la création de l'event
        //annulerProduit L233
        removeProduit.addEventListener('click', annulerProduit.bind(i));
        i++;

        //Insertion dans le HTML
        facture.appendChild(ligneProduit);
        ligneProduit.appendChild(nomProduit);
        ligneProduit.appendChild(prixUnitProduit);
        ligneProduit.appendChild(removeProduit);

        //Contenu des lignes
        nomProduit.innerHTML = produit.name;
        prixUnitProduit.textContent = produit.price / 100 + " €";
    });

      //Dernière ligne du tableau : Total
      facture.appendChild(ligneTotal);
      ligneTotal.appendChild(colonneRefTotal);
      colonneRefTotal.textContent = "Total à payer"
      ligneTotal.appendChild(colonnePrixPaye);
      colonnePrixPaye.setAttribute("id", "sommeTotal")

      //Calcule de l'addition total
      let totalPaye = 0;
      JSON.parse(localStorage.getItem("userPanier")).forEach((produit)=>{
      	totalPaye += produit.price / 100;
      });

      //Affichage du prix total à payer dans l'addition
      console.log("Administration : " + totalPaye);
      document.getElementById("sommeTotal").textContent = totalPaye + " €";
  };
}

  //Supprimer un produit du panier
  annulerProduit = (i) =>{
  	console.log("Administration : Enlever le produit à l'index " + i);
      //recupérer le array
      userPanier.splice(i, 1); 
      console.log("Administration : " + userPanier);
      //vide le localstorage
      localStorage.clear();
      console.log("Administration : localStorage vidé");
      // mettre à jour le localStorage avec le nouveau panier
      localStorage.setItem('userPanier', JSON.stringify(userPanier));
      console.log("Administration : localStorage mis à jour");
      //relancer la création de l'addition
      window.location.reload();
  };

/*Formulaire et vérif etat panier
**********************************************/

  //vérifie les inputs du formulaire
  checkInput = () =>{
    //Controle Regex
    let checkString = /[a-zA-Z]/;
    let checkNumber = /[0-9]/;
    //Source pour vérification email => emailregex.com
    let checkMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/y;
    let checkSpecialCharacter = /[§!@#$%^&*(),.?":{}|<>]/;

    //message fin de controle
    let checkMessage = "";

    //Récupération des inputs
    let formNom = document.getElementById("formNom").value;
    let formPrenom = document.getElementById("formPrenom").value;
    let formMail = document.getElementById("formMail").value;
    let formAdresse = document.getElementById("formAdresse").value;
    let formVille = document.getElementById("formVille").value;


      //tests des différents input du formulaire
        //Test du nom => aucun chiffre ou charactère spécial permis
        if(checkNumber.test(formNom) == true || checkSpecialCharacter.test(formNom) == true || formNom == ""){
        	checkMessage = "Vérifier/renseigner votre nom";
        }else{
        	console.log("Administration : Nom ok");
        };
        //Test du nom => aucun chiffre ou charactère spécial permis
        if(checkNumber.test(formPrenom) == true || checkSpecialCharacter.test(formPrenom) == true || formPrenom == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre prénom";
        }else{
        	console.log("Administration : Prénom ok");
        };
        //Test du mail selon le regex de la source L256
        if(checkMail.test(formMail) == false){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre email";
        }else{
        	console.log("Administration : Adresse mail ok");
        };
        //Test de l'adresse => l'adresse ne contient pas obligatoirement un numéro de rue mais n'a pas de characteres spéciaux
        if(checkSpecialCharacter.test(formAdresse) == true || formAdresse == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre adresse";
        }else{
        	console.log("Administration : Adresse ok");
        };
        //Test de la ville => aucune ville en France ne comporte de chiffre ou charactères spéciaux
        if(checkSpecialCharacter.test(formVille) == true && checkNumber.test(formVille) == true || formVille == ""){
        	checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre ville"
        }else{
        	console.log("Administration : Ville ok")
        };
        //Si un des champs n'est pas bon => message d'alert avec la raison
        if(checkMessage != ""){
        	alert("Il est nécessaire de :" + "\n" + checkMessage);
        }
        //Si tout est ok construction de l'objet contact => a revoir
        else{
        	contact = {
        		firstName : formNom,
        		lastName : formPrenom,
        		address : formAdresse,
        		city : formVille,
        		email : formMail
        	};
        	return contact;
        };
    };

  //Vérification du panier
  checkPanier = () =>{
  //Vérifier qu'il y ai au moins un produit dans le panier
  let etatPanier = JSON.parse(localStorage.getItem("userPanier"));
  //Si le panier est vide ou null (suppression localStorage par)=>alerte
  if(etatPanier == null){
	//Si l'utilisateur à supprimer son localStorage etatPanier sur la page basket.html et qu'il continue le process de commande
	alert("Il y a eu un problème avec votre panier, une action non autorisée a été faite. Veuillez recharger la page pour la corriger");
	return false
}else if(etatPanier.length < 1 || etatPanier == null){
	console.log("Administration: ERROR =>le localStorage ne contient pas de panier")
	alert("Votre panier est vide");
	return false;
}else{
	console.log("Administration : Le panier n'est pas vide")
    //Si le panier n'est pas vide on rempli le products envoyé à l'API
    JSON.parse(localStorage.getItem("userPanier")).forEach((produit) =>{
    	products.push(produit._id);
    });
    console.log("Administration : Ce tableau sera envoyé à l'API : " + products)
    return true;
}
};

/*Envoi du formulaire
**********************************************/

  //Fonction requet post de l'API
  envoiDonnees = (objetRequest) => {
  	return new Promise((resolve)=>{
  		let request = new XMLHttpRequest();
  		request.onreadystatechange = function() {
  			if(this.readyState == XMLHttpRequest.DONE && this.status == 201) 
  			{
          //Sauvegarde du retour de l'API dans la sessionStorage pour affichage dans order-confirm.html
          sessionStorage.setItem("order", this.responseText);

          //Chargement de la page de confirmation
          document.forms["form-panier"].action = './order-confirm.html';
          document.forms["form-panier"].submit();

          resolve(JSON.parse(this.responseText));
      }
  };
  request.open("POST", APIURL + "order");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(objetRequest);
});
  };

  //Au click sur le btn de validation du formulaire
  validForm = () =>{
    //Ecoute de l'event click du formulaire
    let btnForm = document.getElementById("envoiPost");
    btnForm.addEventListener("click", function(){
      //Lancement des verifications du panier et du form => si Ok envoi
      if(checkPanier() == true && checkInput() != null){
      	console.log("Administration : L'envoi peut etre fait");
      //Création de l'objet à envoyer
      let objet = {
      	contact,
      	products
      };
      console.log("Administration : " + objet);
     //Conversion en JSON
     let objetRequest = JSON.stringify(objet);
     console.log("Administration : " + objetRequest);
     //Envoi de l'objet via la function
     envoiDonnees(objetRequest);

     //Une fois la commande faite retour à l'état initial des tableaux/objet/localStorage
     contact = {};
     products = [];
     localStorage.clear();
 }else{
 	console.log("Administration : ERROR");
 };
});
};

/*Affichage des informations sur la page de confirmation
**********************************************/
resultOrder = () =>{
	if(sessionStorage.getItem("order") != null){
    //Parse du session storage
    let order = JSON.parse(sessionStorage.getItem("order"));
    //Implatation de prénom et de id de commande dans le html sur la page de confirmation
    document.getElementById("lastName").innerHTML = order.contact.lastName
    document.getElementById("orderId").innerHTML = order.orderId
    
    //Suppression de la clé du sessionStorage pour renvoyer au else si actualisation de la page ou via url direct
    sessionStorage.removeItem("order");
}else{
  //avertissement et redirection vers l'accueil
  alert("Aucune commande passée, vous êtes arrivé ici par erreur");
  window.open("./index.html");
}
}