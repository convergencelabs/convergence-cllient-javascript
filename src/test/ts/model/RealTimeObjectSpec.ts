import {ModelOperationEvent} from "../../../main/ts/model/ModelOperationEvent";
import {RealTimeObject} from "../../../main/ts/model/rt/RealTimeObject";
import {ObjectSetOperation} from "../../../main/ts/model/ot/ops/ObjectSetOperation";
import {ModelEventCallbacks} from "../../../main/ts/model/rt/RealTimeModel";
import {ObjectValue, StringValue, DataValueType} from "../../../main/ts/model/dataValue";
import {DataValueFactory} from "../../../main/ts/model/DataValueFactory";
import {TestIdGenerator} from "./TestIdGenerator";
import {DataValue} from "../../../main/ts/model/dataValue";
import {RealTimeModel} from "../../../main/ts/model/rt/RealTimeModel";
import {RealTimeWrapperFactory} from "../../../main/ts/model/rt/RealTimeWrapperFactory";
import {Model} from "../../../main/ts/model/internal/Model";
import {ObjectNode} from "../../../main/ts/model/internal/ObjectNode";

import * as chai from "chai";
import {SinonSpy} from "sinon";
import * as sinon from "sinon";
import {ObjectSetValueEvent} from "../../../main/ts/model/modelEvents";

const expect: any = chai.expect;

describe("RealTimeObject", () => {

  // TODO most of this set up is common.
  const sessionId: string = "mySession";
  const username: string = "myUser";
  const version: number = 1;
  const timestamp: number = 100;

  let callbacks: ModelEventCallbacks;

  const gen: TestIdGenerator = new TestIdGenerator();

  const dataValueFactory: DataValueFactory = new DataValueFactory(() => {
    return gen.id();
  });

  const model: Model = <Model> <any> sinon.createStubInstance(Model);
  const rtModel: RealTimeModel = <RealTimeModel> <any> sinon.createStubInstance(RealTimeModel);
  rtModel.emitLocalEvents = () => {
    return false;
  };
  rtModel.permissions = () => {
    return  {
      read: true,
      write: true,
      remove: true,
      manage: true
    };
  };

  const initialValue: ObjectValue =
    <ObjectValue> dataValueFactory.createDataValue({num: 5});

  const setValue: {[key: string]: DataValue} = {
    string: dataValueFactory.createDataValue("test")
  };

  beforeEach(() => {
    callbacks = {
      sendOperationCallback: sinon.spy(),
      referenceEventCallbacks: {
        onShare: sinon.spy(),
        onUnshare: sinon.spy(),
        onSet: sinon.spy(),
        onClear: sinon.spy()
      }
    };
  });

  it("Get on missing value return UndefinedNode", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    expect(myObject.get("nonExistent").id()).to.deep.equal(undefined);
  });

  it("Value is correct after creation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    expect(myObject.value()).to.deep.equal({num: 5});
  });

  it("Value is correct after set", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    myObject.value({string: "test"});
    expect(myObject.value()).to.deep.equal({string: "test"});
  });

  it("Value is correct after setProperty", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    myObject.set("num", 10);
    expect(myObject.get("num").value()).to.deep.equal(10);
  });

  it("Correct operation is sent after set", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    myObject.value({string: "test"});

    const expectedDataValue: {[key: string]: DataValue} = {
      string: <StringValue> {id: myObject.get("string").id(), type: DataValueType.STRING, value: "test"}
    };

    const opSpy: sinon.SinonSpy = (<sinon.SinonSpy> callbacks.sendOperationCallback);
    expect(opSpy.called).to.be.true;
    const expectedOp: ObjectSetOperation = new ObjectSetOperation(myObject.id(), false, expectedDataValue);
    expect(opSpy.args[0][0]).to.deep.equal(expectedOp);
  });

  it("Value is correct after ObjectSetOperation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);

    const incomingOp: ObjectSetOperation = new ObjectSetOperation(initialValue.id, false, setValue);
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, username, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    expect(myObject.value()).to.deep.equal({string: "test"});
  });

  it("Correct Event is fired after ObjectSetOperation", () => {
    const eventCallback: SinonSpy = sinon.spy();
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel);
    const delegate: ObjectNode = new ObjectNode(initialValue, () => [], model, sessionId, username, dataValueFactory);
    const myObject: RealTimeObject = <RealTimeObject> wrapperFactory.wrap(delegate);
    myObject.on(RealTimeObject.Events.VALUE, eventCallback);

    const incomingOp: ObjectSetOperation = new ObjectSetOperation(initialValue.id, false, setValue);
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, username, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    const expectedEvent: ObjectSetValueEvent = {
     element: myObject,
     name: RealTimeObject.Events.VALUE,
     sessionId,
     username,
     local: false
    };
    expect(eventCallback.lastCall.args[0]).to.deep.equal(expectedEvent);
  });
});
