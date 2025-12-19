import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Text, Spinner, Card, Button } from '@nimbus-ds/components';
// Importar o axios diretamente, não o do app que tem configuração do Nexo
import axiosStandard from 'axios';

const Install: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('Processando instalação...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleInstall = async () => {
            try {
                // Extrair o código da query string
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');

                if (code) {
                    console.log('Iniciando instalação com código:', code);
                    setStatus('loading');
                    setMessage('Conectando ao servidor de instalação...');

                    // Fazer a chamada para o endpoint da API via proxy
                    const response = await axiosStandard.get(`/ns/install?code=${code}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('Instalação finalizada:', response);

                    setStatus('success');
                    setMessage('Instalação concluída com sucesso! Redirecionando de volta pra loja...');

                    // Redirecionar para a página de login da Nuvemshop após a instalação
                    setTimeout(() => {
                        window.location.href = 'http://nuvemshop.com.br/login';
                    }, 3000);
                } else {
                    console.error('Código de instalação não encontrado');
                    setStatus('error');
                    setMessage('Erro: Código de instalação não encontrado');
                }
            } catch (error: any) {
                console.error('Erro durante o processo de instalação:', error);
                setStatus('error');
                setMessage(`Erro durante instalação: ${error.message || 'Falha na conexão'}`);
            }
        };

        handleInstall();
    }, [location, navigate]);

    return (
        <Box
            height="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="4"
            backgroundColor="primary-surface"
        >
            <Card padding="small">
                <Box marginBottom="4">
                    <Text fontWeight="bold">Instalação do Aplicativo</Text>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap="4"
                    padding="4"
                >
                    {status === 'loading' && <Spinner size="medium" />}

                    <Text
                        textAlign="center"
                        fontWeight={status === 'error' ? 'bold' : 'regular'}
                    >
                        {message}
                    </Text>
                </Box>
                {status === 'error' && (
                    <Box display="flex" gap="2" justifyContent="flex-end">
                        <Button
                            appearance="primary"
                            onClick={() => (window.location.href = 'http://nuvemshop.com.br/login')}
                        >
                            Ir para login
                        </Button>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default Install;
