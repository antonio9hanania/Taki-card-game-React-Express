const express = require('express');
const auth = require('./auth');
const chatManagement = require('./chat');

const userManagement = express.Router();

userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id);
	res.json(userName);
});

userManagement.get('/allUsers', auth.userAuthentication, (req, res) => {
	const list = auth.getUserList();
	const userList  = Object.keys(list).map(key => list[key])

	res.json(userList);
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {		
	res.sendStatus(200);	
});

userManagement.post('/changeGameEnded', auth.changeGameEnded, (req, res) =>{
	res.sendStatus(200);	
});

userManagement.get('/logout', [
	(req, res, next) => {	
		const userinfo = auth.getUserInfo(req.session.id);	
		chatManagement.appendUserLogoutMessage(userinfo);
		next();
	}, 
	auth.removeUserFromAuthList, 
	(req, res) => {
		res.sendStatus(200);		
	}]
);


module.exports = userManagement;