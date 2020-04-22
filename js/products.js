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
  });
  };