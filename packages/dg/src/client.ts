
import * as ts from "typescript";
import tsvfs from '@typescript/vfs'
import fs from 'fs'
import { TextDecoder } from 'util';
import * as yargs from 'yargs'
import WebSocket,{WebSocketServer} from 'ws'
import repl from 'repl'
import { createDbms } from '../../dglib/src/db/webnot'
import { PortLike } from "../../dglib/src/db/weblike";
import { decode, encode } from 'cbor-x';
import { version } from "./data";
import { combine } from "./nodebuffer";

export async function clientrepl() {
    console.log(`dg client ${version},${process.version}`)
    repl.start("dg>")
}

  
export  async function client(url: string, query: string, mutation: string) {
    console.log(`dg client ${version},${process.version}`)
    const ws = new WebSocket(url)
    ws.onopen = () => {
      const send ={
        method: 'commitForm',
        id: 42,
        params: {
          firstName: 'john',
          lastName: 'doe',
          email: 'doe@example.com',
          phone: '9999999999'
        }}
      ws.send(encode(send))
    }
    ws.on('message',(e, isBinary)=>{
      console.log(decode(combine(e)))
      if (!query) {
        process.exit(0)
      }
    })
  }