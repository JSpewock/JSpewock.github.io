
let variables = {
    cards: [], //Array for card values
    playerChoice: '', // variable to hold the value of the players choice of card
    computerChoice: '',
    liveCard: false //if you have any cards in the live field
}

let Ui = {
    startGame: () => {

        for (let i = 0; i < 10; i++) { // loop to generate 10 cards
        let dexNum = Math.ceil(Math.random()*890) //Random pokedex number to generate pokemon
        $.ajax({
            url: `https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=${dexNum}`
        }).then((data) => {
            // console.log(data)
            randomCardNum = Math.floor(Math.random()*data.cards.length) // Random number to choose which style card of that pokemon
            variables.cards.push(data.cards[randomCardNum])
            let newCard = $('<img>').attr('src', data.cards[randomCardNum].imageUrl)
            if (i <= 4) { // assigns 5 cards the class of com-card
                newCard.addClass('com-card')
                $('#row1').append(newCard)
            } else { // assigns 5 cards the class of player-card
                newCard.addClass('player-card')
                $('#row3').append(newCard)
            }
            gameLogic.choosePoke()
            
            })
        }
        }
}

let gameLogic = {
    choosePoke: () => {
        $('.player-card').on('click', () => {
            if (variables.liveCard === false) { // Check to see if you already have a card down
                variables.playerChoice = variables.cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                $('#row2').append(event.target)
                variables.liveCard = true // Update to say that you now have a card down
                gameLogic.battle()
            }
        })
    },
    battle: () => {
        let randomComCardIndex = Math.floor(Math.random()*$('.com-card').length) 
        let $randomComputerCard = $('.com-card')[randomComCardIndex] //uses the random index generated on the previous line to choose a random computer card
        variables.computerChoice = variables.cards.find(({imageUrl}) => imageUrl === $($randomComputerCard).attr('src')) // Same line I used before, essentially just grabbing the data for the card the computer chose
        // console.log(computerChoice)
        $('#row2').append($randomComputerCard)
        $('<button>').attr('id', 'attack-button').text('Attack').appendTo('#row2')
        $('#attack-button').on('click', gameLogic.attack)
    },
    attack: () => {
        variables.computerChoice.hp = parseInt(variables.computerChoice.hp)
        variables.playerChoice.hp = parseInt(variables.playerChoice.hp)
    
        // console.log($('.com-card'))
        //=======================
        //Player attack
        //=======================
        //The first line checks if there is a second attack and if it has a damage value
        if (variables.playerChoice.attacks[1] && typeof parseInt(variables.playerChoice.attacks[1].damage) === 'number') { // taken inspiration from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
             variables.computerChoice.hp -= parseInt(variables.playerChoice.attacks[1].damage)
             console.log(variables.computerChoice.hp)
        } else if (typeof parseInt(playerChoice.attacks[0].damage) === 'number') { // Checks to see if the first attack has a damage value
             console.log(variables.playerChoice.attacks[0].damage)
        } else {
            //does 10 damage
        }
    }

}



$(() => {

$('button').on('click', () => {
    Ui.startGame()
})

})
