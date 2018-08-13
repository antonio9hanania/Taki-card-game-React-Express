const GameUtilities = require('../utilities/gameUtilities');

class Game {
    constructor(numPlayers, roomName) {
        this.numPlayers = numPlayers;
        this.roomName = roomName;
        this.CardContainer = new (require('./CardContainerLogics.js'))();
        this.stats = new (require('./Stats.js'))();

        this.PlayersArr = [];
        this.gameReadyToRun = false;

        this.totalSeconds = 0;
        this.bestMatchIndex = undefined;
        this.bestMatch = 0;
        this.pileCardNumber = undefined;
        this.pileCardColor = undefined;
        this.currentBotCardNumber = undefined;
        this.currentBotCardColor = undefined;
        this.takiCardIsActive = false;
        this.OpenTakiColor = "";
        this.currentPlayerIndex = 0;
        this.roundOver = false;
        this.timeOutDone = false;
        this.totalToDraw = 0;
        this.curTime = 0;
        this.startedTime = 0;
        this.gameStartedTime = 0;
        this.showColorModal = false;
        this.dad = undefined;
        this.totalSum = 0;
        this.totalTurns = 0;
        this.totalAvg = 0;
        this.Winner = undefined;
        this.reverceActive = false;
        this.devideCards = this.devideCards.bind(this);
        this.countTimer = this.countTimer.bind(this);
        this.removePlayerFromArr = this.removePlayerFromArr.bind(this);
        this.deleteAllAlocations = this.deleteAllAlocations.bind(this);
        this.removeAllPlayerFromArr = this.removeAllPlayerFromArr.bind(this);
    }

    init() {
        this.CardContainer.makeEmptyDeckAndPile();
        this.CardContainer.createDeck();
        this.CardContainer.drawFirstPileCard();
    }

    insertPlayer(i_PlayerName, i_PlayerIndex) {
        if (i_PlayerIndex == 0)
            this.PlayersArr.push({ userName: i_PlayerName, isTurn: true, finished: false, data: new (require('./PlayerLogics.js'))() });
        else
            this.PlayersArr.push({ userName: i_PlayerName, isTurn: false, finished: false, data: new (require('./PlayerLogics.js'))() });

        if (this.numPlayers == this.PlayersArr.length) {
            this.gameReadyToRun = true;
            this.devideCardsToAll();
            this.gameStartedTime = new Date().getTime();
        }
    }

    devideCardsToAll() {
        var index = 0;
        for (; index < this.PlayersArr.length; index++) {
            this.devideCards(index);
        }

    }

    devideCards(i_playerIndex) {
        this.totalToDraw = 8;
        this.totalToDraw = this.CardContainer.drawCards(this.totalToDraw, this.PlayersArr[i_playerIndex].data);
    }

    GetCardFromDeck() {
        let res = false;
        if (GameUtilities.isThereNoPosibleStep(this.takiCardIsActive, this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand, this.CardContainer.getPileFront(), this.totalToDraw)) {
            this.totalToDraw = this.CardContainer.drawCards(this.totalToDraw, this.PlayersArr[this.currentPlayerIndex].data);
            res = true;
        }
        else {
        }
        return res;
    }

    getStats() {
        let timeInSec = (new Date().getTime() - this.gameStartedTime) / 1000;
        let string = { hour: 0, minute: 0, seconds: 0 };
        string.hour = Math.floor(timeInSec / 3600);
        string.minute = Math.floor((timeInSec - string.hour * 3600) / 60);
        string.seconds = Math.floor(timeInSec - (string.hour * 3600 + string.minute * 60));
        let time = string.hour + ":" + string.minute + ":" + string.seconds;
        let avg = Math.floor(this.stats.getAvgTime());
        return { time: time, num_turns: this.stats.turns, last_one: this.stats.last, avg_time: avg, total_avg_time: this.totalAvg };
    }

    setTurnTime(curTime) {
        this.stats.turnstime[this.stats.turns] = (new Date().getTime() - this.startedTime) / 1000;
        this.startedTime = new Date().getTime();
    }

    setStats() {
        this.stats.turns++;
        this.totalTurns++;
        if (this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand.length === 1)
            this.stats.last++;
    }

    devideCards(i_playerIndex) {
        this.totalToDraw = 8;
        this.totalToDraw = this.CardContainer.drawCards(this.totalToDraw, this.PlayersArr[i_playerIndex].data);
        this.setTurnTime(this.curTime);
    }

