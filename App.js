import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App() {
  let date = new Date();
  let month = ("0" + (1 + date.getMonth())).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  const gettitleToday = () => {
    return `${month}월 ${day}일`;
  };
  const [working, setWorking] = useState(true);
  const [complete, setComplete] = useState(true);
  const [edit, setEdit] = useState(false);
  const [editvalue, setEditValue] = useState("");
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };
  useEffect(() => {
    loadToDos();
  }, [working]);
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, complete, edit },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.prompt(
      "작성하신 내용을 지우시겠습니까?",
      "(지운 내용은 복구 할 수 없습니다)",
      [
        { text: "취소" },
        {
          text: "지우기",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]
    );
  };
  const completeToDo = (key) => {
    const newToDos = { ...toDos };
    setComplete((prev) => !prev);
    newToDos[key].complete = complete;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editToggle = (key) => {
    const newToDos = { ...toDos };
    setEdit((prev) => !prev);
    newToDos[key].edit = edit;
    console.log(newToDos[key].edit);
    //newToDos[key].edit =
  };
  console.log(toDos);
  return (
    <View style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.title}>JIPLAN</Text>
      </View>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Today Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Memo
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working
            ? `${gettitleToday()} 계획을 적어주세요`
            : "메모를 입력해주세요"
        }
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View
              style={toDos[key].complete ? styles.yestoDo : styles.nottoDo}
              key={key}
            >
              <View style={styles.textinput}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => editToggle(key)}>
                  <Fontisto name="arrow-down" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  {toDos[key].complete ? (
                    <Fontisto name="checkbox-passive" size={18} color="white" />
                  ) : (
                    <Fontisto name="checkbox-active" size={18} color="white" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
              {toDos[key].edit ? (
                <TextInput
                  style={styles.editinput}
                  onSubmitEditing={addToDo}
                  onChangeText={onChangeText}
                  returnKeyType="done"
                  value={editvalue}
                  placeholder="수정할 내용을 입력해주세요"
                />
              ) : null}
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 50,
    marginTop: 80,
  },
  titlebox: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 60,
  },
  btnText: {
    fontSize: 32,
    fontWeight: "600",
    color: "white",
  },
  textinput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  editinput: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  yestoDo: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "space-around",
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  nottoDo: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "space-around",
    opacity: 1,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
