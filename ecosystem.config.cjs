module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/documents/mvl/gerenciador-de-oticas-front",
        script: "serve",
        args: ["-s", "dist", "-l", "10003"],
        env_production: {
            NODE_ENV: "production"
        }
    }]
};