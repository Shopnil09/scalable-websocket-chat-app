import {Server} from 'socket.io'

class SocketService { 
  private _io: Server // _io is the type server from socket.io

  constructor() { 
    console.log('Init Socket Service')
    // allow everything to avoid CORS error
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    })
  }

  public initListeners() { 
    console.log('Init Socket Listeners')
    const io = this.io
    io.on('connect', socket => {
      console.log("New Connection", socket.id)

      socket.on('event:message', async ({message}:{message:string})=> {
        console.log("New Message Recv.", message)
      })
    })
  }

  get io() { 
    return this._io
  }
}

export default SocketService