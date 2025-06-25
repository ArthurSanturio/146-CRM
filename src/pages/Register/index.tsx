import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { auth, db } from "../../../firebaseconfig";
import "../../Styles/Auth.css";

const Register = () => {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreed, setAgreed] = useState(false);
	const [error, setError] = useState("");
	const { t } = useTranslation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			setError(t("registerPage.errors.fillAllFields"));
			return;
		}

		if (password !== confirmPassword) {
			setError(t("registerPage.errors.passwordsDoNotMatch"));
			return;
		}

		if (!agreed) {
			setError(t("registerPage.errors.agreeToTerms"));
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Create user document in Firestore
			await setDoc(doc(db, "users", userCredential.user.uid), {
				firstName,
				lastName,
				email,
				role: "user",
				createdAt: serverTimestamp(),
			});

			console.log("User created:", userCredential.user);
			// Redirect to Dashboard after successful registration
			navigate("/dashboard");
		} catch (error: any) {
			console.error("Registration error:", error);
			if (error.code === "auth/email-already-in-use") {
				setError(t("registerPage.errors.emailInUse"));
			} else {
				setError(t("registerPage.errors.genericError"));
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
						<h2 className="card-title">{t("registerPage.title")}</h2>
						<p className="card-description">{t("registerPage.description")}</p>
					</div>

					{error && <div className="error-message">{error}</div>}

					<div className="card-content">
						<form onSubmit={handleSubmit}>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="firstName">
										{t("registerPage.firstName")}
									</label>
									<input
										type="text"
										id="firstName"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										placeholder={t("registerPage.firstNamePlaceholder")}
										required
									/>
								</div>

								<div className="form-group">
									<label htmlFor="lastName">{t("registerPage.lastName")}</label>
									<input
										type="text"
										id="lastName"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										placeholder={t("registerPage.lastNamePlaceholder")}
										required
									/>
								</div>
							</div>

							<div className="form-group">
								<label htmlFor="email">{t("registerPage.email")}</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={t("registerPage.emailPlaceholder")}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="password">{t("registerPage.password")}</label>
								<input
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder={t("registerPage.passwordPlaceholder")}
									required
								/>
							</div>

							<div className="form-group">
								<label htmlFor="confirmPassword">
									{t("registerPage.confirmPassword")}
								</label>
								<input
									type="password"
									id="confirmPassword"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder={t("registerPage.confirmPasswordPlaceholder")}
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
									{t("registerPage.agreeToTerms")}
									<Link to="/terms" className="auth-link">
										{t("registerPage.termsOfService")}
									</Link>
									{t("registerPage.and")}
									<Link to="/privacy" className="auth-link">
										{t("registerPage.privacyPolicy")}
									</Link>
								</label>
							</div>

							<button type="submit" className="submit-button">
								{t("registerPage.submit")}
							</button>
						</form>

						<div className="card-footer">
							<p>
								{t("registerPage.haveAccount")}
								<Link to="/login" className="auth-link">
									{t("registerPage.login")}
								</Link>
							</p>
						</div>
					</div>
				</div>

				<div className="trust-message">
					<p>{t("registerPage.trustMessage")}</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
