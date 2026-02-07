import { WriteStream, createWriteStream } from "fs";

//is passed file path from a route controller and returns image stream
export async function getAvatar(filepath: string): Promise<>
{}

//is passed the image stream (or whatever) and it's file path from a route controller and returns bool
export async function uploadAvatar(filepath: string, data: )
{
}

//is passed the file path from a route controller and returns bool
export async function deleteAvatar(filepath: string)
{}

//is passed the image stream (or whatever) from a route controller and returns bool
export async function validateAvatar(data: any )
{
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(data.mimetype)){
        return (false);
    }
    return (true);
}

