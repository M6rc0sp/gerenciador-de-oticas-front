module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/m6rc0sp/Documentos/MVL/Nexos App/gerenciador-de-oticas-front", // Certifique-se de que este caminho está correto no seu servidor
        script: "npm",
        args: "run serve",
        env_production: {
            NODE_ENV: "production"
        }
    }]
};