/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import notifee, { AndroidImportance } from '@notifee/react-native';
import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging'

type SectionProps = PropsWithChildren<{
  title: string;
}>;

let token: string
const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
    if (enabled) {
        token = (await messaging().getToken()).toString()
    } else {
        console.log('REQUEST PERMISSION DENIED')
    }
}
const getNewFCMToken = async () => {
    try {
        await requestUserPermission()
        console.log('Token:', token)
    } catch (error) {
        console.error('Error getting new FCM token:', error)
    }
}

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const createChannel = async () => {
    const channelId = 'sound'; // Ensure you use the same ID here

    // Check if the channel already exists
    const existingChannel = await notifee.getChannel(channelId);
    if(!existingChannel) {
    notifee.createChannel({
        id: 'sound',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
    })
}
}
  useEffect(() => {
    getNewFCMToken()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('recieved', remoteMessage)
    })
    createChannel()
    return unsubscribe
}, [])
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
