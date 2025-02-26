import { GameEventType } from "../enums";
import { EventData, GameEvent, GameEventListener } from "../types";

/**
 * Mediator pattern implementation for game events with improved type safety
 */
export default class EventMediator {
  private static instance: EventMediator;
  private readonly listeners: Map<GameEventType, Array<GameEventListener<any>>>;
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.listeners = new Map<GameEventType, Array<GameEventListener<any>>>();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): EventMediator {
    if (!EventMediator.instance) {
      EventMediator.instance = new EventMediator();
    }
    return EventMediator.instance;
  }
  
  /**
   * Register a listener for an event with type safety
   */
  public register<T extends GameEventType>(
    eventType: T, 
    listener: GameEventListener<EventData<T>>
  ): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const eventListeners = this.listeners.get(eventType)!;
    eventListeners.push(listener as GameEventListener<any>);
  }
  
  /**
   * Unregister a listener
   */
  public unregister<T extends GameEventType>(
    eventType: T, 
    listener: GameEventListener<EventData<T>>
  ): void {
    if (!this.listeners.has(eventType)) {
      return;
    }
    
    const eventListeners = this.listeners.get(eventType)!;
    const index = eventListeners.indexOf(listener as GameEventListener<any>);
    
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }
  }
  
  /**
   * Notify all listeners of an event with type safety
   */
  public notify<T extends GameEventType>(
    event: GameEvent<EventData<T>>
  ): void {
    if (!this.listeners.has(event.type)) {
      return;
    }
    
    const eventListeners = this.listeners.get(event.type)!;
    
    for (const listener of eventListeners) {
      listener(event);
    }
  }
}