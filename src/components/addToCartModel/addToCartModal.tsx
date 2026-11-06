import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenNames, { type RootStackParamList } from '../../rootStack/rootStackType';

const AddToCartModal = ({ toggleModal, isVisible }: { isVisible: boolean; toggleModal: () => void }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>Added to cart</Text>
          <Text style={styles.dialogText}>Would you like to resume shopping or continue to checkout?</Text>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              navigation.replace(ScreenNames.Cart);

              toggleModal();
            }}
          >
            <Text style={styles.checkoutButtonText}>View Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resumeButton} onPress={toggleModal}>
            <Text style={styles.resumeButtonText}>Continue shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddToCartModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  dialogTitle: {
    color: '#222',
    fontSize: 20,
    fontWeight: '700',
  },
  dialogText: {
    color: '#666',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: Colors.black,
    borderRadius: 10,
    marginTop: 22,
    padding: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.textTeritary,
    fontWeight: '700',
  },
  resumeButton: {
    alignItems: 'center',
    padding: 14,
  },
  resumeButtonText: {
    color: '#555',
    fontWeight: '600',
  },
});
