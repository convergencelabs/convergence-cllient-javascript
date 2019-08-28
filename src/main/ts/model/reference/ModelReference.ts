import {IConvergenceEvent, ConvergenceEventEmitter} from "../../util/";
import {EqualsUtil} from "../../util/EqualsUtil";
import {ReferenceManager} from "./ReferenceManager";
import {
  ReferenceDisposedEvent,
  ReferenceChangedEvent,
  ReferenceClearedEvent
} from "./events/";
import {ReferenceType} from "./ReferenceType";
import {DomainUser} from "../../identity";
import { RealTimeElement, RealTimeModel } from "../rt";

export interface ModelReferenceTypes {
  [key: string]: ReferenceType;
  readonly INDEX: ReferenceType;
  readonly RANGE: ReferenceType;
  readonly PROPERTY: ReferenceType;
  readonly ELEMENT: ReferenceType;
}

/**
 * The generic events available on any reference.
 */
export interface ModelReferenceEvents {
  /**
   * Indicates that a new value on a reference was set.
   */
  readonly SET: string;

  /**
   * Indicates that a reference's value was cleared.
   */
  readonly CLEARED: string;

  /**
   * Indicates that a reference was disposed.
   */
  readonly DISPOSED: string;
}

/**
 * The base class for all [references](https://docs.convergence.io/guide/models/references/references.html),
 * which are essentially pointers to elements and data within a [[RealTimeModel]].
 * They are typically used to implement transient UX constructs such as text selections
 * and cursors.
 */
export abstract class ModelReference<V> extends ConvergenceEventEmitter<IConvergenceEvent> {

  public static readonly Events: ModelReferenceEvents = {
    SET: ReferenceChangedEvent.NAME,
    CLEARED: ReferenceClearedEvent.NAME,
    DISPOSED: ReferenceDisposedEvent.NAME
  };

  public static readonly Types: ModelReferenceTypes = {
    INDEX: "index",
    RANGE: "range",
    PROPERTY: "property",
    ELEMENT: "element"
  };

  /**
   * @hidden
   * @internal
   */
  protected _values: V[];

  /**
   * @internal
   */
  private readonly _referenceManager: ReferenceManager;

  /**
   * @internal
   */
  private _disposed: boolean;

  /**
   * @internal
   */
  private readonly _type: ReferenceType;

  /**
   * @internal
   */
  private readonly _key: string;

  /**
   * @internal
   */
  private readonly _source: any;

  /**
   * @internal
   */
  private readonly _user: DomainUser;

  /**
   * @internal
   */
  private readonly _sessionId: string;

  /**
   * @internal
   */
  private readonly _local: boolean;

  /**
   * @hidden
   * @internal
   */
  protected constructor(referenceManager: ReferenceManager,
                        type: ReferenceType,
                        key: string,
                        source: RealTimeElement<any> | RealTimeModel,
                        user: DomainUser,
                        sessionId: string,
                        local: boolean) {
    super();
    this._referenceManager = referenceManager;
    this._disposed = false;
    this._values = [];
    this._type = type;
    this._key = key;
    this._source = source;
    this._user = user;
    this._sessionId = sessionId;
    this._local = local;
  }

  /**
   * Returns a string indicating the type of reference this is.
   */
  public type(): ReferenceType {
    return this._type;
  }

  /**
   * Returns the unique key corresponding to this reference.
   */
  public key(): string {
    return this._key;
  }

  /**
   * Returns the element or model on which this reference was created.
   */
  public source(): RealTimeElement<any> | RealTimeModel {
    return this._source;
  }

  /**
   * Returns true if this reference was created locally.
   */
  public isLocal(): boolean {
    return this._local;
  }

  /**
   * Returns the user that created this reference.
   */
  public user(): DomainUser {
    return this._user;
  }

  /**
   * Returns the session ID of the user session that created this reference.
   */
  public sessionId(): string {
    return this._sessionId;
  }

  /**
   * Returns true if this reference has already been disposed (cleaned up).
   */
  public isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * @hidden
   * @internal
   */
  public _dispose(): void {
    this._disposed = true;
    const event: ReferenceDisposedEvent = new ReferenceDisposedEvent(this);
    this._emitEvent(event);
    this.removeAllListeners();
    this._referenceManager._handleReferenceDisposed(this);
  }

  /**
   * Returns the first value of the underlying reference.
   */
  public value(): V {
    return this._values[0];
  }

  /**
   * Returns all values of the underlying reference.
   */
  public values(): V[] {
    return this._values;
  }

  /**
   * Returns true if a value is currenly set on the reference.
   */
  public isSet(): boolean {
    return this._values.length > 0;
  }

  /**
   * @hidden
   * @internal
   */
  public _set(values: V[], synthetic: boolean): void {
    const oldValues: V[] = this._values;
    this._values = values;

    const added = this._values.filter(v => !oldValues.includes(v));
    const removed = oldValues.filter(v => !this._values.includes(v));

    const event: ReferenceChangedEvent<V> = new ReferenceChangedEvent(this, oldValues, added, removed, synthetic);
    this._emitEvent(event);
  }

  /**
   * @hidden
   * @internal
   */
  public _clear(): void {
    const oldValues: V[] = this._values;
    this._values = [];
    const event: ReferenceClearedEvent<V> = new ReferenceClearedEvent(this, oldValues);
    this._emitEvent(event);
  }

  /**
   * @hidden
   * @internal
   */
  protected _setIfChanged(values: V[], synthetic: boolean): void {
    if (!EqualsUtil.deepEquals(this._values, values)) {
      this._set(values, synthetic);
    }
  }
}

Object.freeze(ModelReference.Events);
Object.freeze(ModelReference.Types);
