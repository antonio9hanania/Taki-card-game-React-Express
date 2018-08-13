import React from 'react';
import ReactDOM from 'react-dom';
import ChatContaier from './chatContainer.jsx';
import Pile from "./Pile.jsx";
import Deck from "./Deck.jsx";
import PlayerComp from "./PlayerComp.jsx"
import ColorModal from "./ColorModal.jsx";

export default class Game extends React.Component {
  constructor(args) {
    super(...args);

    this.state = {
      currentUserName: args.userName,
      currentRoomName: args.roomName,
      currentPlayerIndex: undefined,
      chatOn: false,
      LogicGame: undefined,
      endGame: false,
      errMessage: "",
      colorModalOpen: false,
      Stats: { num_turns: 0, last_one: 0, avg_time: 0, total_avg_time: 0 },
    };
    this.timeoutId;
    this.currentPlayerIndexTimeOut;
    this.getLogicGame = this.getLogicGame.bind(this);
    this.renderGameOn = this.renderGameOn.bind(this);
    this.setPlayers = this.setPlayers.bind(this);
    this.cardClicked = this.cardClicked.bind(this);
    this.drawCards = this.drawCards.bind(this);
    this.renderWithColorModal = this.renderWithColorModal.bind(this);
    this.handleColorDicision = this.handleColorDicision.bind(this);
    //this.renderWithoutColorModal = this.renderWithoutColorModal.bind(this);
    this.getCurrentPlayerIndex = this.getCurrentPlayerIndex.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleColorModalShow = this.handleColorModalShow.bind(this);
    this.deleteGame = this.deleteGame.bind(this);
  }

  componentDidMount() {
    this.getLogicGame();
  }

  componentWillUnmount(){
    if(this.timeoutId)
      clearTimeout(this.timeoutId);

    if(this.currentPlayerIndexTimeOut)
      clearTimeout(this.currentPlayerIndexTimeOut);

    
    ;
  }

  render() {
    if (this.state.LogicGame === undefined || this.state.currentPlayerIndex === undefined) {
      return (
        ""
      );
    }
    else if (!this.state.endGame) {
      return this.renderGameOn();
    }
    else { /// will not reach it after last update
      if(this.state.LogicGame.Winner.userName == this.state.currentUserName){
      return (
        <div>
          Winner END GAME
        </div>
      );
    }
    else{
      return(
        <div>
        Looser END GAME
      </div>
      );
    }
    }
  }

  renderGameOn() {
    return this.renderWithColorModal();
  }

  /*renderWithoutColorModal() {
    var pileFront = this.state.LogicGame.CardContainer.pile[this.state.LogicGame.CardContainer.pile.length - 1];
    return (
      <div>
        <br /><br />
        <div>
          <div id="gameScreen">
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {this.setPlayers()}
          </div>
        </div>
        <div style={{ top: "0vh", position: "fixed", height: "30vh", width: "100%" }}>
          <div className="user-info-area">
            Hello {this.state.currentUserName}, Room name: {this.state.currentRoomName}
            <div id="stats">
              Game number of turns: {this.state.Stats.num_turns}    |
                Number of "last card" times:{this.state.Stats.last_one}    |
                Round turns avg time:{this.state.Stats.avg_time}    |
                Timer: {this.state.Stats.time}
            </div>
          </div>
          <div>
          <Pile pileFront={pileFront} pileLength={(this.state.LogicGame.CardContainer.pile.length)}/>
            <Deck drawCards={this.drawCards} showBotton={this.state.LogicGame.PlayersArr[this.state.currentPlayerIndex].isTurn} />
          </div>
        </div>
      </div>
    );
  }*/

  renderWithColorModal() {
    var pileFront = this.state.LogicGame.CardContainer.pile[this.state.LogicGame.CardContainer.pile.length - 1];
    return (
      <div>
        <div id="gameScreen">
          <br /><br />

          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          {this.setPlayers()}
        </div>
        <div style={{ top: "0vh", position: "fixed", height: "30vh", width: "100%" }}>

          <div className="user-info-area">
            Hello {this.state.currentUserName}, Room name: {this.state.roomName}
            <div id="stats">
              Game number of turns: {this.state.Stats.num_turns}    |
            Number of "last card" times:{this.state.Stats.last_one}    |
            Round turns avg time:{this.state.Stats.avg_time}    |
            Timer: {this.state.Stats.time}
            </div>
            <div>
              <Pile pileFront={pileFront} pileLength={(this.state.LogicGame.CardContainer.pile.length)}/>
              <Deck OpenTakiColor={this.state.LogicGame.OpenTakiColor} pileFront={pileFront} takiCardIsActive={this.state.LogicGame.takiCardIsActive} totalToDraw={this.state.LogicGame.totalToDraw} drawCards={this.drawCards} showBotton={this.state.LogicGame.PlayersArr[this.state.currentPlayerIndex].isTurn} currentUserCardsInHand={this.state.LogicGame.PlayersArr[this.state.currentPlayerIndex].data.cardsArrInHand} />
              <ColorModal showColorModal= {this.state.colorModalOpen} handleColorDicision={this.handleColorDicision} handleColorModalShow={this.handleColorModalShow} />

            </div>
          </div>
        </div>
      </div>

    );
  }

