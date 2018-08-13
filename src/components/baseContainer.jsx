import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import ChatContaier from './chatContainer.jsx';
import PlayersList from './playersList.jsx';
import GameRooms from './GameRooms.jsx';
import CraeteRoomModal from './createRoomModal.jsx';
import Game_room_Logo from './resources/Game_room_Logo.png';
import online_users from './resources/online_users.png';
import create_game_button from './resources/create_game_button.png';
import join_game_button from './resources/join_game_button.png';
import GameManager from './gameManager.jsx';


export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            showLogin: true,
            showCreateRoomModal: false,
            showGameRoom: false,
            currentUser: {
                name: ''
            },
            inRoom: {
                name: ''
            },
            newVisitor: true,
            gameEnded:false,
        };

        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.handleRoomCreateError = this.handleRoomCreateError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.craeteRoomModalHandler = this.craeteRoomModalHandler.bind(this);
        this.renderCreateRoomModal = this.renderCreateRoomModal.bind(this);
        this.handleRoomCreationSucceed = this.handleRoomCreationSucceed.bind(this);
        this.handleRoomCreationRegret = this.handleRoomCreationRegret.bind(this);
        this.handleRoomEnterySucceed = this.handleRoomEnterySucceed.bind(this);
        this.setRoomName = this.setRoomName.bind(this);
        this.getUserName = this.getUserName.bind(this);
        this.handleRoomLeav = this.handleRoomLeav.bind(this);
        this.renderLobbyRoom = this.renderLobbyRoom.bind(this);
        this.getUserName();
    }

    render() {
        if (this.state.showLogin)
            return (<LoginModal loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError} />)
        else if (this.state.showCreateRoomModal)
            return this.renderCreateRoomModal();
        else if (this.state.showGameRoom)
            return this.renderGameRoom();
        else
            return this.renderLobbyRoom();
    }


    craeteRoomModalHandler() {
        this.setState({
            showLogin: this.state.showLogin,
            showCreateRoomModal: true,
            currentUser: {
                name: this.state.currentUser.name
            }
        });
    }


    setRoomName(roomName){
        this.state.inRoom.name = roomName;
    }

    handleRoomEnterySucceed(){
        this.setState(() => ({showLogin: false, showCreateRoomModal: false, showGameRoom: true}),this.getUserName);

    }
    handleRoomCreationSucceed() {
        this.setState(() => ({ showLogin: false, showCreateRoomModal: false }), this.getUserName);
    }

    handleRoomCreationRegret() {
        this.setState(() => ({ showLogin: false, showCreateRoomModal: false }), this.getUserName);
    }
    handleSuccessedLogin() {
        this.getUserName();
        this.setState(() => ({ showLogin: false, showCreateRoomModal: false }), this.getUserName);
    }
    handleRoomLeav(){
        this.setState(()=> ({newVisitor:true, showGameRoom: false, gameEnded:false}));
        this.getUserName();
    }
    handleLoginError() {
        alert("This username can't be use!");
        this.setState(() => ({ showLogin: true }));
    }

    handleRoomCreateError() {
        alert("This room name can't be use");
        this.setState(() => ({ showCreateRoomModal: true }));
    }

    renderLobbyRoom() {
        return (
            <div>
                <div id="head_of_everything">
                    <div className="user-info-area">
                        Hello {this.state.currentUser.name}
                        <button className="logout btn" onClick={this.logoutHandler}>Logout</button>
                        <button className="create_game btn" onClick={this.craeteRoomModalHandler}>create game</button>
                    </div>
                </div>
                <br/>


                <PlayersList />
                <img src={online_users} id="online_users" />
                <GameRooms setRoomName={this.setRoomName} handleRoomEnterySucceed={this.handleRoomEnterySucceed} currUserName={this.state.currentUser} />
                <div className="chat-base-container">
                    <ChatContaier />
                </div>
                <img src={Game_room_Logo} id="game_room_logo" />
            </div>
        )
    }

    renderGameRoom() {
        var roomName = undefined;
        if(this.state.inRoom == !undefined)
            roomName = (this.state.inRoom.name != undefined) ? this.state.inRoom.name: this.state.inRoom;
        return (
                <GameManager gameRoom={roomName} userName={this.state.currentUser.name} gameEnded={this.state.gameEnded} newVisitor={this.state.newVisitor} handleRoomLeave={this.handleRoomLeav} />
        )
    }

    renderCreateRoomModal() {
        return (
            <div>
                <div id="head_of_everything">
                    <div className="user-info-area">
                        Hello {this.state.currentUser.name}
                        <button className="logout btn" >Logout</button>
                        <button className="create_game btn" >create game</button>
                    </div>
                </div>
                <br/>
                <PlayersList />
                <img src={online_users} id="online_users" />
                <GameRooms setRoomName={this.setRoomName} handleRoomEnterySucceed={this.handleRoomEnterySucceed} currUserName={this.state.currentUser} />
                <div className="chat-base-container">
                    <ChatContaier />
                </div>
                <img src={Game_room_Logo} id="game_room_logo" />
                <CraeteRoomModal creationSucceed={this.handleRoomCreationSucceed} handleRegret={this.handleRoomCreationRegret} creationErrorHandler={this.handleRoomCreateError} />
            </div>
        );
    }

    getUserName() {
        this.fetchUserInfo()
            .then(userInfo => {
                if(userInfo.roomName === undefined && !userInfo.gameEnded){
                   this.setState(() => ({ currentUser: { name: userInfo.name }, showLogin: false, showGameRoom:false, gameEnded: false,inRoom: { name: "" } }));
                }
                else{
                    this.setState(() => ({ currentUser: { name: userInfo.name } , inRoom: userInfo.roomName, showLogin: false,showGameRoom: true, newVisitor: false, gameEnded: true}));
                }
            })
            .catch(err => {
                if (err.status === 401) { // incase we're getting 'unautorithed' as response
                    this.setState(() => ({ showLogin: true }));
                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    fetchUserInfo() {
        return fetch('/users', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    logoutHandler() {
        fetch('/users/logout', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    console.log(`Failed to logout user ${this.state.currentUser.name} `, response);
                }
                this.setState(() => ({ currentUser: { name: '' }, showLogin: true }));
            })
    }


}