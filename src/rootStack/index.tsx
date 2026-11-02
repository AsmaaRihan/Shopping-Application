import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenNames, { RootStackParamList } from './rootStackType';
import ProductFilter from '../features/productFilterScreen/productFilter';
import HomepageScreen from '../features/homepageScreen/homepage';
import CartScreen from '../features/cartScreen/cartScreen';
import ProductDetails from '../features/productDetailsScreen/productDetails';

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
        <Stack.Screen
          name={ScreenNames.ProductsDetails}
          component={ProductDetails}
        />
        <Stack.Screen
          name={ScreenNames.Cart}
          component={CartScreen}
          options={{ title: 'Homepage' }}
        />
        <Stack.Screen
          name={ScreenNames.ProductsFilter}
          component={ProductFilter}
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
