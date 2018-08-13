const auth = require('./auth');
const rooms = require('./rooms');

function createLogicGameToRoom(req, res, next){
    var game  = undefined
    var userInfo = auth.getUserInfo(req.session.id);
    var userCell = rooms.getUsersInRoomCell(userInfo.name, userInfo.roomName)


    var roomCell = rooms.getRoomInfo(userInfo.roomName);
    var capacity = Object.assign(roomCell.capacity);
    var roomName = Object.assign(roomCell.roomName);
    var playerIndex = roomCell.usersInRoom.length -1;

    if(roomCell.LogicGame === undefined){
        game = new (require('./Game.js'))(capacity, roomName);
        game.init();
        roomCell.LogicGame = game;
    }
    isCyclic(roomCell.LogicGame);
    roomCell.LogicGame.insertPlayer(userInfo.name, playerIndex);
    isCyclic(roomCell.LogicGame);
  
	next();
}

function drawCards(req, res, next){
  var userInfo = auth.getUserInfo(req.session.id);
  if(userInfo){
  var roomCell = rooms.getRoomInfo(userInfo.roomName);

  if (roomCell.LogicGame.GetCardFromDeck()) {
    roomCell.LogicGame.nextTurnIncrement();

  } 
  else {
    //need  to send status 403 you can not draw cards when you have an option to put
  }
}

next();
}

function cardDecision(req, res, next){
  var cardIndex = req.body;

  var userInfo = auth.getUserInfo(req.session.id);
  var roomCell = rooms.getRoomInfo(userInfo.roomName);
  if(!roomCell.LogicGame.takiCardIsActive){
    roomCell.LogicGame.playerDecision(cardIndex);
  }
  else{
    roomCell.LogicGame.playerDecisionTakiCase(cardIndex)
  }

  next();
}
  
function ColorDecision(req, res, next){
  var colorDecision = req.body;
  var userInfo = auth.getUserInfo(req.session.id);
  var roomCell = rooms.getRoomInfo(userInfo.roomName);

  
  if(roomCell.LogicGame.showColorModal)
  {
    roomCell.LogicGame.selectColor(colorDecision);
  }
  else{
    // we need to send status a fattal error hapend, selected color when no need.
  }
  next();
}

function removeUserFromRoom(req, res, next){
  var userInfo = auth.getUserInfo(req.session.id);
  var roomCell = undefined;
  var found = false;
  var roomName = undefined;

  if (userInfo != undefined)
      roomName = userInfo.roomName;
  if (roomName != undefined) {
      roomCell = rooms.getRoomInfo(roomName);
      if (roomCell.LogicGame != undefined) {
          var index = 0;
          for (; index < roomCell.LogicGame.PlayersArr.length && !found; index++) {
              if (roomCell.LogicGame.PlayersArr[index].userName == userInfo.name) {
                  found = true;
                  roomCell.LogicGame.removePlayerFromArr(index);
                  roomCell.inRoom--;
                  roomCell.usersInRoom.splice(index, 1);
                  userInfo.roomName = undefined
              }
          }
      }
  }


  next();

}

function isCyclic (obj) {
    var seenObjects = [];
  
    function detect (obj) {
      if (obj && typeof obj === 'object') {
        if (seenObjects.indexOf(obj) !== -1) {
          return true;
        }
        seenObjects.push(obj);
        for (var key in obj) {
          if (obj.hasOwnProperty(key) && detect(obj[key])) {
            console.log(obj, 'cycle at ' + key);
            return true;
          }
        }
      }
      return false;
    }
  
    return detect(obj);
  }

module.exports = {createLogicGameToRoom,drawCards,cardDecision,ColorDecision,removeUserFromRoom,isCyclic}