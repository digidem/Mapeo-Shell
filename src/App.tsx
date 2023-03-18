import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { registerRootComponent } from "expo";
import { defineMessages } from "react-intl";

const m = defineMessages({
  firstMessage: {
    id: "app.firstMessage",
    defaultMessage: "This is a test",
    description: "Used as a tester",
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Start Here</Text>
      <StatusBar style="auto" />
    </View>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