  setPlayers() {
    var pileFront = this.state.LogicGame.CardContainer.pile[this.state.LogicGame.CardContainer.pile.length - 1];
    let Cplayers = [];
    let j = this.state.LogicGame.PlayersArr.length;
    if (this.state.LogicGame.PlayersArr.length === this.state.LogicGame.numPlayers) {
      let i;
      for (i = 0; i < this.state.LogicGame.PlayersArr.length; i++) {
        Cplayers.push(
          <PlayerComp
            pileFront={pileFront}
            takiCardIsActive={this.state.LogicGame.takiCardIsActive}
            totalToDraw={this.state.LogicGame.totalToDraw}
            OpenTakiColor={this.state.LogicGame.OpenTakiColor}

            cardClicked={this.cardClicked}
            playerCell={this.state.LogicGame.PlayersArr[i]}
            handleColorModalDecision={this.handleColorModalShow}
            playerIndex={i}
            isTurn={this.state.LogicGame.PlayersArr[i].isTurn}
            showCards={((i == this.state.currentPlayerIndex) ? true : false)}
            key={i}
            isMyComponentTurn={((this.state.LogicGame.PlayersArr[i].isTurn === true && i == this.state.currentPlayerIndex) ? true : false)}
          />
        );
        if (i < this.state.LogicGame.PlayersArr.length - 1) {
          j++;
          Cplayers.push(
            <div key={j}>
              <br /><br />
            </div>
          );
        }
      }
    }
    return Cplayers;
  }

  handleColorModalShow(toOpen) {
    this.setState({ colorModalOpen: toOpen });
  }

  getLogicGame() {
    return fetch('/gameManagement/getCurrentLogicGame', { method: 'GET', credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        this.timeoutId = setTimeout(this.getLogicGame, 200);
        return response.json();
      })
      .then(GameSnapshot => {
        if(GameSnapshot.LogicGame.roundOver){
          this.deleteGame();
          //this.setState(() => ({ LogicGame: GameSnapshot.LogicGame, Stats: GameSnapshot.Stats,endGame:true }));
        }
        this.setState(() => ({ LogicGame: GameSnapshot.LogicGame, Stats: GameSnapshot.Stats }));

        if (this.currentPlayerIndex === undefined) {
          this.getCurrentPlayerIndex();
        }
      })
      .catch(err => { throw err });
  }


  deleteGame(){
    if(this.state.LogicGame.Winner!= undefined){
      clearTimeout(this.timeoutId);
      this.props.handleGameEnded(this.state.LogicGame.Winner.userName == this.state.currentUserName);
    }
  }


  drawCards() {
    fetch('/gameManagement/drawCards', {
      method: 'POST',
      credentials: 'include'
    })

      .then(response => {
        if (!response.ok) {
          throw response;
        }
        else {
          this.setState(() => ({ errMessage: "" }));
        }
      })
      .catch(response => {
        if (response.status === 403) {
          this.setState(() => ({ errMessage: "fetch error on draw cards" }));
          this.handleError();
        }
      })
  }

  cardClicked(i_cardIndex) {
    fetch('/gameManagement/cardDecision', {
      method: 'POST',
      body: i_cardIndex,
      credentials: 'include'
    })

      .then(response => {
        if (!response.ok) {
          throw response;
        }
        else {
          this.setState(() => ({ errMessage: "" }));
        }
      })
      .catch(response => {
        if (response.status === 403) {
          this.setState(() => ({ errMessage: "fetch error on card dicision" }));
          this.handleError();
        }
      })
  }


  handleColorDicision(i_color) {
    fetch('/gameManagement/ColorDecision', {
      method: 'POST',
      body: i_color,
      credentials: 'include'
    })

      .then(response => {
        if (!response.ok) {
          throw response;
        }
        else {
          this.setState(() => ({ errMessage: "" }));
        }
      })
      .catch(response => {
        if (response.status === 403) {
          this.setState(() => ({ errMessage: "fetch error on color dicision" }));
          this.handleError();
        }
      })
  }


  getCurrentPlayerIndex() {
    return fetch('/gameManagement/getCurrentPlayerIndex', { method: 'GET', credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(currentPlayerIndex => {
        this.setState(() => ({ currentPlayerIndex }));
      })
      .catch(err => { throw err });
  }

  // getStats(){
  //   return fetch('/gameManagement/getStats', { method: 'GET', credentials: 'include' })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw response;
  //     }
  //     return response.json();
  //   })
  //   .then(stats => {
  //     if(this.state.stats!= stats){
  //       this.setState(() => ({ stats }));
  //     }
  //   })
  //   .catch(err => { throw err });
  // }

  handleError() {
    if (this.state.errMessage != "") {
      alert(this.state.errMessage);
    }
  }

}


