export const config = {
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: process.env.DISCORD_REDIRECT_URI,
    },
    mongodb: {
        uri: process.env.MONGODB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://serverforge.xyz',
};

export const validateConfig = () => {
    const missing = [];
    if (!config.discord.clientId) missing.push('DISCORD_CLIENT_ID');
    if (!config.discord.redirectUri) missing.push('DISCORD_REDIRECT_URI');
    if (!config.mongodb.uri) missing.push('MONGODB_URI');
    if (!config.jwt.secret) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
};
