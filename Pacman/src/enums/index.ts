/**
 * Error types for the game
 */
export enum GameErrorType {
    // Resource loading errors
    LevelLoadError,
    AudioLoadError,
    ImageLoadError,

    // Game logic errors
    InvalidStateError,
    CollisionError,
    PathfindingError,

    // System errors
    InitializationError,
    RenderError,
    NetworkError,
    
    // Data storage errors
    DataStorageError
}

/**
 * Event types for the game
 */
export enum GameEventType {
    // Score events
    ScoreChanged,
    GhostEaten,
    FruitCollected,
    HighScoreAdded,

    // Game state events
    GameStarted,
    GamePaused,
    GameResumed,
    GameOver,
    LevelCompleted,

    // Entity events
    PacmanMoved,
    PacmanDied,
    GhostScared,
    GhostRecovered,
    DotCollected,
    PelletCollected,
    GhostCollided,
    PowerModeEnded,

    // UI events
    ShowPath,
    HidePath,
    ShowNameInput,
    ShowHighScores,

    // Level events
    LevelLoaded
}

/**
 * Different game states
 */
export enum GameStatus {
    Loading,      // Game is loading resources
    Playing,      // Game is in progress
    Paused,       // Game is paused
    GameOver,     // Game over (player lost)
    Victory,      // Player won
    NameInput,    // Player is entering name for high score
    HighScores    // Showing high scores
}

/**
* Input action types
*/
export enum InputAction {
    MOVE_UP,
    MOVE_DOWN,
    MOVE_LEFT,
    MOVE_RIGHT,
    PAUSE,
    ACTION
}