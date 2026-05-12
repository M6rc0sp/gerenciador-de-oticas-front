module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/documents/mvl/ns-meu-filtro-front",
        script: "./start.sh",
        interpreter: "bash",
        env_production: {
            NODE_ENV: "production"
        }
    }]
};
