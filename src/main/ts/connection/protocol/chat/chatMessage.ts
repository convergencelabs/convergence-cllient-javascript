import {IncomingProtocolNormalMessage, OutgoingProtocolRequestMessage} from "../protocol";
import {SessionIdParser} from "../SessionIdParser";

export interface PublishChatMessage extends OutgoingProtocolRequestMessage {
  channelId: string;
  message: string;
}

export function PublishChatMessageSerializer(request: PublishChatMessage): any {
  return {
    i: request.channelId,
    m: request.message
  };
}

export interface RemoteChatMessage extends IncomingProtocolNormalMessage {
  channelId: string;
  eventNumber: number;
  username: string;
  sessionId: string;
  timestamp: Date;
  message: string;
}

export function RemoteChatMessageDeserializer(body: any): RemoteChatMessage {
  const result: RemoteChatMessage = {
    channelId: body.i,
    eventNumber: body.e,
    timestamp: new Date(body.p),
    username: SessionIdParser.parseUsername(body.s),
    sessionId: body.s,
    message: body.m
  };
  return result;
}
