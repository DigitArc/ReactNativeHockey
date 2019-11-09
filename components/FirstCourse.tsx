import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";

const {
  Value,
  useCode,
  block,
  Clock,
  cond,
  clockRunning,
  startClock,
  stopClock,
  not,
  interpolate,
  Extrapolate,
  set,
  eq,
  add
} = Animated;

export default function FirstCourse() {
  const [show, setShow] = useState(true);
  const { progress, time, clock } = useMemoOne(
    () => ({
      progress: new Value(0),
      time: new Value(0),
      clock: new Clock()
    }),
    []
  );
  const opacity = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: show ? [0, 1] : [1, 0],
    extrapolate: Extrapolate.CLAMP
  });

  useCode(
    block([
      cond(not(clockRunning(clock)), [startClock(clock), set(time, clock)]),
      set(
        progress,
        interpolate(clock, {
          inputRange: [time, add(time, 1000)],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP
        })
      ),
      cond(eq(progress, 1), stopClock(clock))
    ]),
    [show]
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          height: 100,
          width: 100,
          backgroundColor: "#408f94",
          opacity
        }}
      />
      <Button onPress={() => setShow(curr => !curr)} title="Toggle" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
