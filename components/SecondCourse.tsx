import React, { useRef, useState } from "react";
import { Button, ImageStyle, View, ViewStyle } from "react-native";
import {
  Transition,
  Transitioning,
  TransitioningView
} from "react-native-reanimated";

interface Layout {
  id: string;
  name: string;
  layout: {
    container: ViewStyle;
    child?: ImageStyle;
  };
}

const transition = (
  <Transition.Change interpolation="easeIn" durationMs={400} />
);

const SecondCourse = () => {
  const ref = useRef<TransitioningView>(null);
  const [nowLayout, setNowLayout] = useState(currentLayout);

  return (
    <>
      <Transitioning.View
        {...{ transition }}
        ref={ref}
        style={{ ...nowLayout.layout.container, flex: 1 }}
      >
        <View
          style={{
            backgroundColor: "red",
            height: 100,
            width: "30%",
            margin: 10
          }}
        />
        <View
          style={{
            backgroundColor: "red",
            height: 100,
            width: "30%",
            margin: 10
          }}
        />
        <View
          style={{
            backgroundColor: "red",
            height: 100,
            width: "30%",
            margin: 10
          }}
        />
      </Transitioning.View>
      <Button
        onPress={() => {
          if (ref.current) {
            ref.current.animateNextTransition();
          }
          setNowLayout(row);
        }}
        title="Change Row"
      />
      <Button
        onPress={() => {
          if (ref.current) {
            ref.current.animateNextTransition();
          }
          setNowLayout(column);
        }}
        title="Change Column"
      />
      <Button
        onPress={() => {
          if (ref.current) {
            ref.current.animateNextTransition();
          }
          setNowLayout(wrap);
        }}
        title="Change Wrap"
      />
    </>
  );
};

const column: Layout = {
  id: "column",
  name: "Column",
  layout: {
    container: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  }
};

const row: Layout = {
  id: "row",
  name: "Row",
  layout: {
    container: {
      flexDirection: "row",
      justifyContent: "center"
    }
  }
};

const wrap: Layout = {
  id: "wrap",
  name: "Wrap",
  layout: {
    container: {
      flexDirection: "row",
      flexWrap: "wrap"
    }
  }
};
const currentLayout = column;

export default SecondCourse;
