//Cynthia Battle - from Pokemon Platinum
//amity square
//Oreburgh City
//Route 205 night
//Encounter! Team galactic
//underground passage
//poffin 
//route 225



let variables = {
    battleMusic: '',
    backgroundMusic: [],
    cards: [], //Array for card values
    playerChoice: '', // variable to hold the value of the players choice of card
    computerChoice: '',
    playerLiveCard: false, //if you have any cards in the live field
    computerLiveCard: false,
    playerCardCount: 5, // how many cards the player has left
    computerCardCount: 5,
    backgroundImages: ['https://i.imgur.com/5oexPaK.jpg', 'https://i.imgur.com/AA83VQ5.jpg', 'https://i.imgur.com/2dWNKue.jpg', 'https://i.imgur.com/TDGwUVq.png'],
    backgroundImageCounter: 0
}

let Ui = {
    makeDivs: () => {
        for (let i = 1; i <= 3; i++) {
            $('<div>').attr('id', `row${i}`).appendTo('body')
        }
    },
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
            gameLogic.ChoosePoke()            
            })
        }
        }
}

let gameLogic = {
    ChoosePoke: () => {
        //win check
        if (variables.computerCardCount === 0 || variables.playerCardCount === 0) {
            gameLogic.win()
        }
        $('.player-card').on('click', () => {
            if (variables.playerLiveCard === false) { // Check to see if you already have a card down
                variables.playerChoice = variables.cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                $('#row2').append(event.target)
                variables.playerLiveCard = true // Update to say that you now have a card down
                gameLogic.battle()
            }
        })
        
    },
    battle: () => {
        if (variables.computerLiveCard === false) {
            let randomComCardIndex = Math.floor(Math.random()*$('.com-card').length) 
            let $randomComputerCard = $('.com-card')[randomComCardIndex] //uses the random index generated on the previous line to choose a random computer card
            variables.computerChoice = variables.cards.find(({imageUrl}) => imageUrl === $($randomComputerCard).attr('src')) // Same line I used before, essentially just grabbing the data for the card the computer chose
            // console.log(computerChoice)
            $('#row2').append($randomComputerCard)
            variables.computerLiveCard = true
        }
        //win check
        if (variables.computerCardCount === 0 || variables.playerCardCount === 0) {
            gameLogic.win()
        } else {
            $('<button>').attr('id', 'attack-button').text('Attack').appendTo('#row2')
            $('#attack-button').on('click', () => {
                gameLogic.attack(variables.playerChoice)
                gameLogic.attack(variables.computerChoice)
            })
        }
    },
    attack: (currentCard) => {
        //win check
        if (variables.computerCardCount === 0 || variables.playerCardCount === 0) {
            gameLogic.win()
        } else {
        variables.computerChoice.hp = parseInt(variables.computerChoice.hp)
        variables.playerChoice.hp = parseInt(variables.playerChoice.hp)
        //attack 1 & 2 are set equal to the moves on the current card
        let $attack1 = currentCard.attacks[0].damage
        let $attack2 = ""
        if (currentCard.attacks[1]) {$attack2 = currentCard.attacks[1].damage}

        //=======================
        //Attacking logic
        //=======================
        if (currentCard === variables.playerChoice){ //Check to see if the player is attacking or the computer is attacking
            if ($attack2 !== "") { //The first line checks if there is a second attack and if it has a damage value
                variables.computerChoice.hp -= parseInt($attack2)
                console.log('c' + variables.computerChoice.hp)
            } else if ($attack1 !== "") { // Checks to see if the first attack has a damage value
                variables.computerChoice.hp -= parseInt($attack1) 
                console.log('c' + variables.computerChoice.hp)
            } else { // If there are no damaging moves, do 10 damage
                variables.computerChoice.hp -= 10
                console.log('c' + variables.computerChoice.hp)
            }
            //=================================
            //Check if computer card is dead
            //=================================
            if (variables.computerChoice.hp <= 0) {
                variables.computerChoice = ""
                $('#row2 > .com-card').remove()
                $('#attack-button').remove()
                variables.computerCardCount -= 1
                console.log(`the computer has ${variables.computerCardCount} cards left`)
                variables.computerLiveCard = false
                gameLogic.battle()
            }
        } else if (currentCard === variables.computerChoice) { // These lines are the same as above except it damages the player's card
            if ($attack2 !== "") {
                    variables.playerChoice.hp -= parseInt($attack2)
                    console.log('p' + variables.playerChoice.hp)
            } else if ($attack1 !== "") {
                variables.playerChoice.hp -= parseInt($attack1) 
                console.log('p' + variables.playerChoice.hp)
            } else {
                variables.computerChoice.hp -= 10
                console.log('p' + variables.playerChoice.hp)
            }
            //==================================
            //Check if player card is dead
            //==================================
            if (variables.playerChoice.hp <= 0) {
                variables.playerChoice = ""
                $('#row2 > .player-card').remove()
                $('#attack-button').remove()
                variables.playerCardCount -= 1
                console.log(`the player has ${variables.playerCardCount} cards left`)
                variables.playerLiveCard = false
                gameLogic.ChoosePoke()
            }
            }
        }
    },
    win: () => {
        if (variables.computerCardCount === 0) {
            console.log('Congratulations! The computer has run out of cards; You win!')
        } else if (variables.playerCardCount === 0) {
            console.log('Not this time trainer, you\'ve been bested.')
        }
    }

}



$(() => {
    //information on how to use audio taken from the following links
    //https://stackoverflow.com/questions/8489710/play-an-audio-file-using-jquery-when-a-button-is-clicked
    //https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics

    const backgroundMusic = new Audio()
    backgroundMusic.src = "./sounds/Route 225 (Day) - Pokémon Diamond_Pearl_Platinum.mp3"
    backgroundMusic.volume = 0.5

    variables.battleMusic = new Audio()
    variables.battleMusic.src = './sounds/cynthia_battle_music.mp3'
    variables.battleMusic.volume = 0.10

    $('#start-button').on('click', () => {
        variables.battleMusic.play()
        Ui.makeDivs()
        Ui.startGame()
    })
    $('#htp-button').on('click', () => {
        $('#htp-modal').css('display', 'block')
    })
    $('#modal-close').on('click', () => {
        $("#htp-modal").css('display', 'none')
    })
    $('#next-bg').on('click', () => {
        if (variables.backgroundImageCounter < 3) {
            variables.backgroundImageCounter += 1
            $('body').css('background-image', `url(${variables.backgroundImages[variables.backgroundImageCounter]})`)
        }
    })
    $('#prev-bg').on('click', () => {
        if (variables.backgroundImageCounter > 0) {
            variables.backgroundImageCounter -= 1
            $('body').css('background-image', `url(${variables.backgroundImages[variables.backgroundImageCounter]})`)
        }
    })
})
