import { Component, Type } from "@wonderlandengine/api";
import { Client } from "colyseus.js";

export class ColyseusClient extends Component {
  static TypeName = "colyseus-client";
  static Properties = {
    sphere: { type: Type.Object },
    box: { type: Type.Object },
    cone: { type: Type.Object },
    hostButton: { type: Type.Object },
    joinButton: { type: Type.Object },
    leaveButton: { type: Type.Object },
  };
  
  init() {
    this.client = new Client("ws://localhost:2567");
    document.client = this.client;

    // Bind the click events to the buttons
    this.hostButton.addEventListener("click", this.onHostClick.bind(this));
    this.joinButton.addEventListener("click", this.onJoinClick.bind(this));
    this.leaveButton.addEventListener("click", this.onLeaveClick.bind(this));
  }

  onHostClick() {
    this.client.create("my_room").then(
      function (room) {
        this.setupRoom(room);
        console.log(room.sessionId, "created", room.name);
      }.bind(this)
    ).catch(function (e) {
      console.log("CREATE ERROR", e);
    });
  }

  onJoinClick() {
    this.client.join("my_room").then(
      function (room) {
        this.setupRoom(room);
        console.log(room.sessionId, "joined", room.name);
      }.bind(this)
    ).catch(function (e) {
      console.log("JOIN ERROR", e);
    });
  }

  onLeaveClick() {
    if (this.room) {
      this.room.leave().then(
        function () {
          console.log("Left the room", this.room.name);
          this.room = null;
        }.bind(this)
      ).catch(function (e) {
        console.log("LEAVE ERROR", e);
      });
    } else {
      console.log("No room to leave");
    }
  }

  setupRoom(room) {
    this.room = room;
    this.newPosBox = {};
    this.newPosCone = {};
    this.newPosSphere = {};
    room.state.box.onChange(() => {
      this.box.setTranslationWorld([this.room.state.box.x, this.room.state.box.y, this.room.state.box.z]);
    });

    room.state.cone.onChange(() => {
      this.cone.setTranslationWorld([this.room.state.cone.x, this.room.state.cone.y, this.room.state.cone.z]);
    });

    room.state.sphere.onChange(() => {
      this.sphere.setTranslationWorld([this.room.state.sphere.x, this.room.state.sphere.y, this.room.state.sphere.z]);
    });
  }
}
