import React, { Component } from "react";


class Pile extends React.Component {
  constructor(props) {
    super(props);

      this.pileJsxToAppend = "";
      this.state = {
        realPileLength: this.props.pileLength,
        pile: [],
        colorfull: false,
        lastRotate: 0,
      };
    
  }

  componentDidMount() { }

  componentWillMount() {
    // need to send the front from game component
  }

  componentWillUnmount() {
    console.log("pile comp died");
  }

  render() { ///////////change Color 
    var rotation = Math.floor(Math.random() * -30) + 40;
    var rotateBefore = this.state.lastRotate;

    var pileFrontCompToPush = (<img key={this.state.pile.length} className="pileCards" style={{ transform: "rotate(" + String(rotation) + "deg)" }} src={require("./resources/" + String(this.props.pileFront) + ".png")} />);
    var pileFrontComp = (<img style={{ transform: 'rotate(' + String(rotation) + "deg)'" }} className="pileCards" src={require("./resources/" + String(this.props.pileFront) + ".png")} />);

    if (this.state.pile.length == 0) {
      pileFrontCompToPush = (<img key={this.state.pile.length} className="pileCards" style={{ transform: "rotate(" + String(0) + "deg)" }} src={require("./resources/" + String(this.props.pileFront) + ".png")} />);
      pileFrontComp = (<img style={{ transform: 'rotate(' + String(0) + "deg)'" }} className="pileCards" src={require("./resources/" + String(this.props.pileFront) + ".png")} />);
  
      this.state.lastRotate = rotation;
      if (this.props.pileFront == "change_colorful")
        this.state.colorfull = true;
      this.state.pile.push(pileFrontCompToPush);
      this.state.realPileLength = this.props.pileLength;
      return (pileFrontComp);
    }
    else {
      var temp = this.state.pile.slice();
      var splitedPF = this.props.pileFront.split("_");
      if (this.state.realPileLength != this.props.pileLength || (splitedPF[0] == "change" && splitedPF[1] != "colorful")) {

        if ((splitedPF[0] == "change" && splitedPF[1] != "colorful" && this.state.colorfull)) {
          this.state.colorfull = false;
          this.state.pile.pop();
          pileFrontCompToPush = (<img key={this.state.pile.length} className="pileCards" style={{ transform: "rotate(" + String(rotateBefore) + "deg)" }} src={require("./resources/" + String(this.props.pileFront) + ".png")} />);
          this.state.realPileLength = this.props.pileLength;
          this.state.lastRotate = rotation;
          if (this.props.pileFront == "change_colorful")
            this.state.colorfull = true;
          this.state.pile.push(pileFrontCompToPush);
        }
        if (this.state.realPileLength != this.props.pileLength) {
          this.state.realPileLength = this.props.pileLength;
          this.state.lastRotate = rotation;
          if (this.props.pileFront == "change_colorful")
            this.state.colorfull = true;
          this.state.pile.push(pileFrontCompToPush);
        }
      }
      return (
        <div className="pileCards">
          {temp}
        </div>

      );
    }
  }
}

export default Pile;
