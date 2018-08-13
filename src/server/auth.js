const userList = {};

function userAuthentication(req, res, next) {		
	if (userList[req.session.id] === undefined) {				
		res.sendStatus(401);		
	} else {		
		next();
	}
}

function addUserToAuthList(req, res, next) {	
	console.log("UserAdded");
	if (userList[req.session.id] !== undefined) {
		res.status(403).send('User already exist');
	} else {		
		for (sessionid in userList) {
			const name = userList[sessionid].name;
			if (name === req.body) {
				res.status(403).send('User name already exist');
				return;
			}
		}
		userList[req.session.id] = {name: req.body, roomName: undefined, gameEnded: false, Winner: undefined};
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('User does not exist');
	} else {						
		delete userList[req.session.id];
	}
	next();
}

function changeGameEnded(req, res, next){
	if(userList[req.session.id] != undefined){
		userList[req.session.id].gameEnded = false;
		userList[req.session.id].roomName = undefined;

	}
	next();
}

function getUserInfo(id) {	
    return userList[id];
}

function getUserList(){
	return userList;
}

function setUserRoom(id, roomName){
	userList[id].roomName = roomName;
}


module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, changeGameEnded, getUserList, setUserRoom}
