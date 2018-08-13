import React, { Component } from "react";
import GameUtilities from "../utilities/gameUtilities";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.playerIndex = props.playerIndex;
    this.cardClicked = props.cardClicked;
    this.pileFront = props.pileFront;
    this.takiCardIsActive = props.takiCardIsActive;
    this.totalToDraw = props.totalToDraw;

    this.decideClassName = this.decideClassName.bind(this);
    this.decideOnclickFunc = this.decideOnclickFunc.bind(this);
    this.extractCardIndex = this.extractCardIndex.bind(this);

    this.renderCardsInHand = this.renderCardsInHand.bind(this);
    this.renderCurrentClientComp = this.renderCurrentClientComp.bind(this);
    this.renderOtherClietComp = this.renderOtherClietComp.bind(this);
    this.renderCurrentPlayerCompTurn = this.renderCurrentPlayerCompTurn.bind(this);
    this.renderCurrentPlayerCompNotTurn = this.renderCurrentPlayerCompNotTurn.bind(this);
    this.renderOtherClietCompTurn = this.renderOtherClietCompTurn.bind(this);
    this.renderOtherClietCompNotTurn = this.renderOtherClietCompNotTurn.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    console.log("player comp died");
  }

  decideClassName(i_card) {
    var seperatedName = this.props.pileFront.split("_");
    var pileFront = { fullName: this.props.pileFront, firstName: seperatedName[0], lastName: seperatedName[1] };

    if (this.props.takiCardIsActive)
    {
      return GameUtilities.isPosibleStepTakiCase(i_card,this.props.OpenTakiColor)  == true 
        ? "playerHoverCards"
        : "playerCards";
    }
    else
    {
      return GameUtilities.isPosibleStep(i_card,pileFront,this.props.totalToDraw)  == true 
        ? "playerHoverCards"
        : "playerCards";
    }
  }

  decideOnclickFunc(card) {
    var seperatedName = this.props.pileFront.split("_");
    var pileFront = { fullName: this.props.pileFront, firstName: seperatedName[0], lastName: seperatedName[1] };
    if (this.props.takiCardIsActive){
      return GameUtilities.isPosibleStepTakiCase(
         card,
         this.props.OpenTakiColor
      );
    }
    else{
      return GameUtilities.isPosibleStep(
         card,
         pileFront,
         this.props.totalToDraw
      );
    }
  }

  extractCardIndex(e) {
    if(e.target.attributes.card_name.value == "change_colorful"){
      this.props.handleColorModalDecision(true);
    }
    if(e.target.attributes.card_name.value.split("_")[0] == "taki"){
      console.log("debugging case");
    }
    this.cardClicked(e.target.attributes.index.value);
  }

  componentDidUpdate() {

  }

  render() {
    if (this.props.playerCell.data != null && this.props.playerCell.data.cardsArrInHand.length !== 0) {
       return this.renderCardsInHand();
    }
 else {
      return " "; //we need instead to call handle end game from the game component before we getting to this situation 
    }
  }

  renderCardsInHand(){
    if (this.props.showCards) 
      return this.renderCurrentClientComp();
    else 
      return this.renderOtherClietComp();
  }

  renderCurrentClientComp(){
    if(this.props.isMyComponentTurn)
      return this.renderCurrentPlayerCompTurn(); // with click and with Background
    else
      return this.renderCurrentPlayerCompNotTurn(); // without click

  }

  
  renderOtherClietComp(){
    if(this.props.isTurn){
      return this.renderOtherClietCompTurn(); //with Background
    }
    else{
      return this.renderOtherClietCompNotTurn();// without background
    }
  }


  renderCurrentPlayerCompTurn(){
    let calcdegree = (this.props.playerCell.data.cardsArrInHand.length / 2) * 3;

    return (
      <div id={"Player_" + String(this.playerIndex)} style={{background: "rgba(59,89,152,0.5"}}>
        {this.props.playerCell.data.cardsArrInHand.map((item, index) => (
          <img
            className={this.decideClassName(item)}
            onClick={e =>
              this.decideOnclickFunc(item) === true 
                ? this.extractCardIndex(e)
                : alert('not an option')
            }
            key={"Card_" + String(index) + "P_" + String(this.playerIndex)}
            index={String(index)}
            card_name = {String(item)}
            style={{

              transform: "rotate(" + String(-calcdegree + 3 * index) + "deg)"

            }}
            src={require("./resources/" + String(item) + ".png")}
          />
        ))}
      </div>
    );
  }

  renderCurrentPlayerCompNotTurn(){
    let calcdegree = (this.props.playerCell.data.cardsArrInHand.length / 2) * 3;
    return (
      <div id={"Player_" + String(this.playerIndex)}>
        {this.props.playerCell.data.cardsArrInHand.map((item, index) => (
          <img
            className={"playerCards"}
            key={"Card_" + String(index) + "P_" + String(this.playerIndex)}
            index={String(index)}
            card_name = {String(item)}
            style={{
              transform:
                "rotate(" + String(-calcdegree + 3 * index) + "deg)"
            }}
            src={require("./resources/" + String(item) + ".png")}
          />
        ))}
      </div>
    );
  }

  renderOtherClietCompNotTurn(){
    let calcdegree = (this.props.playerCell.data.cardsArrInHand.length / 2) * 3;
    return (
      <div id={"Player_" + String(this.playerIndex)}>
        {this.props.playerCell.data.cardsArrInHand.map((item, index) => (
          <img
            className={"playerCards"}
            key={"Card_" + String(index) + "P_" + String(this.playerIndex)}
            index={String(index)}
            card_name = {String(item)}
            style={{
              transform:
                "rotate(" + String(-calcdegree + 3 * index) + "deg)"
            }}
            src={require("./resources/" + 'card_back' /*String(item)*/ + ".png")}
          />
        ))}
      </div>
    );

  }

  renderOtherClietCompTurn(){
    let calcdegree = (this.props.playerCell.data.cardsArrInHand.length / 2) * 3;
    return (
      <div id={"Player_" + String(this.playerIndex)} style={{background: "rgba(59,89,152,0.5"}}>
        {this.props.playerCell.data.cardsArrInHand.map((item, index) => (
          <img
            className={"playerCards"}
            key={"Card_" + String(index) + "P_" + String(this.playerIndex)}
            index={String(index)}
            card_name = {String(item)}
            style={{
              transform:
                "rotate(" + String(-calcdegree + 3 * index) + "deg)"
            }}
            src={require("./resources/" + 'card_back' /*String(item)*/ + ".png")}
          />
        ))}
      </div>
    );
  }

}
