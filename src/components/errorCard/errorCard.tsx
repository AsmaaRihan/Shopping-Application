import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/colors';

const ErrorCard = ({
  refetch,
  title,
  description,
}: {
  refetch: () => void;
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.container} testID="errorCard">
      <Image
        source={require('../../assets/images/error.png')}
        style={styles.errorImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity testID="errorCardRetryButton" style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  errorImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  retryButton: {
    margin: 5,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  retryButtonText: {
    color: Colors.textTeritary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
