import '../../App.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
                <nav className="footer-nav">
                    <a href="#hero">Início</a>
                    <a href="#features">Recursos</a>
                    <a href="#testimonials">Depoimentos</a>
                    <a href="#pricing">Preços</a>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
