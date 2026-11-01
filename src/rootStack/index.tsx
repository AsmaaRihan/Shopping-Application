import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomepageScreen from '../features/homepageScreen/homepage';
import ScreenNames, { RootStackParamList } from './rootStackType';

function RootStack() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenNames.Home}
          component={HomepageScreen}
          options={{ title: 'Homepage' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
