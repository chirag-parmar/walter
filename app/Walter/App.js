/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WalterBle } from "./src/components/WalterBleComponent.js"
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {

  return (
    <SafeAreaView style={styles.sectionContainer}>
        <WalterBle />
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
