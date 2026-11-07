import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ErrorCard = ({
  refetch,
  errorText,
  buttonText,
}: {
  refetch: () => void;
  buttonText: string;
  errorText: string;
}) => {
  return (
    <View style={styles.center} testID="errorCard">
      <Text>{errorText}</Text>
      <TouchableOpacity testID="errorCardRetryButton" onPress={refetch}>
        <Text>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorCard;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
