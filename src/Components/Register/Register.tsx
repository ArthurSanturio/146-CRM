import { useState } from 'react';
import { Link } from 'react-router-dom';

import "../../Styles/Auth.css";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseconfig';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não correspondem.');
            return;
        }

        if (!agreed) {
            setError('Você precisa concordar com os termos e condições.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuário criado:', userCredential.user);

        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            if (error.code === 'auth/email-already-in-use') {
                setError('Este email já está em uso.');
            } else {
                setError('Erro ao cadastrar. Tente novamente.');
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
                        <h2 className="card-title">Criar uma conta</h2>
                        <p className="card-description">Preencha seus dados para se cadastrar</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="card-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Nome</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Sobrenome</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Seu sobrenome"
                                        required
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="password">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crie uma senha"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua senha"
                                    required
                                />
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <label htmlFor="agree">
                                    Eu concordo com os <Link to="/terms" className="auth-link">Termos de Serviço</Link> e a <Link to="/privacy" className="auth-link">Política de Privacidade</Link>
                                </label>
                            </div>

                            <button type="submit" className="submit-button">
                                Criar Conta
                            </button>
                        </form>

                        <div className="card-footer">
                            <p>Já tem uma conta? <Link to="/login" className="auth-link">Entrar</Link></p>
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

export default Register;