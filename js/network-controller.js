import { Component, Type } from "@wonderlandengine/api";

export class NetworkController extends Component {
    static TypeName = "network-controller";
    static Properties = {
        sphere: { type: Type.Object },
        box: { type: Type.Object },
        cone: { type: Type.Object },
        colyseusObject: { type: Type.Object },
        speed: { type: Type.Float, default: 0.1 },
    };

    start() {
        document.addEventListener("keypress", this.onKeyPress.bind(this));
        this.currentObject = "box";
        this.colyseusComponent = this.colyseusObject.getComponent("colyseus-client", 0);
        this.networkArray = [0, 0, 0];

        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;

        window.addEventListener("keydown", this.press.bind(this));
        window.addEventListener("keyup", this.release.bind(this));
    }

    onKeyPress(e) {
        const boxControls = this.box ? this.box.getComponent('wasd-controls', 0) : null;
        const coneControls = this.cone ? this.cone.getComponent('wasd-controls', 0) : null;
        const sphereControls = this.sphere ? this.sphere.getComponent('wasd-controls', 0) : null;

        switch (e.code) {
            case "KeyB":
                if (boxControls) boxControls.active = true;
                if (coneControls) coneControls.active = false;
                if (sphereControls) sphereControls.active = false;
                this.currentObject = "box";
                break;
            case "KeyN":
                if (boxControls) boxControls.active = false;
                if (coneControls) coneControls.active = false;
                if (sphereControls) sphereControls.active = true;
                this.currentObject = "sphere";
                break;
            case "KeyM":
                if (boxControls) boxControls.active = false;
                if (coneControls) coneControls.active = true;
                if (sphereControls) sphereControls.active = false;
                this.currentObject = "cone";
                break;
            case "KeyA":
            case "KeyS":
            case "KeyW":
            case "KeyD":
                this.moved = true;
                break;
        }
    }

    update(dt) {
        if (this.colyseusComponent && this.colyseusComponent.room) {
            this.networkArray = [0, 0, 0];

            if (this.up) this.networkArray[2] -= 1.0;
            if (this.down) this.networkArray[2] += 1.0;
            if (this.left) this.networkArray[0] -= 1.0;
            if (this.right) this.networkArray[0] += 1.0;

            this.networkArray[0] *= this.speed;
            this.networkArray[2] *= this.speed;
            if (this.networkArray.x != 0 && this.networkArray.z != 0)
                this.colyseusComponent.room.send("move", {
                    object: this.currentObject,
                    x: this.networkArray[0],
                    z: this.networkArray[2],
                });
        }
    }

    press(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
            this.up = true;
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
            this.right = true;
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            this.down = true;
        } else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            this.left = true;
        }
    }

    release(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
            this.up = false;
        } else if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
            this.right = false;
        } else if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            this.down = false;
        } else if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            this.left = false;
        }
    }
}
