import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootScreens, RootStackScreenProps} from '../types';
import store, {STORAGE_KEYS} from '../store';
import {OkHiUser} from 'react-native-okhi';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgb(1, 22, 39)',
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    color: '#f1f5f9',
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
  },
  label: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#fff',
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 1,
  },
});
const initialState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

type Props = RootStackScreenProps<RootScreens.SignUp>;

const SignUp = ({navigation}: Props) => {
  const [form, setForm] = useState<OkHiUser>(initialState);
  const handleChange = (
    {nativeEvent: {text}}: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string,
  ) => {
    setForm({...form, [name]: text});
  };

  const saveUser = async () => {
    let token = null;
    if (Platform.OS === 'android') {
      const messaging = require('@react-native-firebase/messaging').default;
      token = await messaging().getToken();
    }
    const user = {
      ...form,
      ...(token && {fcmPushNotificationToken: token}),
    };
    store.set(STORAGE_KEYS.USER, user);
    navigation.navigate(RootScreens.Verify);
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            onChange={e => handleChange(e, 'firstName')}
            value={form.firstName}
            placeholder="John"
            placeholderTextColor="#737373"
            cursorColor="#f1f5f9"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChange={e => handleChange(e, 'lastName')}
            value={form.lastName}
            placeholder="Doe"
            placeholderTextColor="#737373"
            cursorColor="#f1f5f9"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            onChange={e => handleChange(e, 'phone')}
            id="firstName"
            value={form.phone}
            placeholder="+44 839309034839"
            placeholderTextColor="#737373"
            cursorColor="#f1f5f9"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            onChange={e => handleChange(e, 'email')}
            id="firstName"
            value={form.email}
            placeholder="johndoe@gmail.com"
            placeholderTextColor="#737373"
            cursorColor="#f1f5f9"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveUser}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SignUp;
