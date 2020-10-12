// console.log('connected')
$(() => {
    const cards = [] //Array for card values
    let pChoice = '' // variable to hold the value of the players choice of card
    let liveCard = false //if you have any cards in the live field
    // console.log('j query connected')
    const startGame = () => {

    for (let i = 0; i < 10; i++) {
    let dexNum = Math.ceil(Math.random()*890) //Random pokedex number to generate pokemon
    $.ajax({
        url: `https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=${dexNum}`
    }).then((data) => {
        // console.log(data)
        randomCardNum = Math.floor(Math.random()*data.cards.length) // Random number to choose which card of that pokemon
        cards.push(data.cards[randomCardNum])
        let newCard = $('<img>').attr('src', data.cards[randomCardNum].imageUrl)
        if (i <= 4) {
            newCard.addClass('com-card')
            $('#row1').append(newCard)
        } else {
            newCard.addClass('player-card')
            $('#row3').append(newCard)
        }
        // $('body').append(newCard)
        // console.log(cards)
        
        // $('.player-card').on('click', () => {
        //     console.log($(event.target).attr('src'))
        //     pChoice = cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        //     console.log(pChoice)
        // })
        choosePoke()
        
    })
 }
}
    // console.log('hello')
    
const choosePoke = () => {
    $('.player-card').on('click', () => {
        // console.log($(event.target).attr('src'))
        if (liveCard === false) { // Check to see if you already have a card down
        pChoice = cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        $('#row2').append(event.target)
        // console.log(pChoice)
        liveCard = true // Update to say that you now have a card down
        battle()
        }
    })
}

const battle = () => {
    let randomComCardNum = Math.floor(Math.random()*$('.com-card').length) //chooses a random card from the computers hand
    console.log(randomComCardNum)
    let $randomComputerCard = $('.com-card')[randomComCardNum]
    $('#row2').append($randomComputerCard)
    $('<button>').attr('id', 'attack-button').text('Attack').appendTo('#row2')
    $('#attack-button').on('click', () => {
        console.log($('.com-card'))
        if (pChoice.attacks[1]) {
        console.log(pChoice.attacks[1].damage)
        } else {
            console.log(pChoice.attacks[0].damage)
        }
    })
}
//// Testing variable idea
$('button').on('click', () => {
    startGame()
    // choosePoke()
})
})
