import React, {Component} from "react";
import {connect} from "react-redux";
import * as _ from "lodash";

import "./game.scss";
import Peer from "peerjs";

class Game extends Component{
  constructor(props) {
    super(props);
    this.state = {
      array: Array.from(Array(props.size), () => new Array(props.size)),
      presentTurn: 'X',
      XWins: 0,
      OWins: 0,
    }
  }

  componentDidMount() {
    const peer = new Peer({debug: 3 });
    peer.on('open', id => {
      console.log('My peer ID is: ' + id);

      peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          console.log(data);
        });
        conn.on('open', () => {
          conn.send({...this.props});
        });
      });
    });
  }

  handleCellClick = (i, j) => {
    const { array, presentTurn } = this.state;
    const { size } = this.props;
    const tempArray = [...array];
    tempArray[i][j] = presentTurn;
    if(this.checkForDraw(tempArray, size)){
      alert(`Game Drawn`)
      this.setState({
        array: Array.from(Array(size), () => new Array(size)),
        presentTurn: 'X',
      })
    } else if(this.checkIfPlayerWins(tempArray, i, j, presentTurn)){
      alert(`player ${presentTurn} wins!`)
      this.setState(prevState => ({
        array: Array.from(Array(size), () => new Array(size)),
        presentTurn: 'X',
        [`${presentTurn}Wins`]: prevState[`${presentTurn}Wins`] + 1,
      }))
    } else {
      this.setState({
        array: tempArray,
        presentTurn: presentTurn === 'X' ? 'O' : 'X'
      })
    }
  }

  checkForDraw = (array, size) => {
    let totalFilledCells = 0;
    array.forEach(a => {
      totalFilledCells = totalFilledCells + [...a].filter(exists => exists).length
    })
    return totalFilledCells === size * size;
  }

  checkIfPlayerWins = (array, i, j, char) => {
    const { size } = this.props;
    const horizontalArray = [...array[i]];
    const verticalArray = array.map(list => list[j]);
    const diagonalArray = [];
    const antiDiagonalArray = [];
    const min = Math.min(i, j); // min of i,j
    if(i >= j){
      let a = i - min
      let b = 0
      for(a; a < size; a++, b++){
        diagonalArray.push(array[a][b])
      }
    } else {
      let a = 0
      let b = j - min
      for (b; b < size; b++, a++){
        diagonalArray.push(array[a][b])
      }
    }

    for(let m = 0; m <= i +j; m++){
      if(m < size && (i + j - m) >= 0 && (i + j - m) < size){
        antiDiagonalArray.push(array[m][i + j -m])
      }
    }

    return (this.checkIfWins(horizontalArray, char) || this.checkIfWins(verticalArray, char)
      || this.checkIfWins(diagonalArray, char) || this.checkIfWins(antiDiagonalArray, char))
  }

  checkIfWins = (array, char) => {
    const { length } = this.props;
    let count = 0;
    let match = false
    array.every(a => {
      if(a === char){
        count = count + 1;
        if(count === length){
          match = true;
          return false;
        }
      } else {
        count = 0;
      }
      return true
    })
    return match;
  }

  render() {
    const { size, length } = this.props;
    const { array, presentTurn, XWins, OWins } = this.state;
    return ( <div className="game-main">
          <div className="turn-heading">Current Turn: {presentTurn}</div>
          <div className="turn-heading">X - {XWins} Wins, O - {OWins} Wins</div>
          <div className="reset-button" onClick={() => window.location.reload()}>Reset</div>
          <div className="helper-text">first player to get {length} of her marks in a row wins!</div>
          <div className="game-grid">
            {_.times(size, (i) => (
              <div
                className="grid-row"
                key={i}
              >
                {_.times(size, (j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`grid-item ${(array[i] && array[i][j]) ? 'not-allowed' : 'pointer'}`}
                    onClick={() => ((array[i] && array[i][j]) ? null : this.handleCellClick(i,j))}
                  >
                    {(array[i] && array[i][j]) || ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  size: state.size,
  length: state.length
});

export default connect(mapStateToProps)(Game)