import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { State, TapGestureHandler } from "react-native-gesture-handler";

const {
  event,
  block,
  Value,
  cond,
  eq,
  set,
  Clock,
  timing,
  startClock,
  clockRunning,
  stopClock,
  debug,
  lessThan
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

const myTry = () => {
  const opacity = new Value(1);
  const clock = new Clock();

  const handleStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(eq(state, State.END), [
            set(
              opacity,
              runTiming(clock, opacity, cond(lessThan(opacity, 1), 1, 0))
            )
          ])
        ])
    }
  ]);

  return (
    <View style={{ ...styles.container }}>
      <TapGestureHandler onHandlerStateChange={handleStateChange}>
        <Animated.View style={{ ...styles.touchableBox, opacity }} />
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  touchableBox: {
    height: 100,
    width: 100,
    backgroundColor: "orangered"
  }
});

export default myTry;
