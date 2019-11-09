import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { State, TapGestureHandler } from "react-native-gesture-handler";

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
  spring
} = Animated;

const MyPanTry = () => {
  const transDirectionUp = new Value(0);
  const transY = new Value(0);
  const clock = new Clock();

  const runTiming = (
    // eslint-disable-next-line no-shadow
    clock: Animated.Clock,
    val: Animated.Value<number>,
    dest: Animated.Node<number>
  ) => {
    const state = {
      position: new Value(0),
      time: new Value(0),
      finished: new Value(0),
      frameTime: new Value(0)
    };

    const config = {
      toValue: new Value(0),
      duration: 1000,
      easing: Easing.inOut(Easing.ease)
    };

    return block([
      cond(not(clockRunning(clock)), [
        set(state.position, val),
        set(config.toValue, dest),
        set(state.finished, 0),
        set(state.time, 0),
        set(state.frameTime, 0),
        cond(
          eq(transDirectionUp, 0),
          set(transDirectionUp, 1),
          set(transDirectionUp, 0)
        ),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, [stopClock(clock)]),
      state.position
    ]);
  };

  const runSpring = (
    // eslint-disable-next-line no-shadow
    clock: Animated.Clock,
    value: Animated.Value<number>,
    dest: Animated.Node<number>
  ) => {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      velocity: new Value(0),
      time: new Value(0)
    };
    const config = {
      stiffness: new Value(100),
      mass: new Value(1),
      damping: new Value(10),
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      toValue: new Value(0)
    };

    return block([
      cond(not(clockRunning(clock)), [
        set(state.finished, 0),
        set(state.position, value),
        set(state.velocity, 4),
        set(state.time, 0),
        set(config.toValue, dest),
        cond(
          eq(transDirectionUp, 0),
          set(transDirectionUp, 1),
          set(transDirectionUp, 0)
        ),
        startClock(clock)
      ]),
      spring(clock, state, config),
      cond(state.finished, [stopClock(clock)]),
      state.position
    ]);
  };

  const handleTap = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(eq(state, State.END), [
            set(
              transY,
              runSpring(
                clock,
                transY,
                cond(
                  eq(transDirectionUp, 0),
                  add(transY, 100),
                  sub(transY, 100)
                )
              )
            )
          ])
        ])
    }
  ]);

  return (
    <View style={styles.container}>
      <TapGestureHandler onHandlerStateChange={handleTap}>
        <Animated.View
          style={{ ...styles.box, transform: [{ translateY: transY }] }}
        />
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    backgroundColor: "red",
    height: 100,
    width: 100
  }
});

export default MyPanTry;
