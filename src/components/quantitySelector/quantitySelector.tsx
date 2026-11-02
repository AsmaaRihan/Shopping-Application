import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

interface Props {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, max, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={quantity <= 1}
        onPress={() => onChange(quantity - 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity
        disabled={quantity >= max}
        onPress={() => onChange(quantity + 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingBottom: 20,
  },
  button: {
    width: 38,
    height: 38,
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 22,
  },
  quantity: {
    fontSize: 17,
    fontWeight: '600',
  },
});
