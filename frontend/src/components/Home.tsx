import { useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const TODOS_URL = import.meta.env.VITE_TODOS_URL as string;
const KEY = import.meta.env.VITE_KEY as string;

const Home = () => {
    useEffect(() => {
        const makeIV = (): string => {
            // Generate a UUID (Universally Unique Identifier)
            const uuid = uuidv4();

            // Remove dashes from the UUID
            const withoutDashes = uuid.replace(/-/g, '');

            // Truncate to 16 characters
            return withoutDashes.substring(0, 16);
        };

        const makeToken = (): string => {
            const utf8Key = CryptoJS.enc.Utf8.parse(KEY);
            const ivString = makeIV();
            const iv = CryptoJS.enc.Utf8.parse(ivString);

            // incorporate timestamp here
            const timestamp = Math.floor(Date.now() / 1000).toString();

            const encrypted = CryptoJS.AES.encrypt(timestamp + KEY, utf8Key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
            });
            return ivString + encrypted.toString();
        };

        const getTodos = async () => {
            const token = makeToken();
            console.log('sending token: ' + token);

            const rawFetchResponse = await fetch(TODOS_URL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await rawFetchResponse.json();
            console.log('got result: ');
            console.log(result);
        };

        getTodos();
    }, []);

    return <div>This is Home</div>;
};

export default Home;
