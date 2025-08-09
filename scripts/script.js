/* code à potentiel de recyclage
let button = document.getElementById('language');
    button.addEventListener('click', function() {
        console.log(langue);
    });
*/


 document.addEventListener('DOMContentLoaded', function() {
    /*
    Initialisation du site avec l'ajout d'une langue en sessionStorage (par défaut fr) et le chargement par défaut de la page d'accueil.
    Création des divs de titre et sous-titre qui verront leur contenu changer pendant la navigation.
    */

    sessionStorage.setItem('langue', 'fr');
    sessionStorage.setItem('currentPage', 'welcome');
    sessionStorage.setItem('previousPage', '');
    loadWelcome(sessionStorage.getItem('langue'));

    let titre = divTextCreator('id', 'titre');
    let description = divTextCreator('id', 'description');
    document.getElementById('header').appendChild(titre);
    document.getElementById('header').appendChild(description);
});


function changeLanguage(language) {
    sessionStorage.setItem('langue', language);
    switch(sessionStorage.getItem('currentPage')) {
        case 'brand':
            loadBrand(sessionStorage.getItem('langue'), sessionStorage.getItem('currentBrand'));
            break;
        case 'model':
            loadModel(sessionStorage.getItem('langue'), sessionStorage.getItem('currentModel'));
            break;
        default:
            loadWelcome(sessionStorage.getItem('langue'));
            break;
    }
    console.log(sessionStorage.getItem('langue'));
}

function loadWelcome(language){

    sessionStorage.setItem('currentPage', 'welcome');
    document.getElementById('content').innerHTML = '';

    fetchJSON(language, 'welcome').then(data => {
        document.getElementById('titre').textContent = data.title;
        document.getElementById('description').textContent = data.subTitle;

        const content = document.getElementById('content');
        content.innerHTML = '';

        const brands = data.brands;
        Object.entries(brands).forEach(([key, brand]) => {

            let divCurrentBrand = document.createElement('div');
            divCurrentBrand.id = key;
            divCurrentBrand.className = "brands";
            
            /* Première version du bouton qui est la plus "simple" puis qu'elle consiste à ajouter l'attribut onclick
            divCurrentBrand.setAttribute('onclick', `loadBrand('${language}', '${key}')`);
            */
            // Version 2 plus lisible
            divCurrentBrand.addEventListener('click', () => {
                loadBrand(language, key);
            });

            let divCurrentBrandTitle = divTextCreator('class', 'brandNames', brand.name);
            let divCurrentBrandDescription = divTextCreator('class', 'brandDescriptions', brand.description);
            let divCurrentBrandImage = divImageCreator('logos', brand.image);

            divCurrentBrand.appendChild(divCurrentBrandTitle, divCurrentBrandDescription);
            divCurrentBrand.appendChild(divCurrentBrandDescription);
            divCurrentBrand.appendChild(divCurrentBrandImage);
            document.getElementById('content').appendChild(divCurrentBrand);
        })
    });
}

function loadBrand(language, currentBrand){

    sessionStorage.setItem('currentPage', 'brand');
    sessionStorage.setItem('currentBrand', currentBrand);
    document.getElementById('content').innerHTML = '';

    fetchJSON(language, 'brand').then(data => {
        const marque = currentBrand;

        document.getElementById('titre').textContent = marque;
        document.getElementById('description').textContent = 'Voici les modèles iconiques de ' + marque;

        let divModels = document.createElement('div');

        const models = data[currentBrand];
        console.log(models);
        let count = 1;

        Object.values(models).forEach( model => {

            let divCurrentModel = document.createElement('div');
            divCurrentModel.id = 'model' + count;
            divCurrentModel.className = 'models';

            let divModelName = divTextCreator('class', 'modelNames', model.name);
            let divModelDescription = divTextCreator('class', 'modelDescriptions', model.description);
            let divModelImage = divImageCreator('modelsPhoto', model.img);

            divCurrentModel.appendChild(divModelName);
            divCurrentModel.appendChild(divModelDescription);
            divCurrentModel.appendChild(divModelImage);
            
            divCurrentModel.addEventListener('click', () => {
                loadModel(language, model.name, currentBrand);
            })

            document.getElementById('content').appendChild(divCurrentModel);

           console.log(model);
           count++;
        })

        console.log('currentPage', sessionStorage.getItem('currentPage'));
        console.log('previousPage', sessionStorage.getItem('previousPage'));
    });

}

function loadModel(language, currentModel, currentBrand){

    document.getElementById('content').innerHTML = '';
    sessionStorage.setItem('currentModel', currentModel)

    let divCurrentModelTitre = divTextCreator('id', 'modelName', 'LA PAGE DU MODELE ' + currentModel);
    let divCurrentModelDescription = divTextCreator('id', 'modelDescription', 'DKFJJ');
/*
    fetchJSON(language, 'model').then(data => {

    })
*/
    document.getElementById('content').appendChild(divCurrentModelTitre);
    console.log('la page pour la marque => ' + currentBrand);
    console.log('la page pour le modèle => ' + currentModel);
};

function fetchJSON(langue, jsonFile){
    if(!langue && !jsonFile){
        console.log('Aucune langue et/ou fichier json spécifié en paramètre');
        return null;
    }
    else if(!(langue === 'fr' || langue === 'nl' || langue === 'en')){
        console.log('Erreur nom de la langue');
        return null;
    }
    else if(!(jsonFile === 'welcome' || jsonFile === 'model' || jsonFile === 'brand')){
        console.log('Erreur nom du fichier JSON');
        return null;
    }

    // Récupération des données du JSON
    return fetch(`../datas/${langue}/${jsonFile}.json`)
        .then(data => {
            return data.json();
        })
        .catch(error => {
            console.error('Erreur du chargement du json', error);
            return Promise.reject(error);
        })
}

function divTextCreator(attribute, name, content){
    /*
    cette fonction a pour but d'automatiser la création de div contenant du texte dans le HTML, il faut spécifier l'attribut 
    (tel que id ou classe), le nom de cet attribut, le type de ce que contiendra la div et son contenu.
    */

    if(attribute === null || name === null || content === null){
        console.log('erreur dans la création de la vie, il faut noter "img" ou "text" pour spécifier le type');
        return null;
    } 

    let div = document.createElement('div');
    div.setAttribute(attribute, name);
    div.textContent = content;
    return div;
}

function divImageCreator(className, url){
    /*
    cette fonction a pour but d'automatiser la création des balises img dans le HTML. 
    Il faut spécifier le nom de la classe et la source de l'image.
    */

    if(className === null || url === null){
        console.log("erreur dans la création de la balise d'image");
        return null;
    } 

    const img = document.createElement('img');
    img.className = className;
    img.src = url;
    img.alt = 'Image';
    return img;
}