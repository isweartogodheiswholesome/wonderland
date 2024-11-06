const schema = require('@colyseus/schema');

class Position extends schema.Schema {
    constructor(x: number, y: number, z: number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    move(x: number, z: number) {
        this.x += x;
        this.z += z;
    }
}

schema.defineTypes(Position, {
    x: 'float32',
    y: 'float32',
    z: 'float32',
});

export class SceneObjects extends schema.Schema {
    constructor() {
        super();
        this.box = new Position(0, 0.5, 0);
        this.sphere = new Position(0.5, 0.75, -1.25);
        this.cone = new Position(1.5, 1, 0);
    }
}

schema.defineTypes(SceneObjects, {
    box: Position,
    sphere: Position,
    cone: Position,
});
