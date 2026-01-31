// import '../index.css';

function LandingPage({ onGetStarted }) {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content fade-in-up">
                    <h1 className="hero-title">
                        <span className="gradient-text">Cashvion</span>
                    </h1>
                    <p className="hero-subtitle" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4b5563', marginTop: '-10px' }}>
                        Expense-Lens your finance buddy
                    </p>
                    <p className="hero-subtitle">
                        Track expenses, set smart budgets, and secure your private spending in a vault only you can open.
                    </p>
                    <div className="hero-cta-group">
                        <button onClick={onGetStarted} className="btn-primary hero-btn">
                            Get Started Free 🚀
                        </button>
                        <button onClick={onGetStarted} className="btn-secondary hero-btn">
                            Login
                        </button>
                    </div>
                </div>
                <div className="hero-visual fade-in-up delay-200">
                    <div className="glass-card float-animation" style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>💰 Budget</span>
                            <span style={{ color: '#10b981' }}>+₹5,000</span>
                        </div>
                        <div style={{ height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: '70%', background: '#6366f1', height: '100%' }}></div>
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
                            70% of monthly limit used
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="feature-card glass-card">
                    <div className="feature-icon">🔒</div>
                    <h3>Private Vault</h3>
                    <p>Keep sensitive transactions hidden behind a password-protected security gate.</p>
                </div>
                <div className="feature-card glass-card">
                    <div className="feature-icon">📊</div>
                    <h3>Smart Analytics</h3>
                    <p>Visual breakdown of your spending habits with real-time budget alerts.</p>
                </div>
                <div className="feature-card glass-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Instant Sync</h3>
                    <p>Access your data from anywhere. Secure, fast, and reliable.</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
