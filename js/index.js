const contentElt = document.querySelector('.content');
const tagIngredientElt = document.querySelector('.ingredients-container');
const tagAppareilsElt = document.querySelector('.appareils-container');
const tagUstensilesElt = document.querySelector('.ustensiles-container');

const typeTags = {
    ingredient: 'ingredient',
    appareil: 'appareil',
    ustensile: 'ustensile'
};

let dataOriginal;
let actualData;
let indexFactoryModel;

async function fetchData(){
    try {
        const response = await fetch('./data/recipes.json');
        const data = await response.json();

        return data;

    } catch (error) {
        console.log(error);
    }
}

function principalResearch(e, data){
    const nbTagsSelected = document.querySelector('.tags-selected').childElementCount;
    const entryUser = typeof e !== 'string' ? e.target.value.toLowerCase() : e;

    const arrayIngredient = [...document.querySelectorAll('.tags-selected .ingredient')].map(elt => elt.textContent);
    const arrayAppareil = [...document.querySelectorAll('.tags-selected .appareil')].map(elt => elt.textContent);
    const arrayUstensile = [...document.querySelectorAll('.tags-selected .ustensile')].map(elt => elt.textContent);

    if (entryUser.length > 2){
        //si la valeur entrée par l'utilisateur est supérieur à 2
        //on lance la recherche
        cleanAll();
        let valideTags = [];
        
        actualData = [];
        
        for (let recipe of data){

            //si la recette passe le premier test
            let recipeIsValide;
            const researchName = recipe.name.toLowerCase().includes(entryUser) && recipe;
            
            if (researchName){
                valideTags.push(researchName);
                recipeIsValide = true;
            }else{
                const researchDescription = recipe.description.toLowerCase().includes(entryUser) && recipe;

                if (researchDescription){
                    valideTags.push(researchDescription);
                    recipeIsValide = true;
                    
                }else{
                    let researchIngredient;
                    for (let ingredients of recipe.ingredients){
                        const ingredientLow = ingredients.ingredient.toLowerCase();
                        if (ingredientLow.includes(entryUser)){
                            researchIngredient = recipe;
                        }
                    }

                    if (typeof researchIngredient === 'object'){
                        valideTags.push(researchIngredient);
                        recipeIsValide = true;
                    }
                }

            }

            //si je lance ou modifie la recherche principal alors que des tags sont présent
            if ((recipeIsValide && arrayIngredient.length > 0) || (recipeIsValide && arrayAppareil.length > 0) || (recipeIsValide && arrayUstensile.length > 0)){
        
                let result = arrayIngredient.map(ingredient => researchByOneTag(ingredient, recipe, typeTags.ingredient)).filter(recipe => recipe);

                //si la recette match aussi avec les tags ingredients
                if (result.length === arrayIngredient.length){
                    result = arrayAppareil.map(appareil => researchByOneTag(appareil, recipe, typeTags.appareil)).filter(recipe => recipe);
                    //si la recette match avec les tags appareils
                    if(result.length === arrayAppareil.length){
                        result = arrayUstensile.map(ustensile => researchByOneTag(ustensile, recipe, typeTags.ustensile)).filter(recipe => recipe);
                        //si match avec les tags ustensiles
                        if(result.length === arrayUstensile.length){
                            actualData.push(recipe);
                            createCard(recipe);
                        }
                    }
                }

                //la recette est valide et aucun tags n'est présent
            } else if(recipeIsValide){
                actualData.push(recipe);
                createCard(recipe);
            }
        }
        displayTag(valideTags);
        if (valideTags.length === 0){
            noResult();
        }
    }
    else if(nbTagsSelected > 0){
        //si la valeur de l'input est inférieur à 3 et qu'il y a des tags séléctionnées
        //recherche uniquement sur les tags


        cleanAll();

        actualData = data;

        for (let ingredient of arrayIngredient){
            actualData = actualData.map(recipe => researchByOneTag(ingredient, recipe, typeTags.ingredient)).filter(recipe => recipe);
            console.log(actualData);
        }
        for (let appareil of arrayAppareil){
            actualData = actualData.map(recipe => researchByOneTag(appareil, recipe, typeTags.appareil)).filter(recipe => recipe);
            console.log(actualData);
        }
        for (let ustensile of arrayUstensile){
            actualData = actualData.map(recipe => researchByOneTag(ustensile, recipe, typeTags.ustensile)).filter(recipe => recipe);
            console.log(actualData);
        }

        console.log(actualData);
        actualData.map(recipe => createCard(recipe));

    }
    else if (nbTagsSelected === 0){
        //si il n'y a aucun tag
        actualData = dataOriginal;
        cleanAll();
        displayData(data);
    }
}

