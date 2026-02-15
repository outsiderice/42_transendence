import { DBClient } from "../../services/dbClient";
import { User } from "../../services/dbClient";

type findOrCreateGithubUser = {
    githubid: string;
    username: string;
    email: string | null;
    avatar: string;
};

export async function findOrCreateGithubUser(
    input: findOrCreateGithubUser
): Promise<User> {
    const {githubid, username, email, avatar} = input;
    let user = await DBClient.getUserByGithubId(githubid);

    //user already exists
    if (user){
        return user;
    }
    //check if email or username already in use
    if (email) {
        const existingEmail = await DBClient.getUserByEmail(email);
        
        if (existingEmail){
            throw new Error('Email already in use');
		}
    }
    
    if (username) {
        const existingUsername = await DBClient.getUserByUsername(username);
        
        if (existingUsername){
            throw new Error('Username already in use');
		}
    }
    //create new user
    user = await DBClient.createGithubUser({
        username,
        email: email ? email : null,
        password: null,
        githubid,
        avatar,
		nickname:username,
    });
    return user;
}
