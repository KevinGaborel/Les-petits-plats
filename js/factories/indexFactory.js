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


    //creer les listes des tags
    function getTagList(tagList, recipes){
        
        const listTags = document.createElement('ul');
        listTags.classList.add('list-tags');
        //on tri les tags
        tagList.sort();

        for (elt of tagList){
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

                let typeTag = e.target.closest('div').classList.value;
                  
                //creation du tag
                const tagElt = getTag(research, typeTag);
                
                tagContentElt.appendChild(tagElt);

                cleanAll();

                const resultResearch = actualData.map(recipe => researchByOneTag(research, recipe, typeTag.split('s-')[0])).filter(recipe => recipe);
                
                resultResearch.forEach(value => createCard(value));

                displayTag(resultResearch);

                actualData = resultResearch;

            });
            
            listTags.appendChild(eltList);
        }

        return listTags;

    }

    //creer le tag de la recherche en cours
    function getTag(name, type){
        const tag = document.createElement('div');
        const cross = document.createElement('i');

        cross.classList.add('fa-regular', 'fa-circle-xmark');
        cross.style.marginLeft = '10px';
        cross.style.width = '16px';
        cross.style.height = '16px';

        if (type === 'ingredients-container'){
            tag.classList.add('ingredient');
        } else if (type === 'appareils-container'){
            tag.classList.add('appareil');
        } else if (type === 'ustensiles-container'){
            tag.classList.add('ustensile');
        }

        //suppression du tag
        cross.addEventListener('click', (e) => {
            e.target.closest('div').remove();
            
            const researchInput = document.querySelector('#search-bar').value.toLowerCase();
            principalResearch(researchInput, dataOriginal);

        });

        tag.textContent = name;

        tag.appendChild(cross);

        return tag;
    }

    return { getCardRecipes, getTagList, getTag };
}