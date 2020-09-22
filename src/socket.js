import {Socket} from "phoenix";
let socket = new Socket(process.env.WEB_SOCKET, {params: {token: "123"}});
socket.connect();
export default socket;
