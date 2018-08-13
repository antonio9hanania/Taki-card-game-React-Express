import React from 'react';
import ReactDOM from 'react-dom';

export default class GameRooms extends React.Component {
	constructor(args) {
		super(...args);
		this.state = {
			content: []
		}
		this.getRoomsListContent = this.getRoomsListContent.bind(this);
		this.getIntoRoom = this.getIntoRoom.bind(this);
		this.deleteRoomHandler = this.deleteRoomHandler.bind(this);
		this.renderElement = this.renderElement.bind(this);
	}


	componentDidMount() {
		this.getRoomsListContent();
	}
	componentWillUnmount() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}

	render() {
		return (
			<div id="gameRooms" className="list-type4">
				<ol>
					{
						this.state.content.map((room, index) => (this.renderElement(room, index)))
					}
				</ol>
			</div>
		);
	}

	renderElement(room, index){
		if(room.capacity == room.inRoom && room.creatorName != this.props.currUserName.name){
			return (<li  key={index}><a style={{ backgroundColor: 'red' }} roomname={room.roomName} > {room.roomName}, {room.inRoom}/{room.capacity}</a></li>);
		}
		else if(room.creatorName == this.props.currUserName.name ){
			if(room.capacity == room.inRoom){
				return (<div key={index} style={{background: "rgba(144, 144, 144, 0.5)"}}><li ><a style={{ backgroundColor: 'red' }} roomname={room.roomName} > {room.roomName}, {room.inRoom}/{room.capacity} </a></li> <button roomname={room.roomName} roomindex={index} className="delete btn" onClick={this.deleteRoomHandler}>delete</button> </div>);	
			}
			else{
				return (<div key={index} style={{background: "rgba(144, 144, 144, 0.5)"}}><li  onClick={this.getIntoRoom} style={{ cursor: 'pointer' }} ><a style={{ backgroundColor: 'green' }} roomname={room.roomName} > {room.roomName}, {room.inRoom}/{room.capacity} </a></li><button roomname={room.roomName} roomindex={index} className="delete btn" onClick={this.deleteRoomHandler}>delete</button></div>);	
			}
		}
		else{
			return (<li key={index} onClick={this.getIntoRoom} style={{ cursor: 'pointer' }}><a  style={{ backgroundColor: 'green' }} roomname={room.roomName} > {room.roomName}, {room.inRoom}/{room.capacity}</a></li>);
		}
	}

	deleteRoomHandler(e){
		e.preventDefault();
		var roomIndex = e.target.getAttribute("roomindex");
		if(this.state.content[roomIndex].inRoom > 0)
			alert("You cannot delete a room that contain users");
		else{
			fetch('/rooms/deleteRoom', { method: 'POST',body: roomIndex, credentials: 'include' })
			.then(response => {
				if (response.ok) {
					this.setState(() => ({ errMessage: "" }));
				} else {
					if (response.status === 403) {
						// this.setState(() => ({ errMessage: "User name already exist, please try another one" }));
					}
					// this.props.loginErrorHandler();
				}
		});
		}
	}
	getRoomsListContent() {
		return fetch('/rooms/allRooms', { method: 'GET', credentials: 'include' })
			.then((response) => {
				if (!response.ok && response.status != 401) {
					throw response;
				}
				this.timeoutId = setTimeout(this.getRoomsListContent, 200);
				return response.json();
			})
			.then(content => {
				this.setState(() => ({ content }));
			})
			.catch(err => { throw err });
	}


	getIntoRoom(e) {
		e.preventDefault();
		var roomName = e.target.getAttribute("roomname");

		fetch('/rooms/addUserToRoom', { method: 'POST',body: roomName, credentials: 'include' })
			.then(response => {
				if (response.ok) {
					this.setState(() => ({ errMessage: "" }));
					// this.props.loginSuccessHandler();
					this.props.setRoomName(roomName);
					this.props.handleRoomEnterySucceed();
					// this.props render to view game that will loading till capacity == in room 
				} else {
					if (response.status === 403) {
						// this.setState(() => ({ errMessage: "User name already exist, please try another one" }));
					}
					// this.props.loginErrorHandler();
				}
		});
	}

}