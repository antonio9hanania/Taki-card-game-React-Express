const auth = require('./auth');

const roomList = [];

function addRoomToRoomList(req, res, next) {
	var found = false;
	var bodyParse = JSON.parse(req.body);
	for (room in roomList) {
		const name = roomList[room].roomName;
		if (name === bodyParse.name) {
			found = true;
			res.status(403).send('Room name already exist');
		}
	}
	if (!found) {
		roomList.push({ roomName: bodyParse.name, capacity: bodyParse.capacity, inRoom: 0, usersInRoom: [], LogicGame: undefined, creatorName: auth.getUserInfo(req.session.id).name, usersLogoutCount: 0 });
		console.log("RoomAdded");
	}
	next();
}

function addUserToRoom(req, res, next) { //we need to check the capacity - room = 0
	const roomName = req.body;
	var found = false;
	for (room in roomList) {
		const name = roomList[room].roomName;
		if (name === roomName) {
			found = true;
			roomList[room].inRoom++;
			var userName = auth.getUserInfo(req.session.id).name;
			roomList[room].usersInRoom.push({ userName: userName, isTurn: false, data: undefined });
			auth.setUserRoom(req.session.id, name);
			if (roomList[room].usersInRoom.length === 1)
				roomList[room].usersInRoom[0].isTurn = true;
		}
	}
	if (!found) {
		res.status(403).send("room name doesn't exist");
	}
	next();
}

function removeGame(req, res, next) {
	var userInfo = auth.getUserInfo(req.session.id);
	var roomCell = undefined;
	var roomName = undefined;

	if (userInfo != undefined)
		roomName = userInfo.roomName;
	if (roomName != undefined) {
		roomCell = getRoomInfo(roomName);
		if (roomCell.LogicGame != undefined) {
			roomCell.usersLogoutCount++;
			userInfo.isWinner = (roomCell.LogicGame.Winner.userName == userInfo.name)? true: false;
			if (roomCell.usersLogoutCount == roomCell.inRoom) {

				roomCell.LogicGame.deleteAllAlocations();
				delete roomCell.LogicGame;
				for (var i = 0; i < roomList.length; i++) {
					if (roomList[i].roomName == roomName) {
						roomList.splice(i, 1);
						console.log("RoomDeleted");
					}
				}
			}
		}
		auth.getUserInfo(req.session.id).gameEnded = true;
	}

	next();
}
function deleteRoom(req, res, next) { 
	var roomIndex = req.body;
	var currentUser = auth.getUserInfo(req.session.id);

	if (roomList[roomIndex].creatorName == currentUser.name) {
		if (roomList[roomIndex].inRoom == 0) {
			if (roomList[roomIndex].LogicGame != undefined) {
				roomList[roomIndex].LogicGame.deleteAllAlocations();
				delete (roomList[roomIndex].LogicGame);
			}
			else {
				roomList.splice(roomIndex, 1);
			}
		}
	}


	next();
}

function checkRoomFull(id) {
	var userName = auth.getUserInfo(id);
	var roomName;
	var room;

	if (userName != undefined) {
		roomName = userName.roomName;
	}
	else {
		return false;
	}
	if (roomName != undefined) {
		room = getRoomInfo(roomName);
		if(room!= undefined){
			return (room.capacity === room.inRoom);
		}
		else
			return false;
	}
	else {
		return false;
	}
}

function getRoomInfo(name) {
	for (index in roomList) {
		if (roomList[index].roomName === name) {
			return roomList[index];
		}
	}
}


function getRoomList() {
	return roomList;
}

function getUsersInRoomCell(userName, roomName) {
	var usersInRoom = getRoomInfo(roomName).usersInRoom
	for (userCellIndex in usersInRoom) {
		if (usersInRoom[userCellIndex].userName === userName) {
			return usersInRoom[userCellIndex];
		}
	}
}


module.exports = { addRoomToRoomList, getRoomInfo, deleteRoom, removeGame, getRoomList, addUserToRoom, checkRoomFull, getUsersInRoomCell }