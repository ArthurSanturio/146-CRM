import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseconfig";
import { useTranslation } from "react-i18next";
import "../../Styles/Auth.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError(t("loginPage.errors.fillAllFields"));
			return;
		}

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Buscar dados do usuário no Firestore
			const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

			if (userDoc.exists()) {
				// Salvar dados do usuário no localStorage para uso posterior
				localStorage.setItem("userData", JSON.stringify(userDoc.data()));
			}

			navigate("/dashboard");
		} catch (err: any) {
			if (
				err.code === "auth/user-not-found" ||
				err.code === "auth/wrong-password"
			) {
				setError(t("loginPage.errors.invalidCredentials"));
			} else {
				setError(t("loginPage.errors.genericError"));
				console.error(err);
			}
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="logo-container">
					<a href="/">
						<img src="/logo.png" alt="Logo" className="logo" />
					</a>
				</div>

				<div className="card">
					<div className="card-header">
						<h2 className="card-title">{t("loginPage.title")}</h2>
						<p className="card-description">{t("loginPage.description")}</p>
					</div>

					{error && <div className="error-message">{error}</div>}

					<div className="card-content">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="email">{t("loginPage.email")}</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={t("loginPage.emailPlaceholder")}
									required
								/>
							</div>

							<div className="form-group">
								<div className="label-row">
									<label htmlFor="password">{t("loginPage.password")}</label>
									<Link to="/forgot-password" className="forgot-password">
										{t("loginPage.forgotPassword")}
									</Link>
								</div>
								<input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("loginPage.passwordPlaceholder")}
									required
								/>
							</div>

							<div className="checkbox-group">
								<input type="checkbox" id="remember" />
								<label htmlFor="remember">{t("loginPage.rememberMe")}</label>
							</div>

							<button type="submit" className="submit-button">
								{t("loginPage.submit")}
							</button>
						</form>

						<div className="card-footer">
							<p>
								{t("loginPage.noAccount")}
								<Link to="/register" className="auth-link">
									{t("loginPage.register")}
								</Link>
							</p>
						</div>
					</div>
				</div>

				<div className="trust-message">
					<p>{t("loginPage.trustMessage")}</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
