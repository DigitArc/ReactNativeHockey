import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useMemoOne } from "use-memo-one";

const {
  event,
  Value,
  eq,
  cond,
  block,
  call,
  set,
  add,
  Clock,
  clockRunning,
  startClock,
  stopClock,
  decay,
  debug,
  not,
  and,
  neq,
  timing
} = Animated;

const withOffset = (
  value: Animated.Value<number>,
  gestureState: Animated.Value<State>,
  velocity: Animated.Value<number>
) => {
  const offset = new Value(0);
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    deceleration: 0.997
  };

  // set(offset, add(offset, value)), offset

  return block([
    cond(neq(gestureState, State.END), [
      set(state.finished, 0),
      set(state.position, add(offset, value))
    ]),
    cond(
      eq(gestureState, State.END),
      [
        // set(offset, state.position), offset
        cond(
          and(not(clockRunning(clock)), not(state.finished)),
          [
            set(state.velocity, velocity),
            set(state.time, 0),
            startClock(clock)
          ],
          [
            decay(clock, state, config),
            cond(state.finished, [
              set(offset, state.position),
              stopClock(clock)
            ])
          ]
        )
      ],
      [state.position]
    )
  ]);
};

const ThirdCourse = () => {
  const currState = new Value<State>(State.UNDETERMINED);

  const transX = new Value(0);
  const transY = new Value(0);
  const velY = new Value(0);
  const velX = new Value(0);

  const handlePanEvent = event([
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
          set(currState, state)
        ])
    }
  ]);

  const translateX = withOffset(transX, currState, velX);
  const translateY = withOffset(transY, currState, velY);

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onHandlerStateChange={handlePanEvent}
        onGestureEvent={handlePanEvent}
      >
        <Animated.View
          style={{
            ...styles.box,
            transform: [{ translateX }, { translateY }]
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
    height: 100,
    width: 100,
    backgroundColor: "#408f94"
  }
});

export default ThirdCourse;
