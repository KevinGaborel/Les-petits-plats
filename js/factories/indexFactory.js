function indexFactory(){

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

    return { getCardRecipes };
}