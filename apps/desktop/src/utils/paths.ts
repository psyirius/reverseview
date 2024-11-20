const { File } = air;

export const appDir = File.applicationDirectory;

export const appStorageDir = File.applicationStorageDirectory;

export const configFile: File = appStorageDir.resolve('config.xml');