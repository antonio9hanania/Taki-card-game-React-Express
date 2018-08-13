const express = require('express');
const rooms = require('./rooms');
const auth = require('./auth');

const bodyParser = require('body-parser');

const roomManagement = express.Router();
roomManagement.use(bodyParser.json());
roomManagement.use(bodyParser.urlencoded({ extended: true }));

//i think that insted to check user authentication we need to check the name if it is inside the list
roomManagement.get('/', auth.userAuthentication, (req, res) => { ///////////////////// not undarstand it

});

roomManagement.get('/allRooms', (req, res) => {
	const roomsList = rooms.getRoomList();
	res.json(roomsList);
});

roomManagement.get('/checkRoomFull', (req, res) => {
	var userInfo = auth.getUserInfo(req.session.id);

	if(rooms.checkRoomFull(req.session.id)){
		var roomCell = rooms.getRoomInfo(userInfo.roomName);
		if(roomCell.LogicGame === undefined){
			res.json({gameReady: false, endGame: false, Winner: undefined});	
		}
		else{
			res.json({gameReady: true, endGame: roomCell.LogicGame.roundOver, Winner:roomCell.LogicGame.Winner});	
		}
	}
	else{
		if(userInfo === undefined || !userInfo.endGame && userInfo.isWinner== undefined)
			res.json({gameReady: false, endGame: false, Winner: undefined});
		else	
			res.json({gameReady: false, endGame: true, Winner: userInfo.isWinner});
			
	}
});


roomManagement.post('/addRoom', rooms.addRoomToRoomList, (req, res) => {		
	res.sendStatus(200);	
});

roomManagement.post('/removeGame', rooms.removeGame, (req, res) => {		
	res.sendStatus(200);	
});

roomManagement.post('/addUserToRoom', rooms.addUserToRoom, (req, res) => {		
	res.sendStatus(200);	
});

roomManagement.post('/deleteRoom', rooms.deleteRoom, (req, res) => {		
	res.sendStatus(200);	
});



module.exports = roomManagement;