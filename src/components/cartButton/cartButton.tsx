import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import ScreenNames, { RootStackParamList } from '../../rootStack/rootStackType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CartButton = () => {
  const quantity = 1;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onPress = () => navigation.navigate(ScreenNames.Cart);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} testID="go_to_cart_button">
      <Text style={styles.cartIcon}>🛒</Text>

      {quantity > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{quantity > 99 ? '99+' : quantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 15,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: Colors.notification_red,
    minWidth: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartButton;
