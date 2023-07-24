/* eslint-disable react-native/no-inline-styles */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  OkHiLocationManager,
  OkCollectSuccessResponse,
  request,
  OkHiUser,
  OkHiLocation,
  stopVerification,
  isForegroundServiceRunning,
  startForegroundService,
  stopForegroundService,
  onNewToken,
} from 'react-native-okhi';
import store from '../store';
import AddressItem from '../components/AddressItem';
import useLocations from '../hooks/useLocation';

const theme = {
  colors: {primary: 'rgb(1, 22, 39)'},
  appBar: {
    backgroundColor: 'rgb(1, 22, 39)',
  },
};

const Verify = () => {
  const [launch, setLaunch] = useState(false);
  const user = store.get(store.keys.USER) as OkHiUser | null;
  const {locations, addLocation, removeLocation} = useLocations();
  const [foregroundEnable, setForeGroundEnabled] = useState<boolean>(false);
  const isAndroid = Platform.OS === 'android';

  const onAddressClick = (location: OkHiLocation) => {
    Alert.alert(
      `Stop Verification \n ${location.displayTitle}`,
      'Are you sure you want to stop verification?',
      [
        {
          text: 'Stop',
          onPress: async () => {
            const id = await stopVerification(user!.phone, location.id!);
            removeLocation(location.id!);
            console.log('stopped verification', {id});
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleOnSuccess = async (response: OkCollectSuccessResponse) => {
    try {
      const id = await response.startVerification();
      store.set(store.keys.USER, response.user);
      addLocation(response.location);
      console.log(`started verification for: ${id}`);
      setLaunch(false);
    } catch (error) {
      console.log("Can't start verification: ", error);
    }
  };

  const requestPermission = useCallback(async () => {
    request('always', null, async (status, error) => {
      if (status === 'authorizedAlways') {
        console.log('Permission Given', status);
        setLaunch(true);
      } else if (error) {
        console.log(error);
      }
    });
  }, []);

  const handleForeGroundUpdate = async (state: boolean) => {
    setForeGroundEnabled(state);
    try {
      if (state) {
        await startForegroundService();
        console.log('Foreground running...');
      } else {
        await stopForegroundService();
        console.log('Foreground not running...');
      }
    } catch (error) {
      console.log('Error toggling foreground', error);
    }
  };

  useEffect(() => {
    const checkForeGroundRunning = async () => {
      const isRunning = await isForegroundServiceRunning();
      setForeGroundEnabled(isRunning);
      return isRunning;
    };
    if (isAndroid) {
      checkForeGroundRunning();
    }
  }, [isAndroid]);

  useEffect(() => {
    // @ts-ignore
    let subscriber;
    const refetchToken = async () => {
      if (isAndroid) {
        const messaging = require('@react-native-firebase/messaging').default;
        subscriber = messaging().onTokenRefresh((token: string) => {
          onNewToken(token);
        });
      }
    };

    refetchToken();

    return () => {
      // @ts-ignore
      return subscriber?.();
    };
  }, [isAndroid]);

  return (
    <View style={styles.container}>
      {!locations.length ? (
        <View style={styles.emptyState}>
          <Text>You have no addresses being verified</Text>
        </View>
      ) : (
        <View>
          {isAndroid && (
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{false: '#e5e7eb', true: '#e5e7eb'}}
                thumbColor={foregroundEnable ? 'rgb(1, 22, 39)' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => handleForeGroundUpdate(value)}
                value={foregroundEnable}
              />
              <TouchableOpacity
                onPress={() => handleForeGroundUpdate(!foregroundEnable)}>
                <Text>Foreground Services</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={locations}
            renderItem={({item, index}) => (
              <AddressItem
                key={item.id!}
                location={item}
                index={index}
                length={locations.length}
                handleClick={onAddressClick}
              />
            )}
            keyExtractor={item => item.id!}
          />
        </View>
      )}

      <OkHiLocationManager
        launch={launch}
        user={user as OkHiUser}
        onCloseRequest={() => setLaunch(false)}
        onError={console.log}
        onSuccess={handleOnSuccess}
        theme={theme}
        config={{streetView: true}}
      />
      <View
        style={{
          padding: 20,
          marginBottom: 40,
        }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => requestPermission()}>
          <Text style={styles.buttonText}>Verify an Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    padding: 20,
    marginBottom: 40,
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  switchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(1, 22, 39)',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
  },
});

export default Verify;
