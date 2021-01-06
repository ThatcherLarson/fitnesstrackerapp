import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
  Modal,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      modalVisible: false,
      newExerciseName: "",
      newExerciseDuration: 0,
      newExerciseCalsBurnt: 0,
      date: new Date(),
      mode: "date",
      show: false,
      editModalVisible: false,
      editExerciseName: "",
      editExerciseDuration: 0,
      editExerciseCalsBurnt: 0,
      editExerciseDate: "",
      id: 0,
    };
  }

  setEditModalVisible = (visible) => {
    this.setState({ editModalVisible: visible });
  };

  getActivities = () => {
    fetch("https://mysqlcs639.cs.wisc.edu/activities", {
      method: "GET",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState(
          {
            activities: res.activities,
          },
          () => {
            console.log(this.state.activities);
          }
        );
      });
  };

  componentDidMount() {
    this.getActivities();
  }

  handleAddExercise(newName, newDuration, newCals, newDate) {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/", {
      method: "POST",
      headers: {
        "x-access-token": this.props.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        duration: newDuration,
        calories: newCals,
        date: newDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Activity created!") {
          alert(JSON.stringify(res.message));
          this.getActivities();
        } else {
          alert(JSON.stringify(res.message));
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  handleEditExercise(newName, newDuration, newCals, newDate, id) {
    console.log("edit id " + id);
    fetch("https://mysqlcs639.cs.wisc.edu/activities/" + id, {
      method: "PUT",
      headers: {
        "x-access-token": this.props.accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        duration: newDuration,
        calories: newCals,
        date: newDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Activity updated!") {
          alert(JSON.stringify(res.message));
          this.getActivities();
        } else {
          alert(JSON.stringify(res.message));
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  handleDeleteExercise(activityID) {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/" + activityID, {
      method: "DELETE",
      headers: { "x-access-token": this.props.accessToken },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.getActivities();
      });
  }

  renderExercisesHelper(exercises) {
    const { show, date, mode } = this.state;
    return exercises.map((exercise, i) => {
      let exerciseID = exercise.id;
      return (
        <View style={styles.exercises} key={i} accessible={true}>
          <Text accessible={false} style={{ fontWeight: "bold" }}>{exercise.name}</Text>
          <Text accessible={false}>Date: {exercise.date.substring(0, 10)}</Text>
          <Text accessible={false}>Calories Burnt: {exercise.calories}</Text>
          <Text accessible={false}>Duration: {exercise.duration}</Text>

          <View accessible={false} style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <TouchableHighlight
              style={styles.openButton}
              accessible={false}
              onPress={() => {
                //this.setState({editModalData: exercise})
                this.setState({ editExerciseName: exercise.name });
                this.setState({ editExerciseDuration: exercise.duration });
                this.setState({ editExerciseCalsBurnt: exercise.calories });
                this.setState({ id: exercise.id });
                this.setState({ editExerciseDate: exercise.date });
                this.setEditModalVisible(true);
              }}
            >
              <Text style={styles.textStyle}>Edit</Text>
            </TouchableHighlight>
            <View style={styles.spaceHorizontal} />
            <Button
              accessible={false}
              color="#942a21"
              style={styles.buttonInline}
              title="Delete"
              onPress={() => this.handleDeleteExercise(exerciseID)}
            />
          </View>
        </View>
      );
    });
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === "ios" ? true : false,
      date,
    });
    console.log(this.state.date);
  };

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show("date");
  };

  timepicker = () => {
    this.show("time");
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
    const { editModalVisible } = this.state;
    const { show, date, mode } = this.state;
    return (
      <>
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{
            flexGrow: 11,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.space} />
          <View accessible={false} style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <FontAwesome5
              name="running"
              size={40}
              color="#900"
              style={{ marginRight: 20 }}
            />
            <Text style={styles.bigText}>Exercises</Text>
          </View>

          <View style={styles.space}></View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    textAlignVertical: "center",
                    fontWeight: "700",
                    fontSize: 20,
                  }}
                >
                  Exercise Details
                </Text>
                <View style={styles.spaceSmall}></View>
                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Exercise Name
                  </Text>
                </View>
                <TextInput
                  accessible={true}
                  accessibilityLabel="Exercise Name"
                  accessibilityHint="Set a name for your exercise"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Name"
                  placeholderTextColor="#d9bebd"
                  onChangeText={(exerciseName) =>
                    this.setState({ newExerciseName: exerciseName })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>

                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Duration
                  </Text>
                </View>
                <TextInput
                  accessible={true}
                  accessibilityLabel="Exercise Duration"
                  accessibilityHint="Set exercise duration"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Duration"
                  placeholderTextColor="#d9bebd"
                  onChangeText={(duration) =>
                    this.setState({ newExerciseDuration: duration })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>

                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Calories Burnt
                  </Text>
                </View>
                <TextInput
                  accessible={true}
                  accessibilityLabel="Exercise Calories Burnt"
                  accessibilityHint="Set number of calories burnt"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Calories Burnt"
                  placeholderTextColor="#d9bebd"
                  onChangeText={(calsBurnt) =>
                    this.setState({ newExerciseCalsBurnt: calsBurnt })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>
                <View style={styles.datetime}>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Set Date/Time
                  </Text>
                  <Text style={{ textAlignVertical: "center" }}>
                    {JSON.stringify(this.state.date).substring(1, 11)}{" "}
                    {JSON.stringify(this.state.date).substring(12, 20)}
                  </Text>
                </View>
                <View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Button
                      onPress={this.datepicker}
                      title="Set Date"
                      accessible={true}
                      accessibilityLabel="Set Date"
                      accessibilityHint="Set the day that this exercise takes place"
                      accessibilityRole="button"
                    />
                    <View style={styles.spaceHorizontal} />

                    <Button
                      onPress={this.timepicker}
                      title="Set Time"
                      accessible={true}
                      accessibilityLabel="Set Time"
                      accessibilityHint="Set the time of day that this exercise takes place"
                      accessibilityRole="button"
                    />
                  </View>
                  {show && (
                    <DateTimePicker
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={this.setDate}
                    />
                  )}
                </View>

                <View style={styles.spaceSmall}></View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: "#942a21",
                    }}
                    accessible={true}
                    accessibilityLabel="Add Exercise"
                    accessibilityHint="Adds exercise to list of exercises"
                    accessibilityRole="button"
                    onPress={() => {
                      this.handleAddExercise(
                        this.state.newExerciseName,
                        parseFloat(this.state.newExerciseDuration),
                        parseFloat(this.state.newExerciseCalsBurnt),
                        this.state.date
                      );
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Add</Text>
                  </TouchableHighlight>

                  <View style={styles.spaceHorizontal} />
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: "#942a21",
                    }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    textAlignVertical: "center",
                    fontWeight: "700",
                    fontSize: 20,
                  }}
                >
                  Exercise Details
                </Text>
                <View style={styles.spaceSmall}></View>
                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Exercise Name
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Enter name.."
                  value={this.state.editExerciseName}
                  placeholderTextColor="#d9bebd"
                  onChangeText={(exerciseName) =>
                    this.setState({ editExerciseName: exerciseName })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>

                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Duration
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Enter duration..."
                  value={this.state.editExerciseDuration + ""}
                  placeholderTextColor="#d9bebd"
                  onChangeText={(duration) =>
                    this.setState({ editExerciseDuration: duration })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>

                <View>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Calories Burnt
                  </Text>
                </View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Enter calories.."
                  value={this.state.editExerciseCalsBurnt + ""}
                  placeholderTextColor="#d9bebd"
                  onChangeText={(calsBurnt) =>
                    this.setState({ editExerciseCalsBurnt: calsBurnt })
                  }
                  autoCapitalize="none"
                />
                <View style={styles.spaceSmall}></View>
                <View style={styles.datetime}>
                  <Text
                    style={{ textAlignVertical: "center", fontWeight: "700" }}
                  >
                    Set Date/Time
                  </Text>
                  <Text style={{ textAlignVertical: "center" }}>
                    {JSON.stringify(this.state.date).substring(1, 11)}{" "}
                    {JSON.stringify(this.state.date).substring(12, 20)}
                  </Text>
                </View>
                <View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Button onPress={this.datepicker} title="Set Date" />
                    <View style={styles.spaceHorizontal} />

                    <Button onPress={this.timepicker} title="Set Time" />
                  </View>
                  {show && (
                    <DateTimePicker
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={this.setDate}
                    />
                  )}
                </View>
                <View style={styles.spaceSmall}></View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: "#942a21",
                    }}
                    onPress={() => {
                      this.handleEditExercise(
                        this.state.editExerciseName,
                        parseFloat(this.state.editExerciseDuration),
                        parseFloat(this.state.editExerciseCalsBurnt),
                        this.state.date,
                        this.state.id
                      );
                      this.setEditModalVisible(!editModalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Save</Text>
                  </TouchableHighlight>

                  <View style={styles.spaceHorizontal} />
                  <TouchableHighlight
                    style={{
                      ...styles.openButton,
                      backgroundColor: "#942a21",
                    }}
                    onPress={() => {
                      this.setEditModalVisible(!editModalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableHighlight
            style={styles.openButton}
            accessible={true}
            accessibilityLabel="Add"
            accessibilityHint="Create a new exercise"
            accessibilityRole="button"
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>Add Exercise</Text>
          </TouchableHighlight>
          <View style={styles.spaceSmall}></View>
          <View style={styles.spaceSmall}></View>
          <View>{this.renderExercisesHelper(this.state.activities)}</View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimensions.get("window").height,
  },
  mainContainer: {
    flex: 1,
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  exercises: {
    borderWidth: 2,
    backgroundColor: "white",
    textAlign: "center",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  buttonInline: {
    display: "flex",
  },
  spaceHorizontal: {
    display: "flex",
    width: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#942a21",
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  datetime: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "#c9392c",
    borderWidth: 1,
  },
});

export default ExercisesView;
