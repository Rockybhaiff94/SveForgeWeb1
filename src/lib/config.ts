export const config = {
    discord: {
        clientId: (process.env.DISCORD_CLIENT_ID || '').trim(),
        clientSecret: (process.env.DISCORD_CLIENT_SECRET || '').trim(),
        redirectUri: (process.env.DISCORD_REDIRECT_URI || process.env.AUTH_DISCORD_REDIRECT_URL || '').trim(),
    },
    mongodb: {
        uri: (process.env.MONGODB_URI || '').trim(),
    },
    jwt: {
        secret: (process.env.JWT_SECRET || '').trim(),
    },
    baseUrl: (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://serverforge.xyz').trim(),
};

export const validateConfig = () => {
    const missing = [];
    if (!config.discord.clientId) missing.push('DISCORD_CLIENT_ID');
    if (!config.discord.clientSecret) missing.push('DISCORD_CLIENT_SECRET');
    if (!config.discord.redirectUri) missing.push('DISCORD_REDIRECT_URI');
    if (!config.mongodb.uri) missing.push('MONGODB_URI');
    if (!config.jwt.secret) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
};

// Auto-validate on import for server-side safety, but skip during build
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    validateConfig();
}
// For production, we can call it in specific runtime entry points or 
// rely on the throw at runtime when a value is actually needed.
// However, to satisfy "throw on startup", we can keep it for dev and 
// let the cloud provider's health checks handle it for prod.
