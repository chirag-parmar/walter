/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { BleScreen } from "./src/screens/BleScreen.js"
import { WaterLevel } from "./src/components/WaterLevel.js"
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {

  return (
    <SafeAreaView style={styles.sectionContainer}>
        <WaterLevel 
          enabled={true}
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height}
          waterColor={Colors.lighter}
          waterLevel={0}
          range={[0.2, 0.95]}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: Colors.darker,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

export default App;
