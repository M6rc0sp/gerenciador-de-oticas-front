module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/m6rc0sp/Documentos/MVL/Nexos App/gerenciador-de-oticas-front",
        script: "serve",
        args: "-s dist -l 10003",
        env_production: {
            NODE_ENV: "production"
        }
    }]
};