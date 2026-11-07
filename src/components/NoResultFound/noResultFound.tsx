import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resetFilter } from '../../service/slice/productSlice/productsSlice';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../store/store';
import { useTranslation } from 'react-i18next';
import Colors from '../../theme/colors';

const NoResultFound = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const onResetFilter = () => dispatch(resetFilter());

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>

      <Text style={styles.emptyTitle}>{t('noResults.title')}</Text>

      <Text style={styles.emptyDescription}>{t('noResults.description')}</Text>

      <TouchableOpacity testID="reset-filter-button" style={styles.resetButton} onPress={onResetFilter}>
        <Text style={styles.resetButtonText}>{t('noResults.reset')}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default NoResultFound;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  resetButton: {
    backgroundColor: Colors.black,
    borderRadius: 10,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 13,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: Colors.textTeritary,
    fontSize: 14,
    fontWeight: '700',
  },
});
