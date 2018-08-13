import React, { Component } from "react";

export default class ColorModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {}

  componentWillMount() {
  }

  handleClick(i_colorClicked){
    this.props.handleColorModalShow(false);
    this.props.handleColorDicision(i_colorClicked);
  }
  render() {
      if(this.props.showColorModal){
      return (
        <div id="pickColorModal">
          <button
            id="green"
            className="changeColorBottons"
            onClick={() => {
              this.handleClick("green")
            }}
            style={{ background: "green" }}
          >
            
          </button>
          <button
            id="red"
            className="changeColorBottons"
            onClick={() => {
              this.handleClick("red")
            }}
            style={{ background: "red" }}
          >
            
          </button>
          <button
            id="yellow"
            className="changeColorBottons"
            onClick={() => {
              this.handleClick("yellow");
            }}
            style={{ background: "yellow" }}
          >
            
          </button>
          <button
            id="blue"
            className="changeColorBottons"
            onClick={() => {
              this.handleClick("blue");
            }}
            style={{ background: "blue" }}
          >
            
          </button>
        </div>
      );
    }
    else{
      return ("");
    }
  }
}
