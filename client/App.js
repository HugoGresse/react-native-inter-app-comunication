/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text, Image,
    StatusBar, Pressable, Linking,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {

    const [isDataReceivedOnStart, setDataReceivedOnStart] = useState(null);
    const [initialUrl, setInitialUrl] = useState(null);
    const [inputData, setInputData] = useState({
        requestId: null,
        protocol: null,
        method: null,
        data: null,
    });
    const [photos, setPhotos] = useState([]);

    const onDeepLinkReceived = url => {
        const urlParts = url.split('/');
        // URL is composed of: [protocol]//[method]/[requestId]/[data]

        setInputData({
            protocol: urlParts[0],
            method: urlParts[2],
            requestId: urlParts[3],
            data: JSON.parse(base64.decode(urlParts[4])),
        });
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

    const takePhoto = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            setPhotos([{
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime,
            }]);

            console.log(image.path);
        });
    };

    const sendPhoto = () => {
        if (photos.length === 0) {
            console.log('No photos');
            return;
        }

        const data = {
            photos: photos,
            projectId: '0129I3OPDOKPZDOPZ',
            location: '12;123',
        };

        try {
            const result = Linking.openURL('pnoffline://identification/1/' + base64.encode(JSON.stringify(data)));
            console.log(result);
        } catch (error) {
            console.log(error);
        }
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
                            <Text style={styles.sectionTitle}>CLIENT</Text>
                            {isDataReceivedOnStart !== null &&
                            <Text>{isDataReceivedOnStart ? 'COLD (initial) start' : 'WARM (resume)'}</Text>}
                        </View>

                        <Pressable onPress={takePhoto} style={styles.button}><Text>📸 Take photo</Text></Pressable>
                        <Pressable onPress={sendPhoto} style={styles.button}><Text>🌱 Identify photo</Text></Pressable>

                        {photos.length === 0 && <Text>NO PHOTOS</Text>}
                        {
                            photos.length > 0 && <Image source={photos[0]}/>
                        }

                        <Text style={styles.data}>
                            {JSON.stringify(inputData, 0, 4)}
                        </Text>

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
        color: Colors.black,
    },
    button: {
        margin: 10,
        padding: 10,
        borderColor: '#777',
        backgroundColor: '#EEE',
        borderWidth: 1,
        borderRadius: 4,
    },
    data: {
        backgroundColor: '#EEE',
    },
});

export default App;
