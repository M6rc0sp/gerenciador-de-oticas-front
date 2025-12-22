module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/documents/mvl/gerenciador-de-oticas-front",
        script: "./start.sh",
        interpreter: "bash",
        env_production: {
            NODE_ENV: "production"
        }
    }]
};