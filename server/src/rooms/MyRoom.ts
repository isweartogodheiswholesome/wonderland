import { Room, Client } from '@colyseus/core';
import { SceneObjects } from './schema/SceneObjects';

export class MyRoom extends Room<SceneObjects> {
    maxClients = 4;

    onCreate(options: any) {
        this.setState(new SceneObjects());

        this.onMessage('test', (client, message) => {
            console.log('msg: ', message);
            //
            // handle "type" message.
            //
        });

        this.onMessage('move', (client, message) => {
            this.state[message.object].move(message.x, message.z);
            // this.state[message.object].set(message.x, message.y, message.z);
        });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, 'joined!');
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
