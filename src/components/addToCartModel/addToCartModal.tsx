import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenNames, { type RootStackParamList } from '../../rootStack/rootStackType';
import { useTranslation } from 'react-i18next';

const AddToCartModal = ({ toggleModal, isVisible }: { isVisible: boolean; toggleModal: () => void }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>{t('cartModal.title')}</Text>
          <Text style={styles.dialogText}>{t('cartModal.message')}</Text>

          <TouchableOpacity
            style={styles.checkoutButton}
            testID="view_cart_button"
            onPress={() => {
              navigation.replace(ScreenNames.Cart);

              toggleModal();
            }}
          >
            <Text style={styles.checkoutButtonText}>{t('cartModal.viewCart')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="continue_shopping_button"
            style={styles.resumeButton}
            onPress={toggleModal}
          >
            <Text style={styles.resumeButtonText}>{t('cartModal.continueShopping')}</Text>
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
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
  },
  dialogTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  dialogText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
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
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
