class WebsocketHandler {

    socket;

    constructor(callback) {
        this.socket = new WebSocket("ws://173.212.247.39:8000/ws/" + Date.now())
        this.socket.onmessage = callback
    }
}

export default WebsocketHandler