import {IncomingProtocolRequestMessage} from "../protocol";
import {OutgoingProtocolResponseMessage} from "../protocol";
import {DataValueSerializer} from "./dataValue";
import {ObjectValue} from "../../../model/dataValue";
import {ModelPermissions} from "../../../model/ModelPermissions";
import {serializeModelPermissions} from "./permissions/modelPermissions";

export interface AutoCreateModelConfigRequest extends IncomingProtocolRequestMessage {
  autoCreateId: number;
}

export function AutoCreateModelConfigRequestDeserializer(body: any): AutoCreateModelConfigRequest  {
  return {
    autoCreateId: body.a
  };
}

export interface AutoCreateModelConfigResponse extends OutgoingProtocolResponseMessage {
  collection: string;
  data?: ObjectValue;
  overrideWorld?: boolean;
  worldPermissions?: ModelPermissions;
  userPermissions?: {[key: string]: ModelPermissions};
}

export function AutoCreateModelConfigResponseSerializer(response: AutoCreateModelConfigResponse): any {
  const d: any = response.data ? DataValueSerializer(response.data) : undefined;
  const w = serializeModelPermissions(response.worldPermissions);
  const v = response.overrideWorld;
  let u: {[key: string]: any};
  if (response.userPermissions) {
    u = {};
    Object.keys(response.userPermissions).forEach(username => {
      u[username] = serializeModelPermissions(response.userPermissions[username]);
    });
  }

  return {
    c: response.collection,
    d,
    v,
    w,
    u
  };
}
