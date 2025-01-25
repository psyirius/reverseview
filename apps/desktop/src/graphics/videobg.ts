import {extractFileName} from "@app/common";
import {console} from "@/platform/adapters/air";
import {$RvW} from "@/rvw";

function generateThumbnail(videoPath: air.File, thumbnailPath: air.File): boolean {
    // TODO: Generate thumbnail using ffmpeg

    return true;
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
        const thumbnailLoc = appStorageDir.resolvePath("background/thumbnail/" + clipName + ".png");

        // TODO
        // COPY FILE TO APP STORAGE
        // GENERATE THUMBNAIL & SAVE TO APP STORAGE

        if (!generateThumbnail(clipLoc, thumbnailLoc)) {
            cb(null, new Error("Failed to generate thumbnail for video clip"));
            return;
        }

        // copy clip to app storage
        bgFile.copyTo(clipLoc, true);

        const itemIndex = savedClips.length;

        savedClips.push({
            name: clipName,
            clip: clipLoc.nativePath, // relative path
            thumbnail: thumbnailLoc.nativePath, // relative path
        });

        $RvW.rvwPreferences.set("app.settings.background.video.clips", savedClips);
        $RvW.rvwPreferences.commit();

        cb?.(itemIndex);
    });
    bgFile.browseForOpen("Select a video file", filters);
}