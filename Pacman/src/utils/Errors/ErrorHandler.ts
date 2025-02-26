import { GameErrorType } from "../../enums";
import { GameError } from "./GameError";

/**
 * Error handler utility
 */
export default class ErrorHandler {
    /**
     * Log an error with appropriate details
     * @param {GameError|Error} error - Error to log
     */
    static logError(error: GameError | Error): void {
        if (error instanceof GameError) {
            console.error(`[${GameErrorType[error.type]}] ${error.message}`);
            
            if (error.originalError) {
                console.error('Original error:', error.originalError);
            }
        } else {
            console.error('Unhandled error:', error);
        }
    }
    
    /**
     * Wrap and transform a standard error into a GameError
     * @param {Error} error - Original error
     * @param {GameErrorType} type - Error type
     * @param {string} message - Custom message (optional)
     * @returns {GameError} Game error
     */
    static wrapError(error: Error, type: GameErrorType, message?: string): GameError {
        return new GameError(
            type,
            message ?? `${GameErrorType[type]}: ${error.message}`,
            error
        );
    }
    
    /**
     * Handle a fetch error specifically
     * @param {Error} error - Fetch error
     * @param {string} resourcePath - Path that was being fetched
     * @returns {GameError} Game error
     */
    static handleFetchError(error: Error, resourcePath: string): GameError {
        return new GameError(
            GameErrorType.NetworkError,
            `Failed to fetch resource '${resourcePath}': ${error.message}`,
            error
        );
    }
    
    /**
     * Handle a level loading error
     * @param {Error} error - Original error
     * @param {string} levelPath - Level path
     * @returns {GameError} Game error
     */
    static handleLevelLoadError(error: Error, levelPath: string): GameError {
        return new GameError(
            GameErrorType.LevelLoadError,
            `Failed to load level '${levelPath}': ${error.message}`,
            error
        );
    }
}