function researchByOneTag(tag, data, typeTag){

    if (typeTag === 'ingredient'){
        let researchIngredient;
        for (let ingredients of data.ingredients){
            const ingredientLow = ingredients.ingredient.toLowerCase();
            let tagRegex;
    
    
            if (!tag.includes('(')){
                //si il n'y a pas de parenthèse on utilise la regex
                tagRegex = RegExp(tag, 'm');
    
                if (ingredientLow.match(tagRegex)){
                    researchIngredient = data;
                }
    
            } else{
                //sinon on utilise include
                if (tag.includes(ingredientLow)){
                    researchIngredient = data;
                }
            }
    
        }
        
        if (typeof researchIngredient === 'object'){         
            return researchIngredient;
        }
    } 
    else if (typeTag === 'appareil'){
        const researchAppliance = data.appliance.toLowerCase().includes(tag) && data;

        if (researchAppliance){
            return researchAppliance;
        }
    }
    else if (typeTag === 'ustensile'){
        const researchUstensils = data.ustensils.map(value =>{
            const UstensilsLow = value.toLowerCase();
            if (UstensilsLow.includes(tag)){
                return data;
            }
        }).filter(value => value);
                
        if (researchUstensils.length > 0){
            return researchUstensils[0];
        }
                
    }

}


function createCard(data){
    const cardElt = indexFactoryModel.getCardRecipes(data);
    contentElt.appendChild(cardElt);
}


function displayTag(data){

    //tags
    let tabIngredient = [];
    let tabAppareils = [];
    let tabUstensiles = [];

    //on récupère les différents tags des recettes
    for (recipe of data){
        for (ingredient of recipe.ingredients){
            // on ajoute tous les ingredients
            tabIngredient.push(ingredient.ingredient.toLowerCase());
        }
        for (ustensil of recipe.ustensils){
            // on ajoute tous les ustensiles
            tabUstensiles.push(ustensil.toLowerCase());
        }
        // on ajoute tous les appareils
        tabAppareils.push(recipe.appliance.toLowerCase());
    }

    //on enlève les doublons
    tabIngredient = [...new Set(tabIngredient)];
    const listIngredient = indexFactoryModel.getTagList(tabIngredient, data);
    tagIngredientElt.appendChild(listIngredient);

    tabAppareils = [...new Set(tabAppareils)];
    const listAppareils = indexFactoryModel.getTagList(tabAppareils, data);
    tagAppareilsElt.appendChild(listAppareils);

    tabUstensiles = [...new Set(tabUstensiles)];
    const listUstensiles = indexFactoryModel.getTagList(tabUstensiles, data);
    tagUstensilesElt.appendChild(listUstensiles);
}

//si aucun resultat on affiche un message
function noResult(){
    const nullResult = document.createElement('div');
    nullResult.style.fontWeight = '800';
    nullResult.textContent = 'Aucune recette ne correspond à vos critères';

    contentElt.appendChild(nullResult);
}

