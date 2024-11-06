import { Component, InputComponent, MeshComponent, Property } from "@wonderlandengine/api";
import { CursorTarget, HowlerAudioSource } from "@wonderlandengine/components";
import { ColyseusClient } from "./colyseus-client"; // Ensure the correct path to colyseus-client.js

export function hapticFeedback(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
  }
}

export class ButtonComponent extends Component {
  static TypeName = "buttonLeave";
  static Properties = {
    buttonMeshObject: Property.object(),
    hoverMaterial: Property.material(),
  };

  static onRegister(engine) {
    engine.registerComponent(HowlerAudioSource);
    engine.registerComponent(CursorTarget);
  }

  returnPos = new Float32Array(3);

  start() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);

    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);

    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/click.wav",
      spatial: true,
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/unclick.wav",
      spatial: true,
    });
  }

  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onUp.add(this.onUp);
  }

  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    this.target.onUp.remove(this.onUp);
  }

  onHover = (_, cursor) => {
    this.mesh.material = this.hoverMaterial;
    if (cursor.type === "finger-cursor") {
      this.onDown(_, cursor);
    }

    hapticFeedback(cursor.object, 0.5, 50);
  };

  onDown = (_, cursor) => {
    console.log("Button pressed");
    this.soundClick.play();
    this.buttonMeshObject.translate([0.0, -0.1, 0.0]);
    hapticFeedback(cursor.object, 1.0, 20);

    // Trigger the joinOrCreate method from ColyseusClient
    let colyseusClient = this.object.getComponent(ColyseusClient);
    if (!colyseusClient) {
      colyseusClient = this.object.parent.getComponent(ColyseusClient);
    }
    if (colyseusClient) {
      colyseusClient.onLeaveClick();
    } else {
      console.error("ColyseusClient component not found!");
    }
  };

  onUp = (_, cursor) => {
    this.soundUnClick.play();
    this.buttonMeshObject.setTranslationLocal(this.returnPos);
    hapticFeedback(cursor.object, 0.7, 20);
  };

  onUnhover = (_, cursor) => {
    this.mesh.material = this.defaultMaterial;
    if (cursor.type === "finger-cursor") {
      this.onUp(_, cursor);
    }

    hapticFeedback(cursor.object, 0.3, 50);
  };
}
