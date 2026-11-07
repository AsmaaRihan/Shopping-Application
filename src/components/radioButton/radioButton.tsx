import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const RadioButtons = ({
  options,
  selectedOption,
  setSelectedOption,
}: {
  options: string[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          testID={`${option}_filter_button`}
          key={option}
          style={styles.option}
          onPress={() => setSelectedOption(option)}
        >
          <View style={styles.radio}>
            {selectedOption === option && <View style={styles.radioSelected} />}
          </View>

          <Text style={styles.label}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default RadioButtons;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  option: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textSecondary,
  },
  label: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
});
