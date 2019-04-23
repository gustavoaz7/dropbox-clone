import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { distanceInWords } from "date-fns";
import ImagePicker from "react-native-image-picker";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import socket from "socket.io-client";
import { getBottomSpace, getStatusBarHeight } from "../helpers/iphonex";

import API, { baseURL } from "../services/API";
import { KEY, MAIN_COLOR } from "../constants";

export default class Box extends Component {
  state = {
    box: {}
  };

  componentDidMount = async () => {
    const box = await AsyncStorage.getItem(KEY);
    this.subscribeToNewFiles(box);
  };

  subscribeToNewFiles = box => {
    const io = socket(baseURL);
    io.emit("connectRoom", box);
    io.on("file", data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  openFile = async file => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });
      await FileViewer.open(filePath);
    } catch (e) {
      console.log("File not supported");
    }
  };

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log("ImagePicker error");
      } else if (upload.didCancel) {
        console.log("Canceled by user");
      } else {
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split(".");
        const ext = suffix.toLowerCase() === "heic" ? "jpg" : suffix;

        data.append("file", {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        });

        API.post(`boxes/${this.state.box._id}/files`, data);
      }
    });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF" />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>
        {`${distanceInWords(item.createdAt, new Date())} ago`}
      </Text>
    </TouchableOpacity>
  );

  renderItemSeparator = () => <View style={styles.separator} />;

  render() {
    const { box } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{box.title}</Text>
        <FlatList
          style={styles.list}
          data={box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={this.renderItemSeparator}
          renderItem={this.renderItem}
        />
        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
    flex: 1
  },
  boxTitle: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333"
  },
  list: {
    marginTop: 30
  },
  file: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE"
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center"
  },
  fileTitle: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10
  },
  fileDate: {
    fontSize: 14,
    color: "#666"
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30 + getBottomSpace(),
    width: 60,
    height: 60,
    backgroundColor: MAIN_COLOR,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});
