import { initializeApp } from "firebase/app";
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAiC979dCwjGsC179ia-Z-5-nNTe5x41VA",
    authDomain: "society-29c54.firebaseapp.com",
    projectId: "society-29c54",
    storageBucket: "society-29c54.appspot.com",
    messagingSenderId: "578479131683",
    appId: "1:578479131683:web:b14b6fa11f825ee44c7596",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const saveFile = (file: Blob, filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageref = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageref, file);

        uploadTask.on(
            "state_changed",
            () => {},
            (error) => {
                reject(new Error(error.message));
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    resolve(url);
                });
            }
        );
    });
};

export const deleteFile = async (link: string) => {
    const url = new URL(link);
    const encodedPath = url.pathname.split("/o/")[1];
    const imagePath = decodeURIComponent(encodedPath.split("?")[0]);
    const imageRef = ref(storage, imagePath);

    await deleteObject(imageRef);
};
