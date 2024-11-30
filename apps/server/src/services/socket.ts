import {Server} from 'socket.io'
import Redis from 'ioredis'

const pub = new Redis({
  host: process.env.host,
  port: process.env.port,
  username: process.env.username,
  password: process.env.password
})

const sub = new Redis({
  host: process.env.host,
  port: process.env.port,
  username: process.env.username,
  password: process.env.password
})

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

    // subscribing to the 'MESSAGES' channel to listen into whenever Redis publishes messages upon recieving
    sub.subscribe("MESSAGES")
  }

  public initListeners() { 
    console.log('Init Socket Listeners')
    const io = this.io
    io.on('connect', socket => {
      console.log("New Connection", socket.id)

      socket.on('event:message', async ({message}:{message:string})=> {
        console.log("New Message Recv.", message)
        await pub.publish("MESSAGES", JSON.stringify({message}))
      })
    })

    // listen for any messages that is published on the channel and check if it is MESSAGES channel, if it is, emit it to the connected users 
    sub.on('message', (channel, message) => { 
      if(channel === 'MESSAGES') { 
        io.emit('message', message)
      }
    })
  }

  get io() { 
    return this._io
  }
}

export default SocketService