async function fetchData(){
    try {
        const response = await fetch('./data/recipes.json');
        const data = await response.json();

        return data;

    } catch (error) {
        console.log(error);
    }
}

function displayData(data){
    
    const contentElt = document.querySelector('.content');
    const tagIngredientElt = document.querySelector('.ingredients-container');
    const tagAppareilsElt = document.querySelector('.appareils-container');
    const tagUstensilesElt = document.querySelector('.ustensiles-container');


    if (data.length === 0) {
        const nullResult = document.createElement('div');
        nullResult.style.fontWeight = '800';
        nullResult.textContent = 'Aucune recette ne correspond à vos critères';

        contentElt.appendChild(nullResult);
    }

    //construction des cards
    const indexFactoryModel = indexFactory(data);
    data.forEach(card => {
        const cardElt = indexFactoryModel.getCardRecipes(card);
        contentElt.appendChild(cardElt);
    });


    
    //tags
    let tabIngredient = [];
    let tabAppareils = [];
    let tabUstensiles = [];

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
    const listIngredient = indexFactoryModel.getTagList(tabIngredient);
    tagIngredientElt.appendChild(listIngredient);

    tabAppareils = [...new Set(tabAppareils)];
    const listAppareils = indexFactoryModel.getTagList(tabAppareils);
    tagAppareilsElt.appendChild(listAppareils);

    tabUstensiles = [...new Set(tabUstensiles)];
    const listUstensiles = indexFactoryModel.getTagList(tabUstensiles);
    tagUstensilesElt.appendChild(listUstensiles);

 
    
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

        
        if (!document.querySelector('.hidden-condition')){
            //permet de sortir de l'event
            const hiddenCondition = document.createElement('div');
            hiddenCondition.classList.add('hidden-condition');
            document.querySelector('body').appendChild(hiddenCondition);
    
            //fin de l'event
            hiddenCondition.addEventListener('click', (e) =>{
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
        //on filtre les ingredients en fonction de la recherche utilisateur
        const ingredientsFilter = tabIngredient.filter(ingredient => ingredient.toLowerCase().includes(ingredientsSearchInputElt.value.toLowerCase()));
        
        //on supprime la liste
        tagIngredientElt.removeChild(tagIngredientElt.querySelector('.list-tags'));
        //on ajoute la nouvelle liste actualisée
        const newListElt = indexFactoryModel.getTagList(ingredientsFilter);
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

        
        if (!document.querySelector('.hidden-condition')){
            //permet de sortir de l'event
            const hiddenCondition = document.createElement('div');
            hiddenCondition.classList.add('hidden-condition');
            document.querySelector('body').appendChild(hiddenCondition);
            
            //fin de l'event
            hiddenCondition.addEventListener('click', (e) =>{
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
        //on filtre les appareils en fonction de la recherche utilisateur
        const appareilsFilter = tabAppareils.filter(appareil => appareil.toLowerCase().includes(appareilsSearchInputElt.value.toLowerCase()));
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
        //on filtre les ustensiles en fonction de la recherche utilisateur
        const ustensilesFilter = tabUstensiles.filter(ustensile => ustensile.toLowerCase().includes(ustensilesSearchInputElt.value.toLowerCase()));
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
    const data = await fetchData();
    
    const formElt = document.querySelector('.research');
    const searchBarElt = document.querySelector('#search-bar');
    
    formElt.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    
    
    searchBarElt.addEventListener('input',(e) => {
        let tabRecipes = [];

        if (e.target.id === 'search-bar' && e.target.value.length > 2){

            const entryUser = e.target.value.toLowerCase();
            
            for (let recipe of data){

                const researchName = recipe.name.toLowerCase().includes(entryUser) && recipe;
                
                if (researchName){
                    tabRecipes.push(researchName);
                }else{
                    const researchDescription = recipe.description.toLowerCase().includes(entryUser) && recipe;
                    if (researchDescription){
                        tabRecipes.push(researchDescription);
                    }else{
                        let researchIngredient;
                        for (let ingredients of recipe.ingredients){
                            const ingredientLow = ingredients.ingredient.toLowerCase();
                            if (ingredientLow.includes(entryUser)){
                                researchIngredient = recipe;
                            }
                        }

                        if (typeof researchIngredient === 'object'){
                            tabRecipes.push(researchIngredient);
                        }
                    }

                }
            
            }

            cleanAll();
            displayData(tabRecipes);
        } else if (tabRecipes){
            cleanAll();
            displayData(data);
        }

    });

    displayData(data);

}

document.addEventListener('DOMContentLoaded', init);