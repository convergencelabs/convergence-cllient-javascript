import {ConvergenceConnection} from "./connection/ConvergenceConnection";
import {ConvergenceDomain} from "./ConvergenceDomain";

/**
 * The [[ConvergenceSession]] represents connection state information for a
 * particular connection to a specific domain.
 */
export class ConvergenceSession {

  /**
   * @hidden
   * @internal
   */
  private readonly _domain: ConvergenceDomain;

  /**
   * @hidden
   * @internal
   */
  private readonly _connection: ConvergenceConnection;

  /**
   * @hidden
   * @internal
   */
  private _sessionId: string;

  /**
   * @hidden
   * @internal
   */
  private _username: string;

  /**
   * @hidden
   * @internal
   */
  private _reconnectToken: string;

  /**
   * @hidden
   * @internal
   */
  private _authenticated: boolean;

  /**
   * @hidden
   * @internal
   */
  constructor(domain: ConvergenceDomain,
              connection: ConvergenceConnection,
              sessionId: string,
              username: string,
              reconnectToken: string) {
    this._domain = domain;
    this._sessionId = sessionId;
    this._username = username;
    this._reconnectToken = reconnectToken;
    this._connection = connection;
    this._authenticated = false;
  }

  /**
   * @returns The ConvergenceDomain for this session
   */
  public domain(): ConvergenceDomain {
    return this._domain;
  }

  /**
   * @returns The sessionId of the connected client
   */
  public sessionId(): string {
    return this._sessionId;
  }

  /**
   * @returns The username of the authenticated client or null if not authenticated
   */
  public username(): string {
    return this._username;
  }

  /**
   * @returns The reconnectToken for the authenticated client or null if not authenticated
   */
  public reconnectToken(): string {
    return this._reconnectToken;
  }

  /**
   * @returns True if the client is authenticated
   */
  public isAuthenticated(): boolean {
    return this._authenticated;
  }

  /**
   * @returns True if the client is connected to the domain
   */
  public isConnected(): boolean {
    return this._connection.isConnected();
  }

  /**
   * @hidden
   * @internal
   */
  public _setAuthenticated(authenticated: boolean): void {
    this._authenticated = authenticated;
  }

  /**
   * @hidden
   * @internal
   */
  public _setSessionId(sessionId: string): void {
    this._sessionId = sessionId;
  }

  /**
   * @hidden
   * @internal
   */
  public _setUsername(username: string): void {
    this._username = username;
  }

  /**
   * @hidden
   * @internal
   */
  public _setReconnectToken(reconnectToken: string): void {
    this._reconnectToken = reconnectToken;
  }

}