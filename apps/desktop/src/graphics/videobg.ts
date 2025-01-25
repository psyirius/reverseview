import {extractFileName} from "@app/common";
import {console} from "@/platform/adapters/air";
import {$RvW} from "@/rvw";
import {execFFmpeg, getFFmpegPath} from "@/graphics/ffmpeg";

export function getNoClipPlaceholder() {
    const f = air.File.applicationStorageDirectory.resolvePath('assets/images/no-clip-selected.jpg');
    return f.exists ? f.url : null;
}

function generatePreview(videoPath: air.File, cb? : (path?: air.File, err?: any) => void) {
    const ffmpegPath = getFFmpegPath();

    // console.log('FFMPEG', ffmpegPath);

    if (!ffmpegPath || !ffmpegPath.exists) {
        cb(null, new Error("FFmpeg not found"));
        return;
    }

    if (!videoPath.exists) {
        cb(null, new Error("Video file not found"));
        return;
    }

    const fileName = extractFileName(videoPath.nativePath);
    const clipName = fileName.split(".")[0];

    const previewPath = air.File.applicationStorageDirectory.resolvePath(`background/previews/${clipName}.gif`);

    const args = [
        '-hide_banner',
        '-i', videoPath.nativePath,
        // "-ss", "30", // skip first 30 seconds
        "-t", "10", // 10 seconds duration
        "-vf", "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", // filter
        "-frames:v", "100", // 100 frames
        "-y", // overwrite
        previewPath.nativePath,
    ];

    execFFmpeg({
        executable: ffmpegPath.nativePath,
        args,
        onError: (err) => {
            console.error('GENERATE PREVIEW ERROR', err);
        },
        onProgress: (progress) => {
            console.log('GENERATE PREVIEW PROGRESS', progress);
        },
        onCompleted: (exitCode) => {
            console.log('GENERATE PREVIEW COMPLETED', exitCode);

            if (exitCode === 0) {
                cb?.(previewPath);
            } else {
                cb(null, new Error("FFmpeg failed with exit code: " + exitCode));
            }
        }
    });
}

export function browseAndSelectFFmpeg(cb? : (path?: string, err?: any) => void) {
    // @ts-ignore
    const { File, FileFilter, Event } = air;

    const ffmpegFile = new File();

    const filters = [
        new FileFilter("FFmpeg Executable", "ffmpeg.exe"),
        new FileFilter("All Files", "*.*"),
    ];

    ffmpegFile.addEventListener(Event.SELECT, function () {
        cb?.(ffmpegFile.nativePath);
    });

    ffmpegFile.browseForOpen("Select FFmpeg executable", filters);
}

export function browseAndAddVideoClip(cb? : (index?: number, err?: any) => void) {
    // @ts-ignore
    const { File, FileFilter, Event } = air;
    const { applicationStorageDirectory: appStorageDir } = File;

    const bgFile = new File();

    const filters = [
        // all supported video formats
        new FileFilter("All Supported Video Formats", "*.mp4;*.mov;*.mkv"),
        // all files
        new FileFilter("All Files", "*.*"),
    ];

    bgFile.addEventListener(Event.SELECT, function () {
        const fileName = extractFileName(bgFile.nativePath);
        const clipName = fileName.split(".")[0];

        const savedClips = $RvW.rvwPreferences.get("app.settings.background.video.clips", []);

        const clipLoc = appStorageDir.resolvePath("background/" + fileName);

        // TODO
        // COPY FILE TO APP STORAGE
        // GENERATE THUMBNAIL & SAVE TO APP STORAGE

        generatePreview(bgFile, (previewPath: air.File, err) => {
            if (err) {
                // cb(null, new Error("Failed to generate preview for video clip"));
                cb(null, err);
                return;
            }

            // copy clip to app storage
            bgFile.copyTo(clipLoc, true);

            const itemIndex = savedClips.length;

            savedClips.push({
                name: clipName,
                clip: clipLoc.url, // relative path
                preview: previewPath.url, // relative path
            });

            $RvW.rvwPreferences.set("app.settings.background.video.clips", savedClips);
            $RvW.rvwPreferences.commit();

            cb?.(itemIndex);
        });
    });
    bgFile.browseForOpen("Select a video file", filters);
}

export function removeBgClipAtIndex(index: number) {
    const savedClips = $RvW.rvwPreferences.get("app.settings.background.video.clips", []);

    if (index >= 0 && index < savedClips.length) {
        const clip = savedClips[index];

        const clipLoc = air.File.applicationStorageDirectory.resolvePath(clip.clip);

        if (clipLoc.exists) {
            clipLoc.deleteFile();
        }

        const previewLoc = air.File.applicationStorageDirectory.resolvePath(clip.preview);

        if (previewLoc.exists) {
            previewLoc.deleteFile();
        }

        const clips = [...savedClips];
        clips.splice(index, 1);

        $RvW.rvwPreferences.set("app.settings.background.video.clips", clips);
        $RvW.rvwPreferences.commit();
    }
}