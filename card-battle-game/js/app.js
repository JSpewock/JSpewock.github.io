console.log('connected')
let dexNum = Math.ceil(Math.random()*890)
$(() => {
    console.log('j query connected')
    $.ajax({
        url: `https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=${dexNum}`
    }).then((data) => {
        console.log(data)
        $('body').html(
            `<img src="${data.cards[0].imageUrl}">`
        )
    })
})