import React, { Component } from "react";
import GameUtilities from "../utilities/gameUtilities";

export default class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.drawCardsChecker = this.drawCardsChecker.bind(this);
  }

  render() {
    if (this.props.showBotton) {
      return (
        <div id="deck_area">
          <div id="deck">
            <div id="deck_image">
              <img className="cards" src={require("./resources/card_back.png")} />
              <br/>
              <a id="takeCard_button" onClick={this.drawCardsChecker}>
                <img style={{width: "8vw", height: "5vh"}}src={require("./resources/button_take-card.png")} />
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="deck_area">
          <div id="deck">
            <div id="deck_image">
              <img className="cards" style={{textAlign: 'center'}} src={require("./resources/card_back.png")} />
            </div>
          </div>
        </div>
      );
    }
  }

  drawCardsChecker(){
    var seperetedPileFront =  this.props.pileFront.split("_");

    var pileFront = { fullName: this.props.pileFront, firstName: seperetedPileFront[0], lastName: seperetedPileFront[1] };
    if(GameUtilities.isThereNoPosibleStep(this.props.takiCardIsActive,this.props.currentUserCardsInHand , pileFront, this.props.totalToDraw)){
      this.props.drawCards();
    }
    else{
      alert("You have an options, canot draw");
    }
  }
}
