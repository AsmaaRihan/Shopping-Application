import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../features/cartScreen/cartScreen';
import ProductDetails from '../features/productDetailsScreen/productDetails';
import CartButton from '../components/cartButton/cartButton';
import ScreenNames, { RootStackParamList } from './rootStackType';
import HomepageScreen from '../features/homepageScreen/homepage';
import i18n from '../i18n';
import ProductFilter from '../features/productFilterScreen/ProductFilter';

const CartHeaderButton = () => {
  return <CartButton />;
};
function RootStack() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenNames.Home}
          component={HomepageScreen}
          options={{
            title: i18n.t('home.title'),
            headerRight: CartHeaderButton,
          }}
        />
        <Stack.Screen
          name={ScreenNames.ProductsDetails}
          component={ProductDetails}
          options={{
            title: '',
            headerBackButtonDisplayMode: 'minimal',
            headerRight: CartHeaderButton,
          }}
        />
        <Stack.Screen name={ScreenNames.Cart} component={CartScreen} options={{ headerShown: false }} />
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
