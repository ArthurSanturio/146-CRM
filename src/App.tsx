"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./Components/Header/Header"
import Hero from "./Components/Hero/Hero"
import Features from "./Components/Features/Features"
import Testimonials from "./Components/Testimonials/Testimonials"
import Pricing from "./Components/Pricing/Pricing"
import Login from "./Components/Login/Login"
import Register from "./Components/Register/Register"
import Footer from "./Components/Footer/Footer"
import HomePage from "./Components/HomePage/HomePage"
import "./App.css"

function App() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.languages?.[0] || navigator.language
      console.log("Detected browser language:", browserLang)

      const primaryLang = browserLang.split("-")[0]
      const supportedLanguages = ["en", "pt", "es", "fr", "de"]

      if (supportedLanguages.includes(primaryLang)) {
        setLanguage(primaryLang)
      } else {
        setLanguage("en")
      }
    }

    detectBrowserLanguage()
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
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
                  <h1>{language === "pt" ? "Página não encontrada" : "Page not found"}</h1>
                  <p>
                    {language === "pt"
                      ? "A página que você está procurando não existe."
                      : "The page you are looking for does not exist."}
                  </p>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
