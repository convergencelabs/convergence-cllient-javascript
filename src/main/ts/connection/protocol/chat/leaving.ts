import {OutgoingProtocolRequestMessage} from "../protocol";
import {IncomingProtocolNormalMessage} from "../protocol";

export interface LeaveChatChannelRequestMessage extends OutgoingProtocolRequestMessage {
  channelId: string;
}

export function LeaveChatChannelRequestMessageSerializer(request: LeaveChatChannelRequestMessage): any {
  return {
    i: request.channelId
  };
}

export interface UserLeftChatChannelMessage extends IncomingProtocolNormalMessage {
  channelId: string;
  eventNumber: number;
  username: string;
  timestamp: Date;
}

export function UserLeftChatChannelMessageDeserializer(body: any): UserLeftChatChannelMessage {
  const result: UserLeftChatChannelMessage = {
    channelId: body.i,
    eventNumber: body.n,
    username: body.u,
    timestamp: new Date(body.p)
  };
  return result;
}

export interface RemoveUserFromChatChannelMessage extends OutgoingProtocolRequestMessage {
  channelId: string;
  username: string;
}

export function RemoveUserFromChatChannelMessageSerializer(request: RemoveUserFromChatChannelMessage): any {
  return {
    i: request.channelId,
    u: request.username
  };
}

export interface UserRemovedFromChatChannelMessage extends IncomingProtocolNormalMessage {
  channelId: string;
  eventNumber: number;
  username: string;
  removedBy: string;
  timestamp: Date;
}

export function UserRemovedFromChatChannelMessageDeserializer(body: any): UserRemovedFromChatChannelMessage {
  const result: UserRemovedFromChatChannelMessage = {
    channelId: body.i,
    eventNumber: body.n,
    removedBy: body.b,
    username: body.u,
    timestamp: new Date(body.p)
  };
  return result;
}