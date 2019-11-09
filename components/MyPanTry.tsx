import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {
  PanGestureHandler,
  State,
  TapGestureHandler
} from "react-native-gesture-handler";

const {
  timing,
  eq,
  neq,
  block,
  Value,
  cond,
  set,
  event,
  add,
  and,
  clockRunning,
  not,
  startClock,
  stopClock,
  Clock,
  debug,
  decay,
  call,
  sub,
  spring,
  diffClamp
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

const withOffset = (
  value: Animated.Value<number>,
  gestureState: Animated.Value<State>,
  velocity: Animated.Value<number>
) => {
  const offset = new Value(0);
  const clock = new Clock();
  const decayState = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    deceleration: 0.998
  };

  const isDecayInterrupted = and(
    eq(gestureState, State.BEGAN),
    clockRunning(clock)
  );
  const finishDecay = [set(offset, decayState.position), stopClock(clock)];

  return block([
    cond(isDecayInterrupted, finishDecay),
    cond(neq(gestureState, State.END), [
      set(decayState.finished, 0),
      set(decayState.position, add(offset, value))
    ]),
    cond(eq(gestureState, State.END), [
      cond(and(not(clockRunning(clock)), not(decayState.finished)), [
        set(decayState.velocity, velocity),
        set(decayState.time, 0),
        startClock(clock)
      ]),
      decay(clock, decayState, config),
      cond(decayState.finished, [
        set(offset, decayState.position),
        stopClock(clock)
      ])
    ]),
    decayState.position
  ]);
};

const MyPanTry = () => {
  const transDirectionUp = new Value(0);
  const transX = new Value(0);
  const transY = new Value(0);
  const velX = new Value(0);
  const velY = new Value(0);
  const gestureState = new Value(State.UNDETERMINED);

  const clock = new Clock();

  const handlePan = event([
    {
      nativeEvent: ({
        state,
        translationX,
        translationY,
        velocityX,
        velocityY
      }) =>
        block([
          set(transX, translationX),
          set(transY, translationY),
          set(velX, velocityX),
          set(velY, velocityY),
          set(gestureState, state)
        ])
    }
  ]);

  const withOffsetX = diffClamp(
    withOffset(transX, gestureState, velX),
    0,
    Dimensions.get("window").width - 140
  );
  const withOffsetY = diffClamp(
    withOffset(transY, gestureState, velY),
    0,
    Dimensions.get("window").height - 100
  );

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onHandlerStateChange={handlePan}
        onGestureEvent={handlePan}
      >
        <Animated.Image
          source={{ uri: "https://digitarc.net/images/digitarc-logo-icon.png" }}
          style={{
            ...styles.box,
            transform: [
              { translateY: withOffsetY },
              { translateX: withOffsetX }
            ]
          }}
        />
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    backgroundColor: "white",
    height: 100,
    width: 150
  }
});

export default MyPanTry;
