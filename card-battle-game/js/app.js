console.log('connected')
$(() => {
    const cards = []
    console.log('j query connected')
    for (let i = 0; i < 10; i++) {
    let dexNum = Math.ceil(Math.random()*890) //Random pokedex number to generate pokemon
    $.ajax({
        url: `https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=${dexNum}`
    }).then((data) => {
        console.log(data)
        randomCardNum = Math.floor(Math.random()*data.cards.length) // Random number to choose which card of that pokemon
        cards.push(data.cards[randomCardNum])
        let newCard = $('<img>').attr('src', data.cards[randomCardNum].imageUrl)
        if (i <= 4) {
            newCard.addClass('com-card')
        } else {
            newCard.addClass('player-card')
        }
        $('body').append(newCard)
        console.log(cards)
        //// Testing variable idea
        let pChoice = ''
        $('img').on('click', () => {
            console.log($(event.target).attr('src'))
            pChoice = cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src'))
            console.log(pChoice)
        })
    })
}
})