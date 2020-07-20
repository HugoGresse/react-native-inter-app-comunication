/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    StatusBar, Linking,
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import base64 from 'react-native-base64';

import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { requireExtStoragePermissionIfNeeded } from './permissions';

const App: () => React$Node = () => {

    const [isDataReceivedOnStart, setDataReceivedOnStart] = useState(null);
    const [initialUrl, setInitialUrl] = useState(null);
    const [inputData, setInputData] = useState({
        requestId: null,
        protocol: null,
        method: null,
        data: null,
    });

    const onDeepLinkReceived = url => {
        const urlParts = url.split('/');
        // URL is composed of: [protocol]//[method]/[requestId]/[data]

        requireExtStoragePermissionIfNeeded()
            .then(granted => {
                if(granted) {
                    setInputData({
                        protocol: urlParts[0],
                        method: urlParts[2],
                        requestId: urlParts[3],
                        data: JSON.parse(base64.decode(urlParts[4])),
                    });
                } else {
                    console.log("Permission refused");
                }
            })
    };

    useEffect(() => {
        // Initial render
        Linking.getInitialURL().then(async url => {
            console.log('Initial url: ', url, initialUrl);
            if (url && url !== initialUrl) {
                await setInitialUrl(initialUrl);
                setDataReceivedOnStart(true);
                onDeepLinkReceived(url);
            }
        });

    }, []);

    useEffect(() => {
        const linkingListener = (event) => {
            if (event && event.url) {
                console.log('linkingListener triggered', event);
                setDataReceivedOnStart(false);
                onDeepLinkReceived(event.url);
            }
        };
        Linking.addEventListener('url', linkingListener);

        return () => {
            Linking.removeEventListener('url', linkingListener);
        };
    }, []);

    const sendIdentificationToClientApp = () => {
        const data = {
            results: [
                {
                    name: 'Apregagus sylfalodoré',
                    score: 0.8,
                    commonName: 'Syl',
                },
                {
                    name: 'Apgrgagus obelix',
                    score: 0.1,
                    commonName: 'Obélix',
                },
            ],
        };
        Linking.openURL('plantnet://identification-results/1/' + base64.encode(JSON.stringify(data)));
    };

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <View style={styles.body}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>OFFLINE</Text>
                            {isDataReceivedOnStart !== null &&
                            <Text>{isDataReceivedOnStart ? 'COLD (initial) start' : 'WARM (resume)'}</Text>}
                        </View>

                        <Pressable onPress={sendIdentificationToClientApp} style={styles.button}><Text>Send
                            identification results</Text></Pressable>

                        <Text style={styles.data}>
                            {JSON.stringify(inputData, 0, 4)}
                        </Text>

                        {inputData.data && <Image source={inputData.data.photos[0]} style={styles.previewImage}/>}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.white,
        backgroundColor: '#FF5555',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    button: {
        padding: 10,
        borderColor: '#FF0000',
        borderWidth: 1,
        borderRadius: 4,
    },
    data: {
        backgroundColor: '#EEE',
    },
    previewImage: {
        width: 300,
        height:300
    }
});

export default App;
