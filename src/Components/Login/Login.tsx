import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseconfig';
import "../../Styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Email ou senha incorretos.');
            } else {
                setError('Ocorreu um erro ao fazer login.');
                console.error(err);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo-container">
                    <a href="/"><img src="/logo.png" alt="Logo" className="logo" /></a>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Entrar na sua conta</h2>
                        <p className="card-description">Digite seus dados para acessar o sistema</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="card-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div className="label-row">
                                    <label htmlFor="password">Senha</label>
                                    <Link to="/forgot-password" className="forgot-password">Esqueceu a senha?</Link>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    required
                                />
                            </div>

                            <div className="checkbox-group">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Mantenha-me conectado</label>
                            </div>

                            <button type="submit" className="submit-button">
                                Entrar
                            </button>
                        </form>

                        <div className="card-footer">
                            <p>Não tem uma conta? <Link to="/register" className="auth-link">Cadastre-se</Link></p>
                        </div>
                    </div>
                </div>

                <div className="trust-message">
                    <p>Seus dados estão seguros conosco</p>
                </div>
            </div>
        </div>
    );
};

export default Login;