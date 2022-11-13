import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView, 
} from "react-native";

export default function App() {
  const [serverState, setServerState] = React.useState("Loading...");
  const [messageText, setMessageText] = React.useState("");
  const [disableButton, setDisableButton] = React.useState(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true);
  const [serverMessages, setServerMessages] = React.useState([]);
  const inputText = () => {
    const [text, changeText] = React.useState("Enter IP Address: ");
    const [num, changeNum] = React.useState(null);
    
    return (
      <SafeAreaView>
        <TextInput
          style={styles.input}
          changeText={changeText}
          value={text}
          />
          <TextInput
            style={styles.input}
            changeText={changeNum}
            value={num}
            keyboardType="numeric"
          />
      </SafeAreaView>
    );
    }
    
  var ws = React.useRef(new WebSocket("ws://localhost:8000")).current;

  React.useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      setServerState("Connected to the server");
      setDisableButton(false);
    };
    ws.onclose = (e) => {
      setServerState("Disconnected. Check internet or server.");
      setDisableButton(true);
    };
    ws.onerror = (e) => {
      setServerState(e.message);
    };
    ws.onmessage = (e) => {
      serverMessagesList.push(e.data);
      setServerMessages([...serverMessagesList]);
    };
  }, []);
  const submitMessage = () => {
    ws.send(messageText);
    setMessageText("");
    setInputFieldEmpty(true);
  };
  return (
    <View style={styles.container}>
      <Text>{serverState}</Text>
      {serverMessages.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 30,
    padding: 8,
  },
});