module.exports = {
    apps: [{
        name: "gerenciador-oticas-front",
        cwd: "/home/m6rc0sp/Documentos/MVL/Nexos App/gerenciador-de-oticas-front",
        script: "node_modules/.bin/vite",
        args: "preview --port 10003 --host 0.0.0.0",
        env_production: {
            NODE_ENV: "production"
        }
    }]
};