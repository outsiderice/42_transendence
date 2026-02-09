import { WriteStream, createReadStream, createWriteStream } from "fs";
import * as fs from "fs";
import path from "path";
import { Readable } from 'stream';

const   avatarsPath= path.join(__dirname, '../../public/avatars/');

export const avatarService = {

    //is passed the image stream (or whatever) and it's file path from a route controller and returns bool
    async uploadAvatar( file: any , filename: string): Promise<boolean>
    {
        return new Promise ((resolve, reject) => {
            const filepath = avatarsPath + filename;
            const writeStream: WriteStream = createWriteStream(filepath);
            file.file.pipe(writeStream);
            writeStream.on('finish', () => {
                resolve(true);
            });
            writeStream.on('error', () => {
                reject(false);
            });
        });
    },

    //is passed the file path from a route controller and returns bool
    async deleteAvatar(filename: string): Promise<boolean>
    {
        const filepath = avatarsPath + filename;
        fs.unlink(filepath, 
            (err => {
                if (err) {
                    console.log(err);
                    return (false);
                }
                else{
                    console.log("Deleted file: ", filename);
                }
                }
            )
        )
        return (true);
    },

    //is passed the image stream (or whatever) from a route controller and returns bool
    async validateAvatar(mimetype: string): Promise<boolean>
    {
        const allowedTypes = ['image/jpeg', 'image/png'];
        return allowedTypes.includes(mimetype);
    }

}
