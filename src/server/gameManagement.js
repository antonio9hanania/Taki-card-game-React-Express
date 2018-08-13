const express = require('express');
const auth = require('./auth');
const rooms = require('./rooms');
const gameManagementUtiles = require('./gameManagementUtiles');
const gameManagement = express.Router();

gameManagement.get('/getCurrentLogicGame', (req, res) => {
    var userInfo = auth.getUserInfo(req.session.id);
    var roomName = undefined;
    if (userInfo != undefined)
        roomName = userInfo.roomName;
    var roomCell = undefined;
    if (roomName != undefined) {
        roomCell = rooms.getRoomInfo(roomName);
        if (roomCell != undefined) {
            if (roomCell.LogicGame != undefined) {


                if (!gameManagementUtiles.isCyclic(roomCell))
                    res.json({ LogicGame: roomCell.LogicGame, Stats: roomCell.LogicGame.getStats() });
            }
        }
        else
            res.status(401).send("This room has'nt allocated yet");
    }
    else {
        res.status(403).send("User is not belong to this room yet");
    }
});

/*gameManagement.get('/getStats', (req, res) => {
    var userInfo = auth.getUserInfo(req.session.id);
    var roomCell = undefined;
    var found = false;
    var roomName = undefined;
    if (userInfo != undefined)
        roomName = userInfo.roomName;
    if (roomName != undefined) {
        roomCell = rooms.getRoomInfo(roomName);
        if (roomCell.LogicGame != undefined) {
            var stats = roomCell.LogicGame.getStats();
            if (stats) {
                res.json(stats);
            }
            else {
                res.status(401).send("stats still undefined");
            }
        }
        else {
            res.status(401).send("This room has'nt allocated yet");
        }
    }
    else {
        res.status(403).send("User is not belong to this room yet");

    }
});*/

gameManagement.get('/getCurrentPlayerIndex', (req, res) => {
    var userInfo = auth.getUserInfo(req.session.id);
    var roomCell = undefined;
    var found = false;
    var roomName = undefined;

    if (userInfo != undefined)
        roomName = userInfo.roomName;
    if (roomName != undefined) {
        roomCell = rooms.getRoomInfo(roomName);
        if (roomCell != undefined) {
            if (roomCell.LogicGame != undefined) {
                var index = 0;
                for (; index < roomCell.LogicGame.PlayersArr.length && !found; index++) {
                    if (roomCell.LogicGame.PlayersArr[index].userName == userInfo.name) {
                        found = true;
                        res.json(index);
                    }
                }
            }
        }
        else
            res.status(401).send("This room has'nt allocated yet");
    }
    else {
        res.status(403).send("User is not belong to this room yet");
    }
});



gameManagement.post('/createLogicGameToRoom', gameManagementUtiles.createLogicGameToRoom, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post('/removeUserFromRoom', gameManagementUtiles.removeUserFromRoom, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post('/drawCards', gameManagementUtiles.drawCards, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post('/cardDecision', gameManagementUtiles.cardDecision, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post('/ColorDecision', gameManagementUtiles.ColorDecision, (req, res) => {
    res.sendStatus(200);
});



module.exports = gameManagement;