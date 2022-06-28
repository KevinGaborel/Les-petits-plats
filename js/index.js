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
    console.log(data);
    const contentElt = document.querySelector('.content');

    data.forEach(card => {
        const indexFactoryModel = indexFactory();
        const cardElt = indexFactoryModel.getCardRecipes(card);
        contentElt.appendChild(cardElt);
    });
}

async function init() {
    const data = await fetchData();
    let recipesResult;
    let recipesFormatage;

    const formElt = document.querySelector('.research');


    formElt.addEventListener('input', (e) => {

        if (e.target.id === 'search-bar' && e.target.value.length > 2){

            const entryUser = e.target.value.toLowerCase();
            const tabRecipes = data.map((recipes, index) => 
                {

                    const researchIngredient = recipes.ingredients.map(value =>{
                        const ingredientLow = value.ingredient.toLowerCase();
                        if (ingredientLow.includes(entryUser)){
                            return recipes;
                        }
                    }).filter(value => value);

                    const researchName = recipes.name.toLowerCase().includes(entryUser) && recipes;
                        
                    const researchDescription = recipes.description.toLowerCase().includes(entryUser) && recipes;

                    if (researchIngredient.length > 0){
                        return researchIngredient[0];

                    }else if (researchName){
                        return researchName;

                    } else if (researchDescription){
                        return researchDescription;
                    }

                }).filter(value => value);

                
            console.log(tabRecipes);
        }

    });


    displayData(data);
}

document.addEventListener('DOMContentLoaded', init);