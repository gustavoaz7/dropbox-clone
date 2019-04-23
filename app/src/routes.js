import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Main from "./screens/Main";
import Box from "./screens/Box";

const Routes = createAppContainer(
  createSwitchNavigator({
    Main,
    Box
  })
);

export default Routes;
