function indexFactory(recipes){

    function getCardRecipes(data){
        const article = document.createElement('article');
        article.classList.add('article-recipe');

        const facticeImg = document.createElement('div');
        facticeImg.classList.add('factice-img');

        const divHeadDescribe = document.createElement('div');
        divHeadDescribe.classList.add('article-describe');

        const h2 = document.createElement('h2');
        const spanTime = document.createElement('span');
        const divTime = document.createElement('div');
        const iconeTime = document.createElement('i');

        iconeTime.classList.add('fa-regular', 'fa-clock');

        h2.textContent = data.name;
        spanTime.textContent = `${data.time} min`;

        const divTitle = document.createElement('div');
        divTitle.classList.add('article-title');

        const divFooterCard = document.createElement('div');
        divFooterCard.classList.add('footer-card');
        const listIngredient = document.createElement('ul');
        const textDescribe = document.createElement('p');

        //creation et ajout des ingrédients
        data.ingredients.forEach((obj) => {
            const listElt = document.createElement('li');
            //listElt.textContent = obj.ingredient;
            if (obj.quantity || obj.quantite){
                listElt.textContent+= obj.quantity ? ': ' + obj.quantity : ': ' + obj.quantite;
                if (obj.unit){
                    listElt.textContent+= obj.unit === 'grammes' ? ' gr' : obj.unit === 'cuillères à soupe' ? ' cs' : ' ' + obj.unit;
                }
            }
            const spanElt = document.createElement('span');
            spanElt.textContent = obj.ingredient;
            spanElt.style.fontWeight = 700;

            listElt.insertBefore(spanElt, listElt.firstChild);
            listIngredient.appendChild(listElt);
        });

        if (data.description.length > 180){
            const describeRecipe = data.description.split('');
            describeRecipe.length = 180;
            textDescribe.textContent = `${describeRecipe.join('')}...`;
        } else{
            textDescribe.textContent = data.description;
        }

        divTime.appendChild(iconeTime);
        divTime.appendChild(spanTime);
        divTitle.appendChild(h2);
        divTitle.appendChild(divTime);

        divFooterCard.appendChild(listIngredient);
        divFooterCard.appendChild(textDescribe);

        divHeadDescribe.appendChild(divTitle);
        divHeadDescribe.appendChild(divFooterCard);
        article.appendChild(facticeImg);
        article.appendChild(divHeadDescribe);

        return article;
    }

    function getTagList(data){
        
        const listTags = document.createElement('ul');
        listTags.classList.add('list-tags');

        for (elt of data){
            const eltList = document.createElement('li');

            eltList.classList.add('tag');
            eltList.textContent = elt;

            //si on click sur le tag
            eltList.addEventListener('click', (e) => {
              

                const tagContentElt = document.querySelector('.tags-selected');
                const research = e.target.textContent.toLowerCase();

                
                // on met les tags selectionné dans un tableau, puis on map pour ne garder que le text
                let tagsSelected = [...document.querySelectorAll('.tags-selected div')];
                tagsSelected = tagsSelected.map(value => value.textContent);
                
                
                //si le tag existe déjà, on ne le creer pas
                let tagCreation = true;
                
                for (text of tagsSelected){
                    if (text === research){
                        tagCreation = false;
                    }
                }
                
                if (!tagCreation){
                    return;
                }

                const typeTag = e.target.closest('div').classList.value;

                cleanAll();
                
                
                //creation du tag
                const tagElt = getTag(research, typeTag);
                
                tagContentElt.appendChild(tagElt);
                
                let tabRecipes;

                //determine la catégorie du tag (ingredient, ustensile ou appareil)
                if (typeTag === 'ingredients-container'){

                    tabRecipes = recipes.map((recipe, index) => 
                    {
                        const researchIngredient = recipe.ingredients.map(value =>{
                        const ingredientLow = value.ingredient.toLowerCase();
                        if (ingredientLow.includes(research)){
                            return recipe;
                        }

                    }).filter(value => value);

                    if (researchIngredient.length > 0){
                        return researchIngredient[0];
                    }
                
                }).filter(value => value);

                } else if (typeTag === 'appareils-container'){
                    
                    tabRecipes = recipes.map((recipe, index) => 
                    {
                        const researchAppliance = recipe.appliance.toLowerCase().includes(research) && recipe;
                        
                        if (researchAppliance){
                            return researchAppliance;
                        }
                
                    }).filter(value => value);

                } else if (typeTag === 'ustensiles-container'){

                    tabRecipes = recipes.map((recipe, index) => 
                    {
                        const researchUstensils = recipe.ustensils.map(value =>{
                        const UstensilsLow = value.toLowerCase();
                        if (UstensilsLow.includes(research)){
                            return recipe;
                        }
                    }).filter(value => value);
                
                    if (researchUstensils.length > 0){
                        return researchUstensils[0];
                    }
                
                    }).filter(value => value);
                }
            
                displayData(tabRecipes);

            });

            listTags.appendChild(eltList);
        }

        return listTags;

    }

    function getTag(name, type){
        const tag = document.createElement('div');
        const cross = document.createElement('i');

        cross.classList.add('fa-regular', 'fa-circle-xmark');
        cross.style.marginLeft = '10px';

        if (type === 'ingredients-container'){
            tag.style.backgroundColor = '#3282F7';
        } else if (type === 'appareils-container'){
            tag.style.backgroundColor = '#68D9A4';
        } else if (type === 'ustensiles-container'){
            tag.style.backgroundColor = '#ED6454';
        }

        //suppression du tag
        cross.addEventListener('click', (e) => {
            e.target.closest('div').remove();
            cleanAll();

            //on remet les anciens résultats via les datas instanciées précédemment
            displayData(recipes);
        });

        tag.textContent = name;

        tag.appendChild(cross);

        return tag;
    }

    return { getCardRecipes, getTagList, getTag };
}