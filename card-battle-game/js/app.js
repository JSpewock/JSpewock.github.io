console.log('connected')
$(() => {
    const cards = []
    console.log('j query connected')
    for (let i = 0; i < 10; i++) {
    let dexNum = Math.ceil(Math.random()*890)
    $.ajax({
        url: `https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=${dexNum}`
    }).then((data) => {
        console.log(data)
        cards.push(data.cards[0])
        let card = $('<img>').attr('src', data.cards[0].imageUrl)
        $('body').append(card)
        console.log(cards)
    })
}
})