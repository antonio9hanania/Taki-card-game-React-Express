import React from 'react';
import ReactDOM from 'react-dom';
import ChatContaier from './chatContainer.jsx';
import Game from './game.jsx';
export default class GameManager extends React.Component {
    constructor(args) {
        super(...args);

        this.state = {
            content: [],
            gameReady: false,
            roomName: null,
            userName: null,
            gameLogicReady: false,
            newVisitor: true,
            Winner: undefined,
            errMessage: "",
        };
        this.timeoutIdGameStatusChecker;
        this.timeOutIdGameCreation;
        this.timeoutId;
        this.getChatContent = this.getChatContent.bind(this);
        this.checkGameReady = this.checkGameReady.bind(this);
        this.renderGameReady = this.renderGameReady.bind(this);
        this.createLogicGame = this.createLogicGame.bind(this);
        this.backToLobby = this.backToLobby.bind(this);

        this.state.roomName = args.gameRoom;
        this.state.userName = args.userName;
        this.state.newVisitor = args.newVisitor;
        this.backToLobby = this.backToLobby.bind(this);
        this.handleGameEnded = this.handleGameEnded.bind(this);
        this.renderWinning = this.renderWinning.bind(this);
        this.renderLossing = this.renderLossing.bind(this);
        this.finishEndGoToLobby = this.finishEndGoToLobby.bind(this);

    }

    componentDidMount() {
        this.getChatContent();
        this.checkGameReady();

        if (this.state.newVisitor) {
            this.createLogicGame();
        }

    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        if (this.timeoutIdGameStatusChecker) {
            clearTimeout(this.timeoutIdGameStatusChecker);
        }
        if(this.timeOutIdGameCreation){
            clearTimeout(this.timeOutIdGameCreation);

        }
    }

    render() {
        if (!this.state.gameReady && this.state.Winner == undefined) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            return this.renderGameWatingForPlayers();
        }
        else if(this.state.Winner === true){
            return this.renderWinning();
        }
        else if(this.state.Winner === false){
            return this.renderLossing();
        }
        else {
            return this.renderGameReady();
        }
    }


    renderGameReady() {
        return (
            <Game userName={this.state.userName} roomName={this.state.roomName} handleGameEnded={this.handleGameEnded} />
        );
    }

    renderLossing(){
        return (
            <div id="looserScreen">
              <img
                src={require("./resources/giphyLooser.gif")}
                id="LOSER_imeg"
              />
              <br/>
              <button className="back_to_lobby btn" style={{textAlign: "center", display:"block", margin:"0 auto"}} onClick={this.finishEndGoToLobby}> go to lobby</button>
            </div>
        );
    }

    renderWinning(){
        return (
            <div id="winnerScreen">
                <img
                src={require("./resources/giphyWinner.gif")}
                id="WINNER_imeg"
                />
                <br/>
                <button className="back_to_lobby btn" style={{textAlig: "center", display:"block", margin:"0 auto"}} onClick={this.finishEndGoToLobby}> go to lobby</button>
          </div>
        );
    }

    renderGameWatingForPlayers() {
        return (
            <div >
                <img src={require("./resources/giphy.gif")} id="Waiting_imag" frameBorder="0" className="giphy-embed" allowFullScreen/>
                <div id="head_of_everything">

                    <div className="user-info-area">
                        Hello {this.state.userName}
                        <button className="back_to_lobby btn" onClick={this.backToLobby}>back to lobby</button>
                    </div>
                </div>

                <div className="chat-base-container">
                    <ChatContaier />
                </div>

            </div>
        );
    }
    finishEndGoToLobby(){
        if(this.timeoutId){
            clearTimeout( this.timeoutId);
        }
        if(this.timeoutIdGameStatusChecker){
            clearTimeout( this.timeoutIdGameStatusChecker);
        }

        return fetch('/users/changeGameEnded', { method: 'POST', credentials: 'include' })
        .then(response => {
            if (response.ok) {
                this.props.handleRoomLeave();   
            }
            else{
                this.setState(()=> ({errMessage:"game ended still not changed" }));
            }
        });
    }
    handleGameEnded(isWinner){
        return fetch('/rooms/removeGame', { method: 'POST', credentials: 'include' })
        .then(response => {
            if (response.ok) {
                this.setState(()=> ({Winner: isWinner, gameReady:true, errMessage: ""}));
            }
            else{
                this.setState(()=> ({errMessage:"ok" }));
            }
        });

    }

    backToLobby() {
        return fetch('/gameManagement/removeUserFromRoom', { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    this.props.handleRoomLeave();
                }
                else{
                    //////// handleError
                }
            });
    }

    getChatContent() {
        return fetch('/chat', { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getChatContent, 200);
                return response.json();
            })
            .then(content => {
                if(this.state.Winner != undefined){
                    if(this.timeoutId){
                        clearTimeout(this.timeoutId);
                    }
                }
                else if(this.state.gameReady){
                    if(this.timeoutId){
                        clearTimeout(this.timeoutId);
                    }
                }
                else
                    this.setState(() => ({ content }));
            })
            .catch(err => { throw err });
    }

    checkGameReady() {
        return fetch('/rooms/checkRoomFull', { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutIdGameStatusChecker = setTimeout(this.checkGameReady, 200);
                return response.json();
            })
            .then(status => {
                if(status.endGame){
                    if(this.timeoutIdGameStatusChecker) {
                        clearTimeout(this.timeoutIdGameStatusChecker);
                    }
                    this.setState(()=>({gameReady:true, Winner: status.Winner}));
                }
                else{
                    this.setState(() => ({ gameReady: status.gameReady }));
                    if (this.state.gameReady && this.timeoutIdGameStatusChecker) {
                        clearTimeout(this.timeoutIdGameStatusChecker);
                    }
                }   
            })
            .catch(err => { throw err });
    }

    createLogicGame() {
        return fetch('/gameManagement/createLogicGameToRoom', { method: 'POST', credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    this.setState({ gameLogicReady: true });
                    if (this.timeOutIdGameCreation)
                        clearTimeout(this.timeOutIdGameCreation);
                }
                else {
                    this.timeOutIdGameCreation = setTimeout(this.createLogicGame, 200);
                }
            });
    }
}