import {execFFmpeg, getFFmpegPath} from "@/graphics/ffmpeg";
import {extractFileName} from "@app/common";
import {console} from "@/platform/adapters/air";

export function getNoImagePlaceholder() {
    const f = air.File.applicationStorageDirectory.resolvePath('assets/images/no-image-selected.jpg');
    return f.exists ? f.url : null;
}

function generateThumbnail(imagePath: air.File, cb? : (path?: air.File, err?: any) => void) {
    const ffmpegPath = getFFmpegPath();

    // console.log('FFMPEG', ffmpegPath);

    if (!ffmpegPath || !ffmpegPath.exists) {
        cb(null, new Error("FFmpeg not found"));
        return;
    }

    if (!imagePath.exists) {
        cb(null, new Error("Image file not found"));
        return;
    }

    const fileName = extractFileName(imagePath.nativePath);
    const clipName = fileName.split(".")[0];

    const thumbnailPath = air.File.applicationStorageDirectory.resolvePath(`background/thumbnails/${clipName}.jpg`);

    const args = [
        '-hide_banner',
        '-i', imagePath.nativePath,
        "-vf", "scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse", // filter
        "-y", // overwrite
        thumbnailPath.nativePath,
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
                cb?.(thumbnailPath);
            } else {
                cb(null, new Error("FFmpeg failed with exit code: " + exitCode));
            }
        }
    });
}