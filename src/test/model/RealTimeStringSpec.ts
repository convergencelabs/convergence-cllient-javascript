/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence JavaScript Client, which is released
 * under the terms of the GNU Lesser General Public License version 3 
 * (LGPLv3), which is a refinement of the GNU Lesser General Public License
 * version 3 (GPLv3).  A copy of the both the GPLv3 and the LGPLv3 should have
 * been provided along with this file, typically located in the "LICENSE" and
 * "COPYING.LESSER" files (respectively), which are part of this source code
 * package. Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> and
 * <https://www.gnu.org/licenses/lgpl-3.0.html> for the full text of the GPLv3 
 * and LGPLv3 licenses, if they were not provided.
 */

import {StringSetOperation} from "../../main/model/ot/ops/StringSetOperation";
import {StringInsertOperation} from "../../main/model/ot/ops/StringInsertOperation";
import {StringRemoveOperation} from "../../main/model/ot/ops/StringRemoveOperation";
import {ModelOperationEvent} from "../../main/model/ModelOperationEvent";
import {RealTimeModel, RealTimeString, ModelEventCallbacks} from "../../main/model/rt";
import {StringValue} from "../../main/model/dataValue";
import {DataValueFactory} from "../../main/model/DataValueFactory";
import {TestIdGenerator} from "./TestIdGenerator";
import {Model} from "../../main/model/internal/Model";
import {StringNode} from "../../main/model/internal/StringNode";
import {RealTimeWrapperFactory} from "../../main/model/rt/RealTimeWrapperFactory";
import {
  ModelChangedEvent,
  StringSetValueEvent,
  StringInsertEvent,
  StringRemoveEvent
} from "../../main/model/events";
import {DomainUser, DomainUserType} from "../../main/identity";
import {IdentityCache} from "../../main/identity/IdentityCache";
import {ConvergenceSession} from "../../main";

import {expect} from "chai";
import {SinonSpy, spy, createStubInstance} from "sinon";

describe("RealTimeString", () => {

  const sessionId: string = "mySession";
  const username: string = "myUser";
  const user = new DomainUser(DomainUserType.NORMAL, username, "", "", "", "");
  const version: number = 1;
  const timestamp = new Date();

  const gen: TestIdGenerator = new TestIdGenerator();
  const dataValueFactory: DataValueFactory = new DataValueFactory(() => {
    return gen.id();
  });

  const initialValue = dataValueFactory.createDataValue("MyString") as StringValue;

  const model = createStubInstance(Model) as any as Model;
  const identityCache = createStubInstance(IdentityCache) as any as IdentityCache;
  const session = createStubInstance(ConvergenceSession) as any as ConvergenceSession;
  const rtModel = createStubInstance(RealTimeModel) as any as RealTimeModel;
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

  let callbacks: ModelEventCallbacks;
  beforeEach(() => {
    callbacks = {
      sendOperationCallback: spy(),
      referenceEventCallbacks: {
        onShare: spy(),
        onUnShare: spy(),
        onSet: spy(),
        onClear: spy()
      }
    };
  });

  let lastEvent: ModelChangedEvent = null;
  const lastEventCallback: (event: ModelChangedEvent) => void = (event: ModelChangedEvent) => {
    lastEvent = event;
  };

  it("Value is correct after creation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    expect(myString.value()).to.equal("MyString");
  });

  it("Value is correct after set", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.value("AnotherString");
    expect(myString.value()).to.equal("AnotherString");
  });

  it("Value is correct after insert", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.insert(2, "Edited");
    expect(myString.value()).to.equal("MyEditedString");
  });

  it("Value is correct after remove", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.remove(0, 2);
    expect(myString.value()).to.equal("String");
  });

  it("Correct operation is sent after set", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.value("AnotherString");

    const expectedOp: StringSetOperation = new StringSetOperation(initialValue.id, false, "AnotherString");
    expect((callbacks.sendOperationCallback as SinonSpy).lastCall.args[0]).to.deep.equal(expectedOp);
  });

  it("Correct operation is sent after insert", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.insert(2, "Edited");

    const expectedOp: StringInsertOperation = new StringInsertOperation(initialValue.id, false, 2, "Edited");
    expect((callbacks.sendOperationCallback as SinonSpy).lastCall.args[0]).to.deep.equal(expectedOp);
  });

  it("Correct operation is sent after remove", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.remove(0, 2);

    const expectedOp: StringRemoveOperation = new StringRemoveOperation(initialValue.id, false, 0, "My");
    expect((callbacks.sendOperationCallback as SinonSpy).lastCall.args[0]).to.deep.equal(expectedOp);
  });

  it("Value is correct after StringSetOperation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;

    const incomingOp: StringSetOperation = new StringSetOperation(initialValue.id, false, "AnotherString");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    expect(myString.value()).to.equal("AnotherString");
  });

  it("Value is correct after StringInsertOperation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;

    const incomingOp: StringInsertOperation = new StringInsertOperation(initialValue.id, false, 2, "Edited");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    expect(myString.value()).to.equal("MyEditedString");
  });

  it("Value is correct after StringRemoveOperation", () => {
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;

    const incomingOp: StringRemoveOperation = new StringRemoveOperation(initialValue.id, false, 0, "My");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    expect(myString.value()).to.equal("String");
  });

  it("Correct event is fired after StringSetOperation", () => {
    lastEvent = null;
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.on(RealTimeString.Events.VALUE, lastEventCallback);

    const incomingOp: StringSetOperation = new StringSetOperation(initialValue.id, false, "AnotherString");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    const expectedEvent: StringSetValueEvent =
      new StringSetValueEvent(myString, user, sessionId, false);
    expect(lastEvent).to.deep.equal(expectedEvent);
  });

  it("Correct event is fired after StringInsertOperation", () => {
    lastEvent = null;
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () =>  [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.on(RealTimeString.Events.INSERT, lastEventCallback);

    const incomingOp: StringInsertOperation = new StringInsertOperation(initialValue.id, false, 2, "Edited");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    const expectedEvent: StringInsertEvent = new StringInsertEvent(myString, user, sessionId, false, 2, "Edited");
    expect(lastEvent).to.deep.equal(expectedEvent);
  });

  it("Correct event is fired after StringRemoveOperation", () => {
    lastEvent = null;
    const wrapperFactory: RealTimeWrapperFactory = new RealTimeWrapperFactory(callbacks, rtModel, identityCache);
    const delegate: StringNode = new StringNode(initialValue, () => [], model, session);
    const myString: RealTimeString = wrapperFactory.wrap(delegate) as RealTimeString;
    myString.on("Remove", lastEventCallback);

    const incomingOp: StringRemoveOperation = new StringRemoveOperation(initialValue.id, false, 0, "My");
    const incomingEvent: ModelOperationEvent =
      new ModelOperationEvent(sessionId, user, version, timestamp, incomingOp);
    delegate._handleModelOperationEvent(incomingEvent);

    const expectedEvent: StringRemoveEvent = new StringRemoveEvent(myString, user, sessionId, false, 0, "My");
    expect(lastEvent).to.deep.equal(expectedEvent);
  });
});
