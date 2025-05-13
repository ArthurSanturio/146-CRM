import { useState } from 'react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 1,
      name: "Individual",
      monthlyPrice: 19,
      yearlyPrice: 190,
      popular: false,
      features: [
        "5 perfis de navegador",
        "Proteção básica de impressões digitais",
        "Gerenciamento de cookies",
        "Suporte básico a proxies",
        "Suporte por e-mail"
      ]
    },
    {
      id: 2,
      name: "Equipe",
      monthlyPrice: 49,
      yearlyPrice: 490,
      popular: true,
      features: [
        "20 perfis de navegador",
        "Proteção avançada de impressões digitais",
        "Colaboração em equipe",
        "Acesso à API",
        "Suporte personalizado a proxies",
        "Suporte por e-mail prioritário",
        "Ferramentas de automação"
      ]
    },
    {
      id: 3,
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      popular: false,
      features: [
        "Perfis de navegador ilimitados",
        "Proteção premium de impressões digitais",
        "Gerenciamento avançado de equipe",
        "Acesso completo à API",
        "Automação avançada",
        "Integrações personalizadas",
        "Suporte prioritário 24/7",
        "Gerente de conta dedicado"
      ]
    }
  ];

  return (
    <section className="pricing section" id="pricing">
      <div className="container">
        <h2 className="section-title section-title2">Preços Simples e Transparentes</h2>
        <p className="section-subtitle2">
          Escolha o plano que atenda às suas necessidades. Todos os planos vêm com uma avaliação gratuita de 14 dias.
        </p>

        <div className="pricing-toggle">
          <span
            className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Mensal
          </span>
          <span className="toggle-label">|</span>
          <span
            className={`toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Anual (Economize 20%)
          </span>
        </div>

        <div className="pricing-plans">
          {plans.map((plan) => (
            <div
              className={`pricing-plan ${plan.popular ? 'popular' : ''}`}
              key={plan.id}
            >
              {plan.popular && <div className="popular-badge">Mais Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                R${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                <span>/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <a href="/" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} plan-cta`}>
                Comece Agora
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
