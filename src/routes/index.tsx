import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../Components/Header/Header";
import Hero from "../Components/Hero/Hero";
import Features from "../Components/Features/Features";
import Testimonials from "../Components/Testimonials/Testimonials";
import Pricing from "../Components/Pricing/Pricing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Footer from "../Components/Footer/Footer";
import HomePage from "../pages/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

interface AppRoutesProps {
	language: string;
	setLanguage: (lang: string) => void;
}

const AppRoutes = ({ language, setLanguage }: AppRoutesProps) => {
	const { i18n } = useTranslation();

	return (
		<Routes>
			<Route
				path="/"
				element={
					<>
						<Header language={language} setLanguage={setLanguage} />
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
			<Route path="/home" element={<HomePage />} />

			<Route
				path="*"
				element={
					<>
						<Header language={language} setLanguage={setLanguage} />
						<div className="not-found">
							<h1>{i18n.t("pageNotFound")}</h1>
							<p>{i18n.t("pageNotFoundDescription")}</p>
						</div>
						<Footer />
					</>
				}
			/>
		</Routes>
	);
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "*",
				element: <div>Not Found</div>,
			},
		],
	},
]);
export default AppRoutes;
