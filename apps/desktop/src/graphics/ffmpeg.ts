import {$RvW} from "@/rvw";
import {console} from "@/platform/adapters/air";

// gets saved ffmpeg path or from PATH or null
export function getFFmpegPath() {
    const savedPath = $RvW.rvwPreferences.get("app.settings.addons.ffmpeg.path");

    if (!savedPath) {
        return null;
    }

    const file = air.File.applicationDirectory;

    return file.resolvePath(savedPath);
}

export function execFFmpeg({
    executable,
    args,
    onProgress = null,
    onError = null,
    onCompleted = null,
}) {
    // @ts-ignore
    const { NativeProcess, NativeProcessStartupInfo } = window.runtime.flash.desktop;
    // @ts-ignore
    const { NetStatusEvent, ProgressEvent, NativeProcessExitEvent } = window.runtime.flash.events;

    const file = air.File.applicationDirectory;

    const ffmpegExe = file.resolvePath(executable);
    if (!ffmpegExe.exists) {
        return onError(new Error("FFmpeg executable not found"));
    }

    const nsi = new NativeProcessStartupInfo();
    nsi.executable = ffmpegExe;

    const procArgs = new window.runtime['Vector.<String>']();
    procArgs.push(
        ...args,
    )

    nsi.arguments = procArgs;

    const np = new NativeProcess();
    np.addEventListener(NativeProcessExitEvent.EXIT, onExit);
    np.addEventListener(ProgressEvent.STANDARD_ERROR_DATA, onStdErr);
    np.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, onStdOut);

    np.start(nsi);

    function onExit(e) {
        const { exitCode } = e;
        onCompleted?.(exitCode);
    }

    function onStdOut() {
        const stdOut = np.standardOutput;
        const s = stdOut.readUTFBytes(stdOut.bytesAvailable);

        onProgress?.(s);
    }

    function onStdErr() {
        const stdErr = np.standardError;
        const s = stdErr.readUTFBytes(stdErr.bytesAvailable);

        onError?.(s);
    }
}

export function getFFmpegVersion(path: string, cb?: (version?: any, err?: any) => void) {
    const file = air.File.applicationDirectory;
    const ffmpegExe = file.resolvePath(path);

    if (!ffmpegExe.exists) {
        cb(null, new Error("FFmpeg executable not found"));
        return;
    }

    const ffmpegVersionRE = /ffmpeg version (.*?) Copyright \(c\)/;

    let responded = false;

    execFFmpeg({
        executable: ffmpegExe.nativePath,
        args: ['-version'],
        onError: (err) => {
            console.log('Error:', err);
        },
        onCompleted(exitCode) {
            // console.log('Exit code:', exitCode);

            if (!responded) {
                if (exitCode !== 0) {
                    cb(null, new Error(`FFMpeg exited with ${exitCode}`));
                } else {
                    cb(null, new Error("Failed to get FFmpeg version"));
                }

                responded = true;
            }
        },
        onProgress(data) {
            // console.log('Progress:', data);

            if (!data) {
                return;
            }

            const match = ffmpegVersionRE.exec(data);
            if (!match) {
                return;
            }

            const vix = (
                String(match[1]).trim()
            ).split('-');

            cb?.(vix);

            responded = true;
        },
    })
}