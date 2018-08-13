class CardContainerLogics{
    
    constructor(){
        this.deck = [];
        this.pile = [];
        this.cards = ['1', 'plus2', '3', '4', '5', '6', '7', '8', '9', 'taki', 'stop', 'plus'];
        this.colors = ['red', 'blue', 'green', 'yellow'];
    }
    passCardsToDeck(i_cards){
        var y;
        while(i_cards > 0){
            y = i_cards.pop();
            if (y.firstName === 'maki') {
                y.firstName = 'taki';
                y.lastName = 'colorful';
            }
            else if (y.firstName === 'change') {
                y.lastName = 'colorful';
            }
            this.deck.push(y);
        }
    }
    
    passPileToDeck() {
        var x = this.pile.pop();
        var y;
        while (this.pile.length > 0) {
            y = this.pile.pop();
            if (y.firstName === 'maki') {
                y.firstName = 'taki';
                y.lastName = 'colorful';
            }
            else if (y.firstName === 'change') {
                y.lastName = 'colorful';
            }
            this.deck.push(y);
        }
        this.pile.push(x);
    }

    shuffleDeck() {
        for (var i = this.deck.length; i-- > 1;) {
            var j = Math.floor(Math.random() * i);
            var tmp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = tmp;
        }
    }

    createDeck() {
        var card;
        var cardindex = 0;

        if (this.deck.length > 0) { //case of new round
            this.makeEmptyDeckAndPile();
        }

        for (var i = 0 ; i < this.cards.length ; i++) {
            for (var j = 0 ; j < this.colors.length; j++) {
                var cardToPush = this.cards[i] + '_' + this.colors[j];
                this.deck.push(cardToPush);
                this.deck.push(cardToPush);
            }
        }
        for (var i = 0; i < 2 ; i++) {
            this.deck.push('taki_colorful');
        }
        
        for (var i = 0; i < this.colors.length ; i++) {
            this.deck.push('changeDirection_'+ this.colors[i]);
            this.deck.push('changeDirection_'+ this.colors[i]);
        }

        for (var i = 0; i < 4 ; i++) {
            this.deck.push('change_colorful');
        }
        this.shuffleDeck();
    }

    makeEmptyDeckAndPile() {
        while (this.deck.length > 0) {
            this.deck.pop();
        }
        while (this.pile.length > 0) {
            this.pile.pop();
        }
    }

    printPileToLog() {
        for (var i = 0; i < this.pile.length ; i++) {
            console.log("card: ", this.pile[i]);
        }
    }

    printDeckToLog() {
        for (var i = 0; i < this.deck.length ; i++) {
            console.log("card: ", this.deck[i]);
        }
    }

    getPileFront() {
        var fullName = this.pile[this.pile.length - 1];
        var seperatedName = fullName.split("_");
        return { fullName: fullName, firstName: seperatedName[0], lastName: seperatedName[1] };
    }

    drawCards(i_totalToDraw, io_player) {

        if (i_totalToDraw === 0) {
            i_totalToDraw = 1;
        }
        for (var i = 0; i < i_totalToDraw; i++) {
            if (this.deck.length === 0) {
                this.passPileToDeck();
                this.shuffleDeck();
            }
            io_player.cardsArrInHand.push(this.deck.pop());
        }
        return 0;
    }

    drawFirstPileCard() {
        for (var i = 0; i < this.deck.length ; i++) {
            if (this.deck[i].charAt(0) <= '9') {
                var tempToSwap;
                tempToSwap = this.deck[this.deck.length - 1];
                this.deck[this.deck.length - 1] = this.deck[i];
                this.deck[i] = tempToSwap;
                this.pile.push(this.deck.pop());
                break;
            }
        }
        return this.getPileFront();
    }
};

module.exports = CardContainerLogics;
