import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.WS_URL || 'http://localhost:3090';

export const socket = io(URL);