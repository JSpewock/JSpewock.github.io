
$(() => {
    const cards = [] //Array for card values
    let playerChoice = '' // variable to hold the value of the players choice of card
    let computerChoice = ''
    let liveCard = false //if you have any cards in the live field
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
        choosePoke()
        
    })
 }
}
    // console.log('hello')
    
const choosePoke = () => {
    $('.player-card').on('click', () => {
        if (liveCard === false) { // Check to see if you already have a card down
            playerChoice = cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
            $('#row2').append(event.target)
            liveCard = true // Update to say that you now have a card down
            battle()
        }
    })
}

const battle = () => {
    let randomComCardIndex = Math.floor(Math.random()*$('.com-card').length) 
    let $randomComputerCard = $('.com-card')[randomComCardIndex] //uses the random index generated on the previous line to choose a random computer card
    computerChoice = cards.find(({imageUrl}) => imageUrl === $($randomComputerCard).attr('src')) // Same line I used before, essentially just grabbing the data for the card the computer chose
    console.log(computerChoice)
    $('#row2').append($randomComputerCard)
    $('<button>').attr('id', 'attack-button').text('Attack').appendTo('#row2')
    $('#attack-button').on('click', () => {
        computerChoice.hp = parseInt(computerChoice.hp)
        playerChoice.hp = parseInt(playerChoice.hp)

        // console.log($('.com-card'))
        //=======================
        //Player attack
        //=======================
        if (playerChoice.attacks[1]) {
            computerChoice.hp -= parseInt(playerChoice.attacks[1].damage)
            console.log(computerChoice.hp)
        } else if (parseInt(playerChoice.attacks[0])) {
            console.log(playerChoice.attacks[0].damage)
        } else {
            //does 10 damage
        }
    })
}
//// Testing variable idea
$('button').on('click', () => {
    startGame()
})
})
