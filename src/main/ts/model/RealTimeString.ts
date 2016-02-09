import RealTimeValue from "./RealTimeValue";
import RealTimeContainer from "./RealTimeContainerValue";
import {PathElement} from "../ot/Path";
import DiscreteOperation from "../ot/ops/DiscreteOperation";
import StringInsertOperation from "../ot/ops/StringInsertOperation";
import StringRemoveOperation from "../ot/ops/StringRemoveOperation";
import StringSetOperation from "../ot/ops/StringSetOperation";
import ModelOperationEvent from "./ModelOperationEvent";
import StringInsertEvent from "./events/StringInsertEvent";
import StringRemoveEvent from "./events/StringRemoveEvent";
import StringSetEvent from "./events/StringSetEvent";
import DataType from "./DataType";


export default class RealTimeString extends RealTimeValue {

  static Events: any = {
    INSERT: "insert",
    REMOVE: "remove",
    SET: "set"
  };

  /**
   * Constructs a new RealTimeString.
   */
  constructor(private data: string,
              parent: RealTimeContainer,
              fieldInParent: PathElement,
              sendOpCallback: (operation: DiscreteOperation) => void) {
    super(DataType.String, parent, fieldInParent, sendOpCallback);
  }

  /**
   * Inserts characters into the RealTimeString
   * @param {number} index - The index to insert at
   * @param {string} value - The value to insert
   */
  insert(index: number, value: string): void {
    this._validateInsert(index, value);

    var operation: StringInsertOperation = new StringInsertOperation(this.path(), false, index, value);
    this.data = this.data.slice(0, index) + value + this.data.slice(index, this.data.length);
    this.sendOpCallback(operation);
  }

  /**
   * Removes characters from the RealTimeString
   * @param {number} index - The start index of the characters to remove
   * @param {number} length - The number of characters to remove
   */
  remove(index: number, length: number): void {
    this._validateRemove(index, length);

    var operation: StringRemoveOperation = new StringRemoveOperation(this.path(), false, index, this.data.substr(index, length));
    this.data = this.data.slice(0, index) + this.data.slice(index + length, this.data.length);
    this.sendOpCallback(operation);
  }

  setValue(value: string): void {
    this._validateSet(value);

    this.data = value;
    var operation: StringSetOperation = new StringSetOperation(this.path(), false, value);
    this.sendOpCallback(operation);
  }


  /**
   * @return {number} The length of the RealTimeString
   */
  length(): number {
    return this.data.length;
  }

  value(): string {
    return this.data;
  }

  _handleIncomingOperation(operationEvent: ModelOperationEvent): void {
    var type: string = operationEvent.operation.type;
    if (type === StringInsertOperation.TYPE) {
      this._handleInsertOperation(operationEvent);
    } else if (type === StringRemoveOperation.TYPE) {
      this._handleRemoveOperation(operationEvent);
    } else if (type === StringSetOperation.TYPE) {
      this._handleSetOperation(operationEvent);
    } else {
      throw new Error("Invalid operation!");
    }
  }

  private _handleInsertOperation(operationEvent: ModelOperationEvent): void {
    var operation: StringInsertOperation = <StringInsertOperation> operationEvent.operation;
    var index: number = operation.index;
    var value: string = operation.value;

    this._validateInsert(index, value);

    this.data = this.data.slice(0, index) + value + this.data.slice(index, this.data.length);

    var event: StringInsertEvent = new StringInsertEvent(
      operationEvent.sessionId,
      operationEvent.username,
      operationEvent.version,
      operationEvent.timestamp,
      this,
      index,
      value);
    this.emit(RealTimeString.Events.INSERT, event);
  }

  private _handleRemoveOperation(operationEvent: ModelOperationEvent): void {
    var operation: StringRemoveOperation = <StringRemoveOperation> operationEvent.operation;
    var index: number = operation.index;
    var value: string = operation.value;

    this._validateRemove(index, value.length);

    this.data = this.data.slice(0, index) + this.data.slice(index + value.length, this.data.length);

    var event: StringRemoveEvent = new StringRemoveEvent(
      operationEvent.sessionId,
      operationEvent.username,
      operationEvent.version,
      operationEvent.timestamp,
      this,
      index,
      value);
    this.emit(RealTimeString.Events.REMOVE, event);
  }

  private _handleSetOperation(operationEvent: ModelOperationEvent): void {
    var operation: StringSetOperation = <StringSetOperation> operationEvent.operation;
    var value: string = operation.value;

    this._validateSet(value);
    this.data = value;

    var event: StringSetEvent = new StringSetEvent(
      operationEvent.sessionId,
      operationEvent.username,
      operationEvent.version,
      operationEvent.timestamp,
      this,
      value);
    this.emit(RealTimeString.Events.SET, event);
  }

  private _validateInsert(index: number, value: string): void {
    // TODO: Add integer check
    if (this.data.length < index || index < 0) {
      throw new Error("Index out of bounds: " + index);
    }

    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
  }

  private _validateRemove(index: number, length: number): void {
    // TODO: Add integer check
    if (this.data.length < index + length || index < 0) {
      throw new Error("Index out of bounds!");
    }
  }

  private _validateSet(value: string): void {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
  }
}