function displayData(data){

    //si aucune recette trouvée
    if (data.length === 0) {
        noResult();
    }

    //construction des cards
    const indexFactoryModel = indexFactory(data);
    data.forEach(card => {
        const cardElt = indexFactoryModel.getCardRecipes(card);
        contentElt.appendChild(cardElt);
    });


    
    displayTag(data);

 
    //si on click sur l'input
    tagIngredientElt.addEventListener('click',(e) =>{

        tagIngredientElt.style.height = 'auto';
        tagIngredientElt.style.zIndex = '1';

        const inputElt = tagIngredientElt.querySelector('input')
        inputElt.placeholder = "Rechercher un ingrédient";
        inputElt.style.width = '95%';

        const tagElt = tagIngredientElt.querySelector('.list-tags');
        if (tagElt){
            tagElt.style.display = 'flex';
        }

        
        //permet de sortir de l'event
        if (!document.querySelector('.hidden-condition')){
            const hiddenCondition = document.createElement('div');
            hiddenCondition.classList.add('hidden-condition');
            document.querySelector('body').appendChild(hiddenCondition);
    
            //fin de l'event
            hiddenCondition.addEventListener('click', (e) =>{
                //on clean l'input
                inputElt.value = '';

                tagIngredientElt.style.height = '60px';
                tagIngredientElt.style.zIndex = '0';
                inputElt.placeholder = "Ingrédient";
                inputElt.style.width = '170px';
    
                const listElt = document.querySelector('.ingredients-container ul');
                if (listElt){
                    document.querySelector('.ingredients-container ul').style.display = 'none';
                }
                
                document.querySelector('body').removeChild(hiddenCondition);
                
            })
        }
    })

    //recherche d'ingrédient
    const ingredientsSearchInputElt = tagIngredientElt.querySelector('#ingredients');

    ingredientsSearchInputElt.addEventListener('input', (e) => {
        //on récupère les ingredients
        const ingredientsList = [...tagIngredientElt.querySelectorAll('.tag')].map(elt => elt.textContent);

        //on filtre les ingredients en fonction de la recherche utilisateur
        const ingredientsFilter = ingredientsList.filter(ingredient => ingredient.toLowerCase().includes(ingredientsSearchInputElt.value.toLowerCase()));
        
        //on supprime la liste
        tagIngredientElt.removeChild(tagIngredientElt.querySelector('.list-tags'));

        //on ajoute la nouvelle liste actualisée
        const newListElt = indexFactoryModel.getTagList(ingredientsFilter, data);
        newListElt.style.display = 'flex';
        tagIngredientElt.appendChild(newListElt);
    });


    //montre les tags appareils
    tagAppareilsElt.addEventListener('click', (e) =>{
        tagAppareilsElt.style.height = 'auto';
        tagAppareilsElt.style.zIndex = '1';

        const inputElt = tagAppareilsElt.querySelector('input')
        inputElt.placeholder = "Rechercher un appareil";
        inputElt.style.width = '95%';
        const tagElt = tagAppareilsElt.querySelector('.list-tags');
        tagElt.style.display = 'flex';

        
        //permet de sortir de l'event
        if (!document.querySelector('.hidden-condition')){
            const hiddenCondition = document.createElement('div');
            hiddenCondition.classList.add('hidden-condition');
            document.querySelector('body').appendChild(hiddenCondition);
            
            //fin de l'event
            hiddenCondition.addEventListener('click', (e) =>{
                //on clean l'input
                inputElt.value = '';

                tagAppareilsElt.style.height = '60px';
                tagAppareilsElt.style.zIndex = '0';
                inputElt.placeholder = "Appareils";
                inputElt.style.width = '170px';
                document.querySelector('.appareils-container ul').style.display = 'none';
                
                document.querySelector('body').removeChild(hiddenCondition);
            })
        }
    })

    //recherche d'appareil
    const appareilsSearchInputElt = tagAppareilsElt.querySelector('#appareils');

    appareilsSearchInputElt.addEventListener('input', (e) => {
        const appareilsList = [...tagAppareilsElt.querySelectorAll('.tag')].map(elt => elt.textContent);
        //on filtre les appareils en fonction de la recherche utilisateur
        const appareilsFilter = appareilsList.filter(appareil => appareil.toLowerCase().includes(appareilsSearchInputElt.value.toLowerCase()));

        //on supprime la liste
        tagAppareilsElt.removeChild(tagAppareilsElt.querySelector('.list-tags'));
        //on ajoute la nouvelle liste actualisée
        const newListElt = indexFactoryModel.getTagList(appareilsFilter);
        newListElt.style.display = 'flex';
        tagAppareilsElt.appendChild(newListElt);
    });


    //montre les tags ustensiles
    tagUstensilesElt.addEventListener('click', (e) =>{
        tagUstensilesElt.style.height = 'auto';
        tagUstensilesElt.style.zIndex = '1';

        const inputElt = tagUstensilesElt.querySelector('input')
        inputElt.placeholder = "Rechercher un appareil";
        inputElt.style.width = '95%';
        const tagElt = tagUstensilesElt.querySelector('.list-tags');
         
        tagElt.style.display = 'flex';

        
        //permet de sortir de l'event
        if (!document.querySelector('.hidden-condition')){
            const hiddenCondition = document.createElement('div');
            hiddenCondition.classList.add('hidden-condition');
            document.querySelector('body').appendChild(hiddenCondition);

            //fin de l'event
            hiddenCondition.addEventListener('click', (e) =>{
                //on clean l'input
                inputElt.value = '';

                tagUstensilesElt.style.height = '60px';
                tagUstensilesElt.style.zIndex = '0';
                inputElt.placeholder = "Ustensiles";
                inputElt.style.width = '170px';
                document.querySelector('.ustensiles-container ul').style.display = 'none';
                
                document.querySelector('body').removeChild(hiddenCondition);
            })
        }
    })

    //recherche d'ustensiles
    const ustensilesSearchInputElt = tagUstensilesElt.querySelector('#ustensiles');

    ustensilesSearchInputElt.addEventListener('input', (e) => {
        const ustensileList = [...tagUstensilesElt.querySelectorAll('.tag')].map(elt => elt.textContent);

        //on filtre les ustensiles en fonction de la recherche utilisateur
        const ustensilesFilter = ustensileList.filter(ustensile => ustensile.toLowerCase().includes(ustensilesSearchInputElt.value.toLowerCase()));
        //on supprime la liste
        tagUstensilesElt.removeChild(tagUstensilesElt.querySelector('.list-tags'));
        //on ajoute la nouvelle liste actualisée
        const newListElt = indexFactoryModel.getTagList(ustensilesFilter);
        newListElt.style.display = 'flex';
        tagUstensilesElt.appendChild(newListElt);
    });

}






function cleanAll(){

    const contentElt = document.querySelector('.content');

    const tabFiltreElt = [document.querySelector('.ingredients-container'), document.querySelector('.appareils-container'), 
                        document.querySelector('.ustensiles-container')];

    while (contentElt.firstChild){
        contentElt.removeChild(contentElt.firstChild);
    }


    tabFiltreElt.forEach(elt => {
        elt.querySelector('.list-tags') && elt.removeChild(elt.querySelector('.list-tags'));
    });


    tabFiltreElt.forEach(elt => {
        elt.removeEventListener('click', () => {
        });
    });


    const hiddenCondition = document.querySelector('.hidden-condition');
    if (hiddenCondition){
        document.querySelector('body').removeChild(hiddenCondition);
    }

}

async function init() {
    dataOriginal = await fetchData();
    actualData = dataOriginal;
    indexFactoryModel = indexFactory(dataOriginal);
    
    const formElt = document.querySelector('.research');
    const searchBarElt = document.querySelector('#search-bar');
    
    formElt.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    
    
    searchBarElt.addEventListener('input',(e) => {
        principalResearch(e, dataOriginal);
    });

    displayData(dataOriginal);
}

document.addEventListener('DOMContentLoaded', init);