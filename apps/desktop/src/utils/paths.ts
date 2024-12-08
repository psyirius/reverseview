const { File } = air;

export const appDir = File.applicationDirectory;

export const appStorageDir = File.applicationStorageDirectory;

// @ts-ignore
export const configFile: File = appStorageDir.resolve('config.xml');