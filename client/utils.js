/* eslint-disable */
import {Platform} from "react-native"
import { exists, ExternalStorageDirectoryPath, mkdir } from 'react-native-fs';

export const getExternalStorageDir = async () => {
    const folderName = "/PlantNetTest/"
    console.log(Platform.os);
    if (Platform.OS === "android") {
        // the absolute path to the external storage (not the private one), shared directory
        // system and other apps can read / write this storage
        const folder = ExternalStorageDirectoryPath + folderName;
        if (!(await exists(folder))) {
            await mkdir(folder);
        }
        return folder
    }
    return folderName
}
