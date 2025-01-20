/**
 * A simple stopwatch class.
 */
class Stopwatch {
    /**
     * The timestamp when the stopwatch was started.
     */
    private startTime: number = 0;

    /**
     * The timestamp when the stopwatch was stopped.
     */
    private stopTime: number = 0;

    /**
     * Starts the stopwatch.
     */
    start() {
        this.startTime = Date.now();
    }

    /**
     * Stops the stopwatch.
     */
    stop() {
        this.stopTime = Date.now();
    }

    /**
     * Resets the stopwatch, setting both start and stop times to 0.
     */
    reset() {
        this.startTime = 0;
        this.stopTime = 0;
    }

    /**
     * Calculates the time difference between when the stopwatch was started and stopped.
     * Logs the time difference with a custom message to the console.
     *
     * @returns The time difference in milliseconds or 0 if not started/stopped.
     */
    delta(): number {
        this.stop();
        return this.stopTime - this.startTime;
    }
}