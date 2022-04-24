from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi_utils.tasks import repeat_every
import time
from connection_manager import ConnectionManager
import json

app = FastAPI()
manager = ConnectionManager()
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "173.212.247.39:3000",
    "http://173.212.247.39:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Report(BaseModel):
    group: int
    alive: int

class Group():
    group: int
    alive: int
    last_update: int

    def __init__(self, group, alive, last_update):
        self.group = group
        self.alive = alive
        self.last_update = last_update

    def toJSON(self):
        return json.dumps(self.__dict__)


subjects_dict = {}

@app.post("/report")
async def report(report: Report):
    subjects_dict["group" + str(report.group)] = Group("group" + str(report.group), report.alive, time.time())
    await manager.broadcast(subjects_dict)
    return report

@app.on_event("startup")
@repeat_every(seconds = 5 * 60)
async def remove_inactive_groups():
    keys_to_delete = []
    for k, group in subjects_dict.items():
        if time.time() - group.last_update > 30 * 60:
            keys_to_delete.append(k)
    if(len(keys_to_delete)):
        for k in keys_to_delete:
            del subjects_dict[k]
        await manager.broadcast(subjects_dict)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await manager.connect(websocket)
        await manager.send_personal_message(subjects_dict, websocket)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)