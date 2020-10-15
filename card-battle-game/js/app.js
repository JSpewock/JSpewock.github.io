//Cynthia Battle - from Pokemon Platinum
//amity square
//Oreburgh City
//Route 205 night
//Encounter! Team galactic
//underground passage
//poffin 
//route 225
//Jublife City (night)
//lake



let variables = {
    attackSound: '',
    lossMusic: '',
    victoryMusic: '',
    battleMusic: '',
    backgroundMusic: '',
    backgroundMusicCounter: -1,
    backgroundMusicArr: ['./sounds/Route 225 (Day) - Pokémon Diamond_Pearl_Platinum.mp3', './sounds/Lake.mp3', './sounds/Jubilife_City.mp3', './sounds/poffin.mp3', './sounds/underground_passage.mp3', './sounds/route_205.mp3'],
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
        $('<h3>').addClass('player-card-hp').text('Your current card HP: ').appendTo('#row3')
        $('<h3>').addClass('com-card-hp').text('The computer\'s current card HP: ').appendTo('#row1')
        //Reset button
        $('<button>').attr('id', 'reset-button').text('Reset').appendTo('#row3')
        $('#reset-button').on('click', () => {
            Ui.removeDivs()
            Ui.makeDivs()
            Ui.startGame()
        })
    },
    removeDivs: () =>{
        $('#row1').remove()
        $('#row2').remove()
        $('#row3').remove()
    },
    startGame: () => {
        $('#not-needed-for-game').remove()
        variables.playerCardCount = 5
        variables.computerCardCount = 5
        variables.playerLiveCard = false
        variables.computerLiveCard = false
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
        $('.player-card-hp').text('Choose a card')
        $('.player-card').on('click', () => {
            if (variables.playerLiveCard === false) { // Check to see if you already have a card down
                variables.playerChoice = variables.cards.find(({imageUrl}) => imageUrl === $(event.target).attr('src')) //Inspiration for this method was found at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                $('#row2').append(event.target)
                variables.playerLiveCard = true // Update to say that you now have a card down
                $('.player-card-hp').html(`<h3>Your current card HP:<br>${variables.playerChoice.hp}</h3>`)
                gameLogic.battle()
            }
        })
        
    },
    battle: () => {
        //computer plays card
        if (variables.computerLiveCard === false && variables.computerCardCount > 0) {
            let randomComCardIndex = Math.floor(Math.random()*$('.com-card').length) 
            let $randomComputerCard = $('.com-card')[randomComCardIndex] //uses the random index generated on the previous line to choose a random computer card
            variables.computerChoice = variables.cards.find(({imageUrl}) => imageUrl === $($randomComputerCard).attr('src')) // Same line I used before, essentially just grabbing the data for the card the computer chose
            // console.log(computerChoice)
            $('#row2').append($randomComputerCard)
            // $('.com-card-hp').text(`The computer\'s current card HP: ${variables.computerChoice.hp}`)
            $('.com-card-hp').html(`<h3>The computer's current card HP:<br>${variables.computerChoice.hp}</h3>`)
            variables.computerLiveCard = true
        }
        //win check
        if (variables.computerCardCount === 0 || variables.playerCardCount === 0) {
            gameLogic.win()
        } else {
            $('<button>').attr('id', 'attack-button').text('Attack!').appendTo('#row2')
            $('#attack-button').on('click', () => {
                //clarification for what to do with setTimeouts taken from https://stackoverflow.com/questions/1190642/how-can-i-pass-a-parameter-to-a-settimeout-callback
                gameLogic.attack(variables.playerChoice)
                setTimeout(()=> {
                    gameLogic.attack(variables.computerChoice)
                },1000)
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
            variables.attackSound.currentTime = 2
            variables.attackSound.play()
            variables.attackSound.addEventListener('timeupdate', () => {
                if (variables.attackSound.currentTime >= 3) {
                    variables.attackSound.pause()
                }
            })

        //=======================
        //Attacking logic
        //=======================
        if (currentCard === variables.playerChoice){ //Check to see if the player is attacking or the computer is attacking
            if ($attack2 !== "") { //The first line checks if there is a second attack and if it has a damage value
                variables.computerChoice.hp -= parseInt($attack2)
                $('.com-card-hp').html(`<h3>The computer's current card HP:<br>${variables.computerChoice.hp}</h3>`)
                console.log('c' + variables.computerChoice.hp)
            } else if ($attack1 !== "") { // Checks to see if the first attack has a damage value
                variables.computerChoice.hp -= parseInt($attack1)
                $('.com-card-hp').html(`<h3>The computer's current card HP:<br>${variables.computerChoice.hp}</h3>`) 
                console.log('c' + variables.computerChoice.hp)
            } else { // If there are no damaging moves, do 10 damage
                variables.computerChoice.hp -= 10
                $('.com-card-hp').html(`<h3>The computer's current card HP:<br>${variables.computerChoice.hp}</h3>`)
                console.log('c' + variables.computerChoice.hp)
            }
            //Information about Jquery animations taken from https://www.w3schools.com/jquery/jquery_animate.asp
            //and https://www.w3schools.com/jquery/eff_animate.asp
            $('#row2 > .player-card').animate({marginBottom: '+=10px'}, 'fast')
            $('#row2 > .player-card').animate({marginBottom: '-=10px'}, 'fast')
            $('#row2 > .com-card').animate({height: '-=2%', width: '-=2%'}, 'fast')
            $('#row2 > .com-card').animate({height: '+=2%', width: '+=2%'}, 'fast')
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
                $('.player-card-hp').html(`<h3>Your current card HP:<br>${variables.playerChoice.hp}</h3>`)
                console.log('p' + variables.playerChoice.hp)
            } else if ($attack1 !== "") {
                variables.playerChoice.hp -= parseInt($attack1)
                $('.player-card-hp').html(`<h3>Your current card HP:<br>${variables.playerChoice.hp}</h3>`)
                console.log('p' + variables.playerChoice.hp)
            } else {
                variables.computerChoice.hp -= 10
                $('.player-card-hp').html(`<h3>Your current card HP:<br>${variables.playerChoice.hp}</h3>`)
                console.log('p' + variables.playerChoice.hp)
            }
            $('#row2 > .com-card').animate({marginTop: '+=10px'}, 'fast')
            $('#row2 > .com-card').animate({marginTop: '-=10px'}, 'fast')
            $('#row2 > .player-card').animate({height: '-=2%', width: '-=2%'}, 'fast')
            $('#row2 > .player-card').animate({height: '+=2%', width: '+=2%'}, 'fast')
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
            variables.battleMusic.pause()
            variables.victoryMusic.currentTime = 0
            variables.victoryMusic.play()
            console.log('Congratulations! The computer has run out of cards; You win!')
            $('#win-lose-textbox').html(`
            <h2>Congratulations, you won!</h2>
            <p>Well done trainer, you managed to use the cards given to you to best the computer in a brilliant fashion. Hats off to you, good sir. Click the button below to restart the game.</p>
            <button id="close-win-lose">Restart</button>`
            )
            $('#win-lose-modal').css('display', 'block')
            $('#close-win-lose').on('click', () =>{
                $('#win-lose-modal').css('display', 'none')
                variables.victoryMusic.pause()
                variables.battleMusic.currentTime = 0
                variables.battleMusic.play()
                Ui.removeDivs()
                Ui.makeDivs()
                Ui.startGame()
            })

        } else if (variables.playerCardCount === 0) {
            variables.battleMusic.pause()
            variables.lossMusic.currentTime = 0
            variables.lossMusic.play()
            console.log('Not this time trainer, you\'ve been bested.')
            $('#win-lose-textbox').html(`
            <h2>Not this time trainer, you've been bested.</h2>
            <p>The enemy was simply faster to adapt and better with his resources. Take this battle as an opportunity to learn and grow. Come back when you feel you're ready to try again and press the button below.</p>
            <button id="close-win-lose">Restart</button>`
            )
            $('#win-lose-modal').css('display', 'block')
            $('#close-win-lose').on('click', () =>{
                variables.lossMusic.pause()
                variables.battleMusic.currentTime = 0
                variables.battleMusic.play()
                $('#win-lose-modal').css('display', 'none')
                Ui.removeDivs()
                Ui.makeDivs()
                Ui.startGame()
            })
        }
    }

}



$(() => {
    //information on how to use audio taken from the following links
    //https://stackoverflow.com/questions/8489710/play-an-audio-file-using-jquery-when-a-button-is-clicked
    //https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics
    
    //==============================
    //Audio variables
    //==============================
    const backgroundMusic = new Audio()
    backgroundMusic.src = "./sounds/Route 225 (Day) - Pokémon Diamond_Pearl_Platinum.mp3"
    backgroundMusic.volume = 0.5

    variables.battleMusic = new Audio()
    variables.battleMusic.src = './sounds/cynthia_battle_music.mp3'
    variables.battleMusic.volume = 0.10

    variables.victoryMusic = new Audio()
    variables.victoryMusic.src = "./sounds/HG_SS_victory.mp3"
    variables.victoryMusic.volume = 0.1

    variables.lossMusic = new Audio()
    variables.lossMusic.src = "./sounds/Lose_music.mp3"
    variables.lossMusic.volume = 0.15

    variables.backgroundMusic = new Audio()
    variables.backgroundMusic.src = ''
    variables.backgroundMusic.volume = 0.2

    variables.attackSound = new Audio()
    variables.attackSound.src = './sounds/cat_sounds.mp3'
    variables.attackSound.volume = 0.3


    //Start button
    $('#start-button').on('click', () => {
        variables.backgroundMusic.pause()
        variables.battleMusic.play()
        Ui.makeDivs()
        Ui.startGame()
    })

    //How to play modal
    $('#htp-button').on('click', () => {
        $('#htp-modal').css('display', 'block')
    })
    $('#modal-close').on('click', () => {
        $("#htp-modal").css('display', 'none')
    })

    //background image selector
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

    //Music buttons
    $('#next-music').on('click', () => {
        if (variables.backgroundMusicCounter < variables.backgroundMusicArr.length - 1) {
            variables.backgroundMusicCounter += 1
            if(variables.backgroundMusic.currentTime > 0) {
                variables.backgroundMusic.pause()
            }
            if (variables.backgroundMusicCounter === 1 || variables.backgroundMusicCounter === 2) {
                variables.backgroundMusic.volume = 0.1
            }
            variables.backgroundMusic.src = variables.backgroundMusicArr[variables.backgroundMusicCounter]
            variables.backgroundMusic.currentTime = 0
            variables.backgroundMusic.play()
        }
    })
    $('#prev-music').on('click', () => {
        if (variables.backgroundMusicCounter > 0) {
            variables.backgroundMusicCounter -= 1
            if(variables.backgroundMusic.currentTime > 0) {
                variables.backgroundMusic.pause()
            }
            variables.backgroundMusic.src = variables.backgroundMusicArr[variables.backgroundMusicCounter]
            variables.backgroundMusic.currentTime = 0
            variables.backgroundMusic.play()
        }
    })
    $('#stop-music').on('click', () => {
        variables.backgroundMusic.pause()
    })
    
})
