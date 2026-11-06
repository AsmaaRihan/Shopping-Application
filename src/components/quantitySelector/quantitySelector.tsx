import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, min = 1, max, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={quantity <= min}
        onPress={() => onChange(quantity - 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity
        disabled={max !== undefined && quantity >= max}
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
    marginVertical: 10,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0F0F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#222',
  },
  quantity: {
    marginHorizontal: 13,
    fontWeight: '600',
  },
});
