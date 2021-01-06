import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
import { Fontisto } from "@expo/vector-icons";

class TodayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      TodaysActivities: [],
      GoalProgressMins: 0,
      userActivityGoal: 0
    };
    this.getActivities = this.getActivities.bind(this);
    this.handleTodaysActivities = this.handleTodaysActivities.bind(this);
  }

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
            this.handleTodaysActivities(this.state.activities);
          }
        );
      });
  };

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener(
      "focus",
      (payload) => {
        console.log("in event listener");
        this.getActivities();
        this.getUserGoals();
      }
    );
  }

  componentWillUnmount() {
      this.props.navigation.removeListener("focus")
  }

  renderExercisesHelper(exercises) {
    return exercises.map(function(exercise, i){
        return(
            <View style = {styles.exercises} key = {i} accessible={true}>
            <Text accessible={false} style = {{fontWeight: "bold"}}>{exercise.name}</Text>
            <Text accessible={false}>Date: {exercise.date.substring(0,10)}</Text>
            <Text accessible={false}>Calories Burnt: {(exercise.calories)}</Text>
            <Text accessible={false}>Duration: {(exercise.duration)}</Text>
        </View>
        );
      });
      
  }

  handleTodaysActivities(activities) {
    var d = new Date();
    d = JSON.stringify(d);
    let today = [];
    if (activities.length > 0) {
      for (let i = 0; i < activities.length; i++) {
        console.log(activities[i].date.substring(0, 10));
        console.log(d.substring(1, 11));
        if (activities[i].date.substring(0, 10) === d.substring(1, 11)) {
          today.push(activities[i]);
        }
      }
    }
    this.setState(
      {
        TodaysActivities: today,
      },
      () => {
        console.log(this.state.TodaysActivities);
        this.getGoalProgress(this.state.TodaysActivities)
      }
    );
  }

  getUserGoals() {
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          userActivityGoal: res.goalDailyActivity
        });
      });
  }

  getGoalProgress(activities) {
    let mins = 0
    for (let i = 0; i<activities.length; i++) {
        mins = mins + activities[i].duration;
    }
    this.setState({GoalProgressMins: mins})
  }

  render() {
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
            <Fontisto
              name="day-cloudy"
              accessible={false}
              size={40}
              color="#900"
              style={{ marginRight: 20 }}
            />
            <Text accessible={false} style={styles.bigText}>Today</Text>
          </View>
          <View style={styles.space} />
          <View style={styles.exercises} accessible={true}>
            <Text accessible={false} style = {{fontWeight: "bold"}}>Goals Status</Text>
        <Text accessible={false}>{this.state.GoalProgressMins} / {this.state.userActivityGoal} Daily Activity</Text>
          </View>
          <View style={styles.space} />
          <View>
            {this.renderExercisesHelper(this.state.TodaysActivities)}
          </View>
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
    marginBottom: 5,
  },
  space: {
    width: 20,
    height: 20,
  },
  exercises: {
    borderWidth: 2,
    backgroundColor: "white",
    textAlign: 'center',
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft:10,
    paddingRight:10,
  }
});

export default TodayView;
