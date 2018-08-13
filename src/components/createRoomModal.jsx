import React from 'react';
import ReactDOM from 'react-dom';
export default class CraeteRoomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errMessage: "",

    };
    this.handleCreation = this.handleCreation.bind(this);

  }

  render() {
      return (
        <div id="Modal">
          <form onSubmit={this.handleCreation}>
            <label className="gamename-label" htmlFor="gamename"> Room Name: </label>
            <input className="gamename-input" name="gamename" />

            <div className="container">
              <ul className="nobull">
                <li className="list__item">
                  <input type="radio" className="radio-btn" name="choice" id="a-opt" />
                  <label htmlFor="a-opt" className="label">2 players</label>
                </li>

                <li className="list__item">
                  <input type="radio" className="radio-btn" name="choice" id="b-opt" />
                  <label htmlFor="b-opt" className="label">3 players</label>
                </li>

                <li className="list__item">
                  <input type="radio" className="radio-btn" name="choice" id="c-opt" />
                  <label htmlFor="c-opt" className="label">4 players</label>
                </li>
              </ul>
            </div>

            <input className="submit-btn btn" type="submit" value="Create-room" />
            <button className="Cancel-btn btn" onClick={this.props.handleRegret}>Cancel</button>
          </form>
        </div>
      );
  }

  handleCreation(e) {
    let playerNumberSelected = false;
    let gameRoomValid = false;
    var roomName = "";
    var roomNumOfPlayers = 0;
    e.preventDefault();
    const formSelections = e.target.elements;
    if (formSelections.gamename.value !== "") {
      roomName = formSelections.gamename.value;
      gameRoomValid = true;
    }
    else{
      alert("Can't create empty name room!");
    }
    if (formSelections.choice[0].checked) {
      playerNumberSelected = true;
      roomNumOfPlayers = 2;
    }
    else if (formSelections.choice[1].checked) {
      playerNumberSelected = true;
      roomNumOfPlayers = 3;
    }
    else if (formSelections.choice[2].checked) {
      playerNumberSelected = true;
      roomNumOfPlayers = 4;
    }
    else{
      alert('Have to select number of players!');
    }

    if (playerNumberSelected && gameRoomValid) {

      fetch('/rooms/addRoom', { method: 'POST', 
        body: JSON.stringify({
        name: roomName,
        capacity: roomNumOfPlayers
      }) ,
       credentials: 'include' })

        .then(response => {
          if (response.ok) {
            this.setState(() => ({ errMessage: "" }));
            this.props.creationSucceed();
          } else {
            if (response.status === 403) {
              this.setState(() => ({ errMessage: "Room name already exist, please try another name" }));
            }
            this.props.creationErrorHandler();
          }
        });
    }
  }
}