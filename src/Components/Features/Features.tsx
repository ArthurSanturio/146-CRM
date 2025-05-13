const Features = () => {
    const featuresList = [
        {
            id: 1,
            icon: "🛡️",
            title: "Navegador anti-detecção",
            description: "Crie e gerencie vários perfis de navegador com impressões digitais exclusivas para evitar detecção."
        },
        {
            id: 2,
            icon: "🚀",
            title: "Colaboração em Equipe",
            description: "Compartilhe perfis de navegador com segurança com sua equipe e gerencie permissões de acesso."
        },
        {
            id: 3,
            icon: "🔄",
            title: "Automação de Navegador",
            description: "Automatize tarefas repetitivas com nossas poderosas ferramentas de automação e API."
        },
        {
            id: 4,
            icon: "🌐",
            title: "Integração com Proxy",
            description: "Integre facilmente com seus proxies existentes ou compre proxies diretamente pela nossa plataforma."
        },
        {
            id: 5,
            icon: "📱",
            title: "Simulação de Dispositivos Móveis",
            description: "Simule dispositivos móveis com impressões digitais precisas para testes e automações móveis."
        },
        {
            id: 6,
            icon: "🔒",
            title: "Cookies & Armazenamento Local",
            description: "Armazene e gerencie cookies e dados de armazenamento local com segurança em múltiplos perfis."
        }
    ];

    return (
        <section className="features section" id="features">
            <div className="container">
                <h2 className="section-title">Recursos Poderosos</h2>
                <p className="section-subtitle">
                    Todas as ferramentas que você precisa para gerenciar seus perfis de navegador com máxima privacidade e eficiência
                </p>

                <div className="features-grid">
                    {featuresList.map((feature) => (
                        <div className="feature-card" key={feature.id}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
