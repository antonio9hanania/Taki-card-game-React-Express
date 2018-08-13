
class GameUtilities {
    static isPosibleStep(i_cardName, pileFrontStruct, totalToDraw) {	
        var pileCard = pileFrontStruct;
        var CardSeperatedName = i_cardName.split("_");
        var pileFirstName = pileCard.firstName;
        if (pileFirstName === 'maki') {
            pileFirstName = 'taki';
        }

        if (pileFirstName === 'plus2' && totalToDraw != 0) {
            if (CardSeperatedName[0] === 'plus2') {
                return true;
            }
            else {
                return false;
            }
        }

        else {
            if (CardSeperatedName[0] === pileFirstName || CardSeperatedName[1] === pileCard.lastName || CardSeperatedName[1] === "colorful") {
                return true;
            }
            else {
                return false;
            }
        }
    }

    static isPosibleStepTakiCase(i_cardName, OpenTakiColor) {
        var cardName = i_cardName.split("_");

        if (cardName[1] === OpenTakiColor) {
            return true;
        }
        else {
            return false;
        }
    }
	
    static isThereNoPosibleStep(isTakiCardActive, i_cardsInHandArr, pileFrontStruct, totalToDrow) {
        var res = true;
        var pileCard = pileFrontStruct;
	
        if (isTakiCardActive) {
            for (var i = 0 ; (i < i_cardsInHandArr.length) && res; i++) {
                res = !this.isPosibleStepTakiCase(i_cardsInHandArr[i], pileCard.lastName)
            }
        }
	
        else {
            for (var i = 0 ; (i < i_cardsInHandArr.length) && res; i++) {
                res = !this.isPosibleStep(i_cardsInHandArr[i], pileCard, totalToDrow);
            }
        }
        return res;
    }
}

module.exports = GameUtilities;