import { InputAction } from "../../enums";
import { DEFAULT_CONFIG, InputConfig } from "../../types";

/**
 * Interface for action handlers
 */
export type ActionHandler = (action: InputAction) => void;

/**
 * Maps hardware inputs to game actions
 */
export default class InputManager {
  private readonly actionHandlers: Map<InputAction, ActionHandler[]>;
  private readonly keyToActionMap: Map<string, InputAction>;
  private readonly touchButtons: Map<string, HTMLElement | null>;
  private isTouchEnabled: boolean;

  /**
   * @param {InputConfig} config - Key configuration to use
   * @param {boolean} enableTouch - Whether to enable touch controls
   */
  constructor(config: InputConfig = DEFAULT_CONFIG, enableTouch: boolean = false) {
    this.actionHandlers = new Map<InputAction, ActionHandler[]>();
    this.keyToActionMap = new Map<string, InputAction>();
    this.touchButtons = new Map<string, HTMLElement | null>();
    this.isTouchEnabled = enableTouch;

    // Initialize action handlers
    Object.values(InputAction)
      .filter(v => typeof v === 'number')
      .forEach(action => {
        this.actionHandlers.set(action as InputAction, []);
      });

    // Configure key mappings
    this.configureKeyMappings(config);
    
    // Set up event listeners
    this.setupListeners();
    
    if (this.isTouchEnabled) {
      this.setupTouchControls();
    }
  }

  /**
   * Configure key to action mappings
   */
  private configureKeyMappings(config: InputConfig): void {
    this.keyToActionMap.clear();
    
    // Map keys to actions
    this.keyToActionMap.set(config.up, InputAction.MOVE_UP);
    this.keyToActionMap.set(config.down, InputAction.MOVE_DOWN);
    this.keyToActionMap.set(config.left, InputAction.MOVE_LEFT);
    this.keyToActionMap.set(config.right, InputAction.MOVE_RIGHT);
    
    if (config.pause) {
      this.keyToActionMap.set(config.pause, InputAction.PAUSE);
    }
    
    if (config.action) {
      this.keyToActionMap.set(config.action, InputAction.ACTION);
    }
  }

  /**
   * Set up keyboard event listeners
   */
  private setupListeners(): void {
    document.addEventListener('keydown', (event) => {
      const action = this.keyToActionMap.get(event.key);
      if (action !== undefined) {
        this.triggerAction(action);
        event.preventDefault();
      }
    }, false);
  }
  
  /**
   * Setup touch controls
   */
  private setupTouchControls(): void {
    // Find touch control elements if they exist
    this.touchButtons.set('up', document.getElementById('touch-up'));
    this.touchButtons.set('down', document.getElementById('touch-down'));
    this.touchButtons.set('left', document.getElementById('touch-left'));
    this.touchButtons.set('right', document.getElementById('touch-right'));
    this.touchButtons.set('action', document.getElementById('touch-action'));
    this.touchButtons.set('pause', document.getElementById('touch-pause'));
    
    // Map touch buttons to actions
    const touchToActionMap = new Map<string, InputAction>([
      ['up', InputAction.MOVE_UP],
      ['down', InputAction.MOVE_DOWN],
      ['left', InputAction.MOVE_LEFT],
      ['right', InputAction.MOVE_RIGHT],
      ['action', InputAction.ACTION],
      ['pause', InputAction.PAUSE]
    ]);
    
    // Add touch event listeners
    this.touchButtons.forEach((element, touchKey) => {
      if (element && touchToActionMap.has(touchKey)) {
        element.addEventListener('touchstart', (e) => {
          e.preventDefault();
          const action = touchToActionMap.get(touchKey);
          if (action !== undefined) {
            this.triggerAction(action);
          }
        });
      }
    });
  }

  /**
   * Register an action handler
   */
  registerActionHandler(action: InputAction, handler: ActionHandler): void {
    const handlers = this.actionHandlers.get(action);
    if (handlers) {
      handlers.push(handler);
    }
  }

  /**
   * Trigger all handlers for an action
   */
  private triggerAction(action: InputAction): void {
    const handlers = this.actionHandlers.get(action);
    if (handlers) {
      handlers.forEach(handler => handler(action));
    }
  }

  /**
   * Register movement handlers for an entity
   */
  registerMovementHandlers(entity: { move: (direction: string) => void }): void {
    this.registerActionHandler(InputAction.MOVE_UP, () => entity.move('UP'));
    this.registerActionHandler(InputAction.MOVE_DOWN, () => entity.move('DOWN'));
    this.registerActionHandler(InputAction.MOVE_LEFT, () => entity.move('LEFT'));
    this.registerActionHandler(InputAction.MOVE_RIGHT, () => entity.move('RIGHT'));
  }
  
  /**
   * Register a pause handler
   */
  registerPauseHandler(pauseHandler: () => void): void {
    this.registerActionHandler(InputAction.PAUSE, () => pauseHandler());
  }
  
  /**
   * Register an action handler
   */
  registerGeneralActionHandler(actionHandler: () => void): void {
    this.registerActionHandler(InputAction.ACTION, () => actionHandler());
  }
  
  /**
   * Change input configuration
   */
  changeConfiguration(newConfig: InputConfig): void {
    this.configureKeyMappings(newConfig);
  }
  
  /**
   * Enable touch controls
   */
  enableTouch(): void {
    if (!this.isTouchEnabled) {
      this.isTouchEnabled = true;
      this.setupTouchControls();
    }
  }

  /**
   * Disable touch controls
   */
  disableTouch(): void {
    this.isTouchEnabled = false;
  }
}