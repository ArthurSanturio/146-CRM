const Testimonials = () => {
    const testimonialsList = [
        {
            id: 1,
            text: "O AdsPower transformou completamente a forma como gerenciamos nossas campanhas de marketing. O navegador anti-detect nos economizou incontáveis horas e aumentou nossas taxas de conversão em 40%.",
            name: "Sarah Johnson",
            role: "Gerente de Marketing Digital",
            avatar: "/testimonial-1.png"
        },
        {
            id: 2,
            text: "Como dono de um negócio de e-commerce, preciso de ferramentas confiáveis para gerenciar várias contas. O AdsPower é a solução mais robusta que encontrei, com um excelente suporte ao cliente.",
            name: "Michael Chen",
            role: "Empreendedor de E-commerce",
            avatar: "/testimonial-2.png"
        },
        {
            id: 3,
            text: "Os recursos de colaboração em equipe foram um divisor de águas para nossa agência. Podemos compartilhar perfis facilmente e gerenciar contas de clientes de forma segura, sem complicação.",
            name: "Jessica Rodriguez",
            role: "Proprietária de Agência",
            avatar: "/testimonial-3.png"
        }
    ];

    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <h2 className="section-title">O Que Nossos Clientes Dizem</h2>
                <p className="section-subtitle">
                    Milhares de profissionais e empresas confiam no AdsPower para proteger sua identidade online
                </p>

                <div className="testimonials-grid">
                    {testimonialsList.map((testimonial) => (
                        <div className="testimonial-card" key={testimonial.id}>
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="testimonial-avatar"
                                />
                                <div className="testimonial-info">
                                    <h4>{testimonial.name}</h4>
                                    <p>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
