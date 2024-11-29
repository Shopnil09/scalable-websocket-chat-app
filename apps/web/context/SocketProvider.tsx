'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client"

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => { 
  const state = useContext(SocketContext)
  if (!state) throw new Error('State is undefined')
  
  return state
}

interface SocketProviderProps { 
  children?: React.ReactNode
}

interface ISocketContext  { 
  sendMessage: (msg: string) => any
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
  const [socket, setSocket] = useState<Socket>()

  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => { 
    console.log("Send Message", msg)
    if(socket) { 
      // emiting the message to the server whenever there is a new message 
      socket.emit('event:message', {message: msg})
    }
  }, [socket])

  useEffect(() => { 
    const _socket = io('http://localhost:8000') // backend url to connect to the websocket server 
    setSocket(_socket) // setting socket when it mounts
    return () => { // cleanup
      _socket.disconnect()
      setSocket(undefined)
    }
  }, [])

  return (
    <SocketContext.Provider value={{sendMessage}}>
      {children}
    </SocketContext.Provider>
  )
}