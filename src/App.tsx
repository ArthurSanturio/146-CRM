"use client";

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Components/Header/Header";
import Hero from "./Components/Hero/Hero";
import Features from "./Components/Features/Features";
import Testimonials from "./Components/Testimonials/Testimonials";
import Pricing from "./Components/Pricing/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./Components/Footer/Footer";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
	const [language, setLanguage] = useState("en");
	const { i18n } = useTranslation();

	useEffect(() => {
		const savedLang = localStorage.getItem("language");
		if (savedLang) {
			setLanguage(savedLang);
			i18n.changeLanguage(savedLang);
		} else {
			const browserLang = navigator.languages?.[0] || navigator.language;
			const primaryLang = browserLang.split("-")[0];
			const supportedLanguages = ["en", "pt", "es", "fr", "zh"];
			if (supportedLanguages.includes(primaryLang)) {
				setLanguage(primaryLang);
				i18n.changeLanguage(primaryLang);
				localStorage.setItem("language", primaryLang);
			} else {
				setLanguage("en");
				i18n.changeLanguage("en");
				localStorage.setItem("language", "en");
			}
		}
	}, [i18n]);

	const handleLanguageChange = (newLang: string) => {
		setLanguage(newLang);
		i18n.changeLanguage(newLang);
		localStorage.setItem("language", newLang);
	};

	return (
		<BrowserRouter>
			<div className="app">
				<Routes>
					<Route
						path="/"
						element={
							<>
								<Header
									language={language}
									setLanguage={handleLanguageChange}
								/>
								<main>
									<Hero />
									<Features />
									<Testimonials />
									<Pricing />
								</main>
								<Footer />
							</>
						}
					/>

					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<DashboardPage />} />

					<Route
						path="*"
						element={
							<>
								<Header
									language={language}
									setLanguage={handleLanguageChange}
								/>
								<div className="not-found">
									<h1>{i18n.t("pageNotFound")}</h1>
									<p>{i18n.t("pageNotFoundDescription")}</p>
								</div>
								<Footer />
							</>
						}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
