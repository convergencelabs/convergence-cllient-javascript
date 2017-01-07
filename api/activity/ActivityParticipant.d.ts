export declare class ActivityParticipant {
  public username(): string;

  public sessionId(): string;

  public state(): Map<string, any>;
  public state(key?: string): any;

  public isLocal(): boolean;
}
