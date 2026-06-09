const fs = require('fs');
const path = require('path');

function loadConfig() {
    const envPath = path.resolve(__dirname, 'deploy_config.local.env');
    const defaultPath = path.resolve(__dirname, 'deploy_config.env');
    const configPath = fs.existsSync(envPath) ? envPath : defaultPath;

    const config = {};

    // Load from env file
    if (fs.existsSync(configPath)) {
        const lines = fs.readFileSync(configPath, 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
        for (const line of lines) {
            const [k, ...v] = line.split('=');
            config[k.trim()] = v.join('=').trim();
        }
    }

    // Override with process.env (env vars take precedence)
    if (process.env.DEPLOY_HOST) config.DEPLOY_HOST = process.env.DEPLOY_HOST;
    if (process.env.DEPLOY_USERNAME) config.DEPLOY_USERNAME = process.env.DEPLOY_USERNAME;
    if (process.env.DEPLOY_PASSWORD) config.DEPLOY_PASSWORD = process.env.DEPLOY_PASSWORD;
    if (process.env.DEPLOY_DOMAIN) config.DEPLOY_DOMAIN = process.env.DEPLOY_DOMAIN;
    if (process.env.DEPLOY_EMAIL) config.DEPLOY_EMAIL = process.env.DEPLOY_EMAIL;
    if (process.env.DEPLOY_REMOTE_PATH) config.DEPLOY_REMOTE_PATH = process.env.DEPLOY_REMOTE_PATH;

    // Validate required fields
    if (!config.DEPLOY_HOST || !config.DEPLOY_USERNAME || !config.DEPLOY_PASSWORD) {
        console.error('ERROR: Missing required deploy config. Set DEPLOY_HOST, DEPLOY_USERNAME, DEPLOY_PASSWORD in deploy_config.local.env or as environment variables.');
        process.exit(1);
    }

    return config;
}

function getSshConfig() {
    const config = loadConfig();
    return {
        host: config.DEPLOY_HOST,
        username: config.DEPLOY_USERNAME,
        password: config.DEPLOY_PASSWORD
    };
}

module.exports = { loadConfig, getSshConfig };
