from email.policy import default
from textwrap import indent
from typing import List
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    def dumper(self, obj):
        try:
            return obj.toJSON()
        except:
            return obj.__dict__

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, obj, websocket: WebSocket):
        message = json.dumps(obj, default=self.dumper, indent=2)
        await websocket.send_text(message)

    async def broadcast(self, obj):
        print(obj)
        for connection in self.active_connections:
            message = json.dumps(obj, default=self.dumper, indent=2)
            await connection.send_text(message)