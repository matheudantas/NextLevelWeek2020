function populateUFs () {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )
}

populateUFs()


function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
        citySelect.innerHTML = ""

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )
}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//em fetch (promessa), usa-se o .then, quando se supõe que o retorno da chamada deu certo, mas caso não tenha dado, usa-se o .catch
//.innerHTML: propriedade de elementos html
//usa-se ` (crase) para interpolar
//em function getCities(event) temos uma url escrita de modo dinamico, interpolando os valores de uf

//document
//    .querySelector("select[name=uf")
//procurar o select que tem o valor igual a uf
//    .addEventListener("change", () => {
//        console.log("mudei")
//    } )

//.addEventListener: "ouvidor de eventos"
//arrow function (outro jeito de criar função anonima): () => {}
//para que aconteça é necessário alterar no arquivo create-point.html a tag correspondente <option value="1">Opcao o Estado</option>



//add Itens de coleta
//pegar todos os Li's
const itemsCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    // adicionar ou remover uma classe em javascript
    itemLi.classList.toggle("selected")
    //classList tem diversas funcionalidades:
    //.add -> adiciona selected
    //.remove -> remove selected
    //.toggle -> adicionar ou remover (any)

    const itemId = itemLi.dataset.id

    //console.log('ITEM ID: ', itemId)
    
    
    // verificar se existem itens selecionados, se sim, pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId //isso será true ou false
        return itemFound
    })

    // se ja estiver selecionado,  
   if(alreadySelected >= 0) {
        // tirar da seleção (filtrar)
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems
   } else {
       // se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
   }

   //console.log('selectedItems', selectedItems)

    // atualizar o campo hidden com os itens selecionados
   collectedItems.value = selectedItems
}