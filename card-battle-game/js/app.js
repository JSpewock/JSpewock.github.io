
let variables = {
    cards: [], //Array for card values
    playerChoice: '', // variable to hold the value of the players choice of card
    computerChoice: '',
    liveCard: false, //if you have any cards in the live field
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
        $('#attack-button').on('click', () => {
            gameLogic.attack(variables.playerChoice)
            gameLogic.attack(variables.computerChoice)
        })
    },
    attack: (currentCard) => {
        variables.computerChoice.hp = parseInt(variables.computerChoice.hp)
        variables.playerChoice.hp = parseInt(variables.playerChoice.hp)
        //attack 1 & 2 are set equal to the moves on the current card
        let $attack1 = currentCard.attacks[0].damage
        let $attack2 = ""

        if (currentCard.attacks[1]) {$attack2 = currentCard.attacks[1].damage}
        // console.log($('.com-card'))

        //=======================
        //Attacking logic
        //=======================
        //The first line checks if there is a second attack and if it has a damage value
        if (currentCard === variables.playerChoice){
            if ($attack2 !== "") {
                variables.computerChoice.hp -= parseInt($attack2)
                console.log(variables.computerChoice.hp)
            } else if ($attack1 !== "") { // Checks to see if the first attack has a damage value
                variables.computerChoice.hp -= parseInt($attack1) 
                console.log(variables.computerChoice.hp)
            } else { // If there are no damaging moves, do 10 damage
                variables.computerChoice.hp -= 10
                console.log(variables.computerChoice.hp)
            }
        } else if (currentCard === variables.computerChoice) {
            if ($attack2 !== "") {
                    variables.playerChoice.hp -= parseInt($attack2)
                    console.log(variables.playerChoice.hp)
            } else if ($attack1 !== "") { // Checks to see if the first attack has a damage value
                variables.playerChoice.hp -= parseInt($attack1) 
                console.log(variables.playerChoice.hp)
            } else { // If there are no damaging moves, do 10 damage
                variables.computerChoice.hp -= 10
                console.log(variables.playerChoice.hp)
            }
            }
    }

}



$(() => {

$('button').on('click', () => {
    Ui.startGame()
})

})
