"use client"

import type React from "react"

import { useState } from "react"
import "../../Styles/HomePage.css"

export default function Dashboard() {
    const [showModal, setShowModal] = useState(false)
    const [newProfile, setNewProfile] = useState({
        name: '',
        group: '',
        proxy: '',
        platform: 'Chrome',
        siteLink: '', // novo campo
    });


    const [profiles, setProfiles] = useState<any[]>([])

    const handleOpenModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewProfile((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Adiciona o novo perfil à lista existente
        setProfiles((prev) => [...prev, newProfile])

        // Limpa o formulário e fecha o modal
        setNewProfile({
            name: "",
            group: "",
            proxy: "",
            platform: "Chrome",
            siteLink: "", // Limpa o campo de link do site
        })
        setShowModal(false)
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                {/* Logo */}
                <div className="logo-container">
                    <div className="logo-icon">
                        <span>M</span>
                    </div>
                    <h1 className="logo-text">146</h1>
                </div>

                {/* New Profile Button */}
                <div className="new-profile-container">
                    <button className="new-profile-button" onClick={handleOpenModal}>
                        Novo perfil
                        <span className="add-icon">⊕</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <div className="nav-item active">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </span>
                            <span className="nav-text">Perfis</span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M3 12h18M3 18h18" />
                                </svg>
                            </span>
                            <span className="nav-text">Grupos</span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </span>
                            <span className="nav-text">Proxies</span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
                                    <path d="M12 14v6" />
                                    <path d="M8 20h8" />
                                </svg>
                            </span>
                            <span className="nav-text">Extensões</span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </span>
                            <span className="nav-text">Lixeira</span>
                        </div>
                    </div>

                    <div className="nav-section automation-section">
                        <div className="section-header">
                            <span>Automação</span>
                            <span className="dropdown-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                                    <line x1="6" y1="6" x2="6" y2="6" />
                                    <line x1="6" y1="18" x2="6" y2="18" />
                                </svg>
                            </span>
                            <span className="nav-text">Sincronizador</span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </span>
                            <span className="nav-text">RPA</span>
                            <span className="dropdown-icon ml-auto">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>

                        <div className="nav-item">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <span className="nav-text">API</span>
                        </div>
                    </div>
                </nav>

                {/* Premium Banner */}
                <div className="premium-banner">
                    <div className="premium-header">
                        <span className="premium-title">Obtenha mais recursos</span>
                        <span className="premium-icon">🔆</span>
                    </div>
                    <p className="premium-description">
                        Sincronização de dados entre dispositivos, colaboração em equipe e outros recursos avançados.
                    </p>
                    <div className="premium-actions">
                        <button className="btn-outline">Try Free</button>
                        <button className="btn-primary">atualizar</button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="main-header">
                    <div className="header-title">
                        <h2>Perfis</h2>
                    </div>
                    <div className="header-actions">
                        <div className="notification-icon orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </div>
                        <div className="notification-icon blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <button className="download-button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Baixar cliente
                        </button>
                        <button className="menu-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M3 12h18M3 18h18" />
                            </svg>
                        </button>
                        <div className="user-profile">
                            <div className="user-avatar">T</div>
                            <span className="user-name">testborderless...</span>
                            <span className="dropdown-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </header>

                {/* Warning Alert */}
                <div className="warning-alert">
                    <div className="alert-content">
                        <span className="alert-icon">⚠</span>
                        <span className="alert-message">
                            Você não configurou uma senha. Configure-o em "Configurações" o mais rápido possível.
                        </span>
                    </div>
                    <div className="alert-actions">
                        <button className="btn-warning">Definir senha</button>
                        <span className="alert-pagination">1/2</span>
                        <span className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-container">
                        <div className="group-filter">
                            <span>Todos os grupos</span>
                            <span className="dropdown-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                        <div className="search-input-container">
                            <span className="search-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </span>
                            <input type="text" className="search-input" placeholder="Pesquisa ou novos critérios de pesquisa" />
                            <button className="filter-button">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="action-btn open-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        Abrir
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 4v6h-6" />
                            <path d="M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <button className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="profiles-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Grupo</th>
                                <th>Proxy</th>
                                <th>Link</th>
                                <th>Plataforma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile, index) => (
                                <tr key={index}>
                                    <td>{profile.name}</td>
                                    <td>{profile.group}</td>
                                    <td>{profile.proxy}</td>
                                    <td>
                                        {profile.siteLink ? (
                                            <a href={profile.siteLink} target="_blank" rel="noopener noreferrer">
                                                {profile.siteLink}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td>{profile.platform}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Footer */}
                <footer className="main-footer">
                    <div></div>
                    <div className="help-button">
                        <div className="help-icon">?</div>
                    </div>
                </footer>
            </div>

            {/* Modal para Novo Perfil */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Criar Novo Perfil</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="name">Nome do Perfil</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newProfile.name}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                        placeholder="Digite o nome do perfil"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="group">Grupo</label>
                                    <select
                                        id="group"
                                        name="group"
                                        value={newProfile.group}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Selecione um grupo</option>
                                        <option value="Trabalho">Trabalho</option>
                                        <option value="Pessoal">Pessoal</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="proxy">Proxy (opcional)</label>
                                    <input
                                        type="text"
                                        id="proxy"
                                        name="proxy"
                                        value={newProfile.proxy}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="IP:Porta ou deixe em branco"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="siteLink">Link do site</label>
                                    <input
                                        type="url"
                                        id="siteLink"
                                        name="siteLink"
                                        value={newProfile.siteLink}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="https://exemplo.com"
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="platform">Plataforma</label>
                                    <select
                                        id="platform"
                                        name="platform"
                                        value={newProfile.platform}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="Chrome">Chrome</option>
                                        <option value="Firefox">Firefox</option>
                                        <option value="Edge">Edge</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-submit">
                                    Criar Perfil
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
