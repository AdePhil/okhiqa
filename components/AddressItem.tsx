/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OkHiLocation} from 'react-native-okhi';

type Props = {
  location: OkHiLocation;
  index: number;
  length: number;
  handleClick: (location: OkHiLocation) => void;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
  },
});

const AddressItem = ({location, index, length, handleClick}: Props) => {
  return (
    <TouchableOpacity onPress={() => handleClick(location)}>
      <View
        style={[
          {borderBottomWidth: index === length - 1 ? 1 : 0},
          styles.container,
        ]}>
        <Text>
          {location.displayTitle}, {location.state}, {location.country}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddressItem;