    countTimer() {
        this.curTime = new Date().getTime();
    }

    nextTurnIncrement(skipNext, turnAgain, activeBotTakiCard) {
        var that = this;
        console.log("NTI START INDEX: ", this.currentPlayerIndex);

        if (this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand.length == 0 && !turnAgain) {
            this.PlayersArr[this.currentPlayerIndex].finished = true;
        }
        this.setStats();
        this.setTurnTime(this.curTime);

        if (!this.checkEndGame()) {

            if (!turnAgain) {
                this.PlayersArr[this.currentPlayerIndex].isTurn = false;
                if (!this.reverceActive) {
                    this.currentPlayerIndex++;
                }
                else {
                    this.currentPlayerIndex--;
                    if (this.currentPlayerIndex < 0)
                        this.currentPlayerIndex += this.PlayersArr.length;
                }
                this.currentPlayerIndex = this.currentPlayerIndex % this.PlayersArr.length;
                while (this.PlayersArr[this.currentPlayerIndex].finished) {
                    if (!this.reverceActive) {
                        this.currentPlayerIndex++;
                    }
                    else {
                        this.currentPlayerIndex--;
                        if (this.currentPlayerIndex < 0)
                            this.currentPlayerIndex += this.PlayersArr.length;
                    }
                    this.currentPlayerIndex = this.currentPlayerIndex % this.PlayersArr.length;
                }

                if (skipNext) {
                    if (!this.reverceActive) {
                        this.currentPlayerIndex++;
                    }
                    else {
                        this.currentPlayerIndex--;
                        if (this.currentPlayerIndex < 0)
                            this.currentPlayerIndex += this.PlayersArr.length;
                    }
                    this.currentPlayerIndex = this.currentPlayerIndex % this.PlayersArr.length;
                    while (this.PlayersArr[this.currentPlayerIndex].finished) {
                        if (!this.reverceActive) {
                            this.currentPlayerIndex++;
                        }
                        else {
                            this.currentPlayerIndex--;
                            if (this.currentPlayerIndex < 0)
                                this.currentPlayerIndex += this.PlayersArr.length;
                        }
                        this.currentPlayerIndex = this.currentPlayerIndex % this.PlayersArr.length;
                    }

                }
                this.PlayersArr[this.currentPlayerIndex].isTurn = true;
            }
        }
        console.log("NTI END INDEX: ", this.currentPlayerIndex);
        this.CardContainer.printPileToLog();
    }


    checkEndGame() {
        if (!this.roundOver) {
            if (this.Winner === undefined) {
                var i = 0;
                for (; i < this.PlayersArr.length; i++) {
                    if (this.PlayersArr[i].finished) {
                        this.Winner = { userName: this.PlayersArr[i].userName, index: i };
                    }
                }
            }

            var i = 0;
            var finishCount = 0;
            for (; i < this.PlayersArr.length; i++) {
                if (this.PlayersArr[i].finished) {
                    finishCount++;
                }
            }
            if (finishCount == this.PlayersArr.length - 1) {
                this.roundOver = true;
                this.totalSum += (this.getStats().avg_time * this.getStats().num_turns);
                this.totalAvg = Math.floor(this.totalSum / this.totalTurns);
                return true;
            }
            else {
                return false;
            }

        }
        else {
            return true;
        }
    }

    initialVariables() {
        this.bestMatchIndex = undefined;
        this.bestMatch = 0;
        this.pileCardNumber = undefined;
        this.pileCardColor = undefined;
        this.currentBotCardNumber = undefined;
        this.currentBotCardColor = undefined;
        this.takiCardIsActive = false;
        this.OpenTakiColor = "";
        for (var i = 0; i < this.PlayersArr.length; i++) {
            this.PlayersArr[i].isTurn = false;
            this.PlayersArr[i].data = null;
        }
    }

    reset() {
        delete (this.stats);
        delete (this.CardContainer);
        this.roundOver = false;
        this.stats = new (require('./Stats.js'))();
        this.totalSeconds = 0;
        this.startedTime = 0;
        this.gameStartedTime = 0;
        this.curTime = 0;
        this.totalToDraw = 0;
        this.Winner = null;
        this.CardContainer = new (require('./CardContainerLogics.js'))();
    }

    setGamePlayers(i_PlayersArr) {
        this.PlayersArr = i_PlayersArr;
    }

