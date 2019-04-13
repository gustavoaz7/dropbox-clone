import React, { Component } from "react";
import "./styles.css";
import logo from "../../assets/logo.png";
import API from "../../services/API";

export default class Main extends Component {
  state = {
    input: ""
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await API.post("boxes", {
      title: this.state.input
    });
    this.props.history.push(`/box/${response.data._id}`);
  };

  handleInputChange = e => {
    this.setState({ input: e.target.value });
  };

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="" />
          <input
            placeholder="Trip 2019"
            value={this.state.input}
            onChange={this.handleInputChange}
          />
          <button type="submit">{"New box"}</button>
        </form>
      </div>
    );
  }
}
