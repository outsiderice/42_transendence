import { DBClient } from "../../services/dbClient";
import { User } from "../../services/dbClient";

type findOrCreateGithubUser = {
    githubId: string;
    username: string;
    email: string | null;
    avatarUrl?: string;
};

export async function findOrCreateGithubUser(
    input: findOrCreateGithubUser
): Promise<User> {
    const {githubId, username, email, avatarUrl} = input;
    let user = await DBClient.getUserbyGithubId(githubId);

    if (user)
        return user;
    
    if (email) {
        const existingEmail = await DBClient.getUserByEmail(email);
        
        if (existingEmail)
            throw new Error('Email already in use');
    }
    
    if (username) {
        const existingUsername = await DBClient.getUserByUsername(username);
        
        if (existingUsername)
            throw new Error('Username already in use');
    }

    user = await DBClient.createUser({
        username: username,
        email: email ?? `,
        avatar: avatarUrl ?? '',
        githubId: githubId,
        password: null,
    });
    return user;
}
