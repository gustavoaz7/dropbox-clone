import React, { Component } from "react";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import logo from "../../assets/logo.png";
import "./styles.css";
import API from "../../services/API";

export default class Box extends Component {
  state = {
    box: {}
  };

  componentDidMount = async () => {
    const box = this.props.match.params.id;
    const response = await API.get(`boxes/${box}`);
    this.setState({ box: response.data });
  };

  render() {
    const { box } = this.state;
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <ul>
          {box.files &&
            box.files.map(file => (
              <li>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#0070e0" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  {distanceInWords(file.createdAt, new Date()) + " ago"}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
