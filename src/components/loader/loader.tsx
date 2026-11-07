import { ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const Loader = () => {
  return (
    <ActivityIndicator
      testID="loader"
      color={Colors.primary}
      style={styles.loadingContainer}
      size="large"
    />
  );
};

export default Loader;

const styles = StyleSheet.create({ loadingContainer: { flex: 1 } });
