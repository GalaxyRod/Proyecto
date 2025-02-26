import { GameErrorType } from "../../enums";

/**
 * Custom error class for game-specific errors
 */
export class GameError extends Error {
    readonly type: GameErrorType;
    readonly originalError?: Error;
    
    /**
     * @param {GameErrorType} type - Error type
     * @param {string} message - Error message
     * @param {Error} originalError - Original error (if wrapping)
     */
    constructor(type: GameErrorType, message: string, originalError?: Error) {
        super(message);
        this.name = 'GameError';
        this.type = type;
        this.originalError = originalError;
        
        // This is needed to make instanceof work with custom errors in TypeScript
        Object.setPrototypeOf(this, GameError.prototype);
    }
}