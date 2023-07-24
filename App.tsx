import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUp from './screens/SignUp';
import Verify from './screens/Verify';
import {RootScreens, RootStackParamList} from './types';
import store from './store';
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [initialRoute] = useState<RootScreens>(() => {
    return store.get(store.keys.USER) ? RootScreens.Verify : RootScreens.SignUp;
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name={RootScreens.SignUp}
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={RootScreens.Verify}
          component={Verify}
          options={{
            headerTitle: 'Verify Address',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
