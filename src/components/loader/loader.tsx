import { ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const Loader = ({ size = 36 }) => {
  return (
    <ActivityIndicator testID="loader" color={Colors.primary} style={styles.loadingContainer} size={size} />
  );
};

export default Loader;

const styles = StyleSheet.create({ loadingContainer: { flex: 1 } });
