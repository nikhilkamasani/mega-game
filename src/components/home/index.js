import React, {Component} from "react";
import {connect} from "react-redux";
import Peer from 'peerjs';
import {setSizeLength} from "../../redux/actions";
import Game from "../game";

import "./home.scss";

class Home extends Component{

  state={
    key: true,
  }

  componentDidUpdate(prevProps) {
    const { size, length } = this.props;
    const { size: prevSize, length: prevLength} = prevProps;
    if( size !== prevSize || length !== prevLength){
      this.setState(prevState => ({key: !prevState.key}))
    }
  }

  onSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    const formData = new FormData(e.target);
    const size = Number(formData.get('size'));
    const length = Number(formData.get('length'));
    dispatch(setSizeLength(size, length))
  }

  submitCode = () => {
    const code = document.getElementById('code').value;
    const peer = new Peer({debug: 3 });
    peer.on('open', id => {
      const conn = peer.connect(code);
      conn.on('open', () => {
        conn.send({id});
      });
    });
  }

  render() {
    const { size, length} = this.props;
    return ( <div className="home-main">
        {(size && length) ? <Game/> : (
          <div>
          <form onSubmit={this.onSubmit} method="POST" className="form">
            <div>Create Game</div>
            <label htmlFor="size">Size of grid:</label>
            <input type="number" id="size" name="size" min="3"/>
            <label htmlFor="length">{`Length to win: (<= size)`}</label>
            <input type="number" id="length" name="length" min="3"/>
            <input type="submit"/>
          </form>
            <div>or</div>
            <label htmlFor="code">Enter code to join</label>
            <input type="text" id="code" name="code"/>
            <button onClick={() => this.submitCode()}>Join</button>
          </div>
        )}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  size: state.size,
  length: state.length
});

export default connect(mapStateToProps)(Home)