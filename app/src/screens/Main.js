import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import API from "../services/API";
import logo from "../assets/logo.png";
import { KEY, MAIN_COLOR } from "../constants";

export default class Main extends Component {
  state = {
    input: ""
  };

  componentDidMount = async () => {
    const box = await AsyncStorage.getItem(KEY);
    if (box) {
      this.props.navigation.navigate("Box");
    }
  };

  handleSignIn = async () => {
    const response = await API.post("boxes", {
      title: this.state.input
    });
    await AsyncStorage.setItem(KEY, response.data._id);
    this.props.navigation.navigate("Box");
  };

  handleChangeText = text => {
    this.setState({ input: text });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput
          style={styles.input}
          placeholder="Trip 2019"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={this.state.input}
          onChangeText={this.handleChangeText}
        />
        <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>{"New box"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 30
  },
  logo: {
    alignSelf: "center"
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 30
  },
  button: {
    height: 44,
    borderRadius: 4,
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: MAIN_COLOR,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFF"
  }
});
