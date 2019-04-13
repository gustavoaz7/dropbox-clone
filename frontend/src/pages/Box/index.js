import React, { Component } from "react";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";
import logo from "../../assets/logo.png";
import "./styles.css";
import API, { baseURL } from "../../services/API";

export default class Box extends Component {
  state = {
    box: {}
  };

  componentDidMount = async () => {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const response = await API.get(`boxes/${box}`);
    this.setState({ box: response.data });
  };

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket(baseURL);
    io.emit("connectRoom", box);

    io.on("file", data => {
      console.log("data", data);
      this.setState({
        box: {
          ...this.state.box,
          files: [...this.state.box.files, data]
        }
      });
    });
  };

  handleUpload = files => {
    const box = this.props.match.params.id;
    files.forEach(file => {
      const data = new FormData();
      data.append("file", file);

      API.post(`boxes/${box}/files`, data);
    });
  };

  render() {
    const { box } = this.state;
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>{"Drop files or click here"}</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {box.files &&
            box.files.map(file => (
              <li key={file._id}>
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