    selectColor(color) {
        var newCard = 'change_' + color;
        this.showColorModal = false;
        this.CardContainer.pile[this.CardContainer.pile.length - 1] = newCard;
        this.nextTurnIncrement(false, false, false);
    }

    playerDecision(index) {
        var card = this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand[index];
        var cardName = card.split("_");
        if (GameUtilities.isPosibleStep(card, this.CardContainer.getPileFront(), this.totalToDraw)){ // double check
            var newColor = undefined;
            var newCard = undefined;

            if (cardName[0] === 'changeDirection') {
                this.reverceActive = !this.reverceActive;
            }

            if (cardName[0] === 'plus2') {
                this.totalToDraw += 2;
            }

            this.CardContainer.pile.push(this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand[index]);
            this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand.splice(index, 1);

            if (cardName[0] === 'taki') {
                newColor = cardName[1];
                this.takiCardIsActive = true;

                if (newColor === 'colorful') {
                    newColor = this.CardContainer.pile[this.CardContainer.pile.length - 2].split("_");
                    newColor = newColor[1];
                    newCard = 'maki_' + newColor;
                    this.CardContainer.pile[this.CardContainer.pile.length - 1] = newCard;
                }

                this.OpenTakiColor = newColor;
                if (GameUtilities.isThereNoPosibleStep(this.takiCardIsActive, this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand, this.CardContainer.getPileFront(), this.totalToDraw)) {
                    this.takiCardIsActive = false;
                    this.OpenTakiColor = "";
                    this.PlayersArr[this.currentPlayerIndex].isTurn = false;
                    this.nextTurnIncrement(false, false, false);
                }
            }
            else {
                var toSkipNext = false;
                var turnAgain = false;
                var pickColorActive = false;
                if (cardName[0] !== 'change')
                    //this.forceUpdateForStep();
                    this.OpenTakiColor = "";
                if (cardName[0] === 'stop') {
                    toSkipNext = true;
                }
                else if (cardName[0] === 'plus') {
                    turnAgain = true;
                }
                else if (cardName[0] === 'change') {
                    pickColorActive = true;
                }

                if (!pickColorActive)
                    this.nextTurnIncrement(toSkipNext, turnAgain, false);
                else {
                    this.showColorModal = true;
                }
            }
        }
    }

    playerDecisionTakiCase(index) { //while there is no more cards that posible to set to pile for the current player.. after it we need to return the display logics as it was before..				
        var card = this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand[index];
        var cardName = card.split("_");
        var thereIsOption;
        var skipNext = false;
        var turnAgain = false;
        if (GameUtilities.isPosibleStepTakiCase(card, this.OpenTakiColor)) { //double check
            this.CardContainer.pile.push(this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand[index]);
            this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand.splice(index, 1);

            if (GameUtilities.isThereNoPosibleStep(this.takiCardIsActive, this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand, this.CardContainer.getPileFront(), this.totalToDraw)) {
                this.takiCardIsActive = false;
                if (this.CardContainer.getPileFront().firstName === 'plus2') {
                    this.totalToDraw += 2;
                }
                else if (this.CardContainer.getPileFront().firstName === 'stop') {
                    skipNext = true;
                }
                else if (this.CardContainer.getPileFront().firstName === 'plus') {
                    turnAgain = true;
                }
                else if (cardName[0] === 'changeDirection') {
                    this.reverceActive = !this.reverceActive;
                }
                this.nextTurnIncrement(skipNext, turnAgain, false);
            }
        }
    }

    GetCardFromDeck() {
        let res = false;
        if (GameUtilities.isThereNoPosibleStep(this.takiCardIsActive, this.PlayersArr[this.currentPlayerIndex].data.cardsArrInHand, this.CardContainer.getPileFront(), this.totalToDraw)) {
            this.totalToDraw = this.CardContainer.drawCards(this.totalToDraw, this.PlayersArr[this.currentPlayerIndex].data);
            res = true;
        }
        else {
        }
        return res;
    }

    removePlayerFromArr(i_index) {
        this.CardContainer.passCardsToDeck(this.PlayersArr[i_index].data.cardsArrInHand);
        delete (this.PlayersArr[i_index].data);
        this.PlayersArr.splice(i_index, 1);
    }
    removeAllPlayerFromArr() {
        var i = 0;
        for (; i < this.PlayersArr.length; i++) {
            this.removePlayerFromArr(i);
        }
    }

    deleteAllAlocations() {
        this.removeAllPlayerFromArr();
        delete (this.stats);
        delete (this.CardContainer);
    }
}


module.exports = Game;