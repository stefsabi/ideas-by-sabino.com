// Showcases page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Project detail modal
    const modal = document.getElementById('projectModal');
    const projectDetail = document.getElementById('projectDetail');
    const expandButtons = document.querySelectorAll('.project-expand');
    const closeButton = document.querySelector('.modal-close');
    
    // Project data
    const projectData = {
        1: {
            title: 'Sustainable Tech Startup',
            categories: ['UX', 'Branding'],
            image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Komplette Markenidentität und UX-Strategie für ein nachhaltiges Technologie-Startup. Von der Konzeption bis zur digitalen Umsetzung.',
            details: `
                <h2>Sustainable Tech Startup</h2>
                <img src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Sustainable Tech Startup" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">UX</span>
                    <span class="category">Branding</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein innovatives Startup im Bereich nachhaltiger Technologien benötigte eine komplette Markenidentität und digitale Präsenz, um sich in einem umkämpften Markt zu positionieren.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer authentischen Markenidentität, die Nachhaltigkeit und Innovation vereint. Gestaltung einer intuitiven Website mit klarer Informationsarchitektur und optimierter User Experience.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine starke Markenidentität, die das Vertrauen der Zielgruppe gewinnt und eine Website, die Conversion-Raten um 40% steigerte.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Markenidentität & Logo-Design</li>
                    <li>UX/UI Design</li>
                    <li>Website-Entwicklung</li>
                    <li>Content-Strategie</li>
                </ul>
            `
        },
        2: {
            title: 'E-Commerce Platform',
            categories: ['Webdesign', 'UX'],
            image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Redesign einer E-Commerce-Plattform mit Fokus auf Conversion-Optimierung und intuitive Nutzererfahrung.',
            details: `
                <h2>E-Commerce Platform</h2>
                <img src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="E-Commerce Platform" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Webdesign</span>
                    <span class="category">UX</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Eine etablierte E-Commerce-Plattform hatte niedrige Conversion-Raten und hohe Abbruchquoten im Checkout-Prozess.</p>
                
                <h3>Lösung</h3>
                <p>Komplettes UX-Audit und Redesign mit Fokus auf vereinfachte Navigation, optimierten Checkout-Prozess und mobile-first Ansatz.</p>
                
                <h3>Ergebnis</h3>
                <p>Steigerung der Conversion-Rate um 65% und Reduzierung der Checkout-Abbrüche um 45%.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>UX-Audit & Research</li>
                    <li>Wireframing & Prototyping</li>
                    <li>UI Design</li>
                    <li>A/B Testing</li>
                </ul>
            `
        },
        3: {
            title: 'Organic Food Brand',
            categories: ['Branding'],
            image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Entwicklung einer authentischen Markenidentität für einen Bio-Lebensmittelhersteller mit regionalem Fokus.',
            details: `
                <h2>Organic Food Brand</h2>
                <img src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Organic Food Brand" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Branding</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein regionaler Bio-Lebensmittelhersteller wollte seine Marke modernisieren und gleichzeitig die Authentizität und Tradition bewahren.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer warmen, natürlichen Markenidentität, die Tradition und Moderne verbindet. Fokus auf Storytelling und regionale Verbundenheit.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine starke Markenidentität, die die Wiedererkennung um 80% steigerte und neue Zielgruppen erschloss.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Brand Strategy</li>
                    <li>Logo & Visual Identity</li>
                    <li>Packaging Design</li>
                    <li>Brand Guidelines</li>
                </ul>
            `
        },
        4: {
            title: 'Healthcare App',
            categories: ['UX', 'Webdesign'],
            image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'UX-Design für eine Gesundheits-App mit komplexen Datenvisualisierungen und barrierefreier Bedienung.',
            details: `
                <h2>Healthcare App</h2>
                <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Healthcare App" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">UX</span>
                    <span class="category">Webdesign</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Eine Gesundheits-App sollte komplexe medizinische Daten verständlich darstellen und dabei höchste Accessibility-Standards erfüllen.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer intuitiven Benutzeroberfläche mit klaren Datenvisualisierungen und vollständiger Barrierefreiheit nach WCAG 2.1 AA.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine benutzerfreundliche App, die von Ärzten und Patienten gleichermaßen geschätzt wird und alle Accessibility-Standards erfüllt.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>User Research</li>
                    <li>Information Architecture</li>
                    <li>Accessibility Design</li>
                    <li>Data Visualization</li>
                </ul>
            `
        },
        5: {
            title: 'Creative Agency',
            categories: ['Branding', 'Webdesign'],
            image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Rebranding und Website-Relaunch für eine etablierte Kreativagentur mit internationaler Ausrichtung.',
            details: `
                <h2>Creative Agency</h2>
                <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Creative Agency" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Branding</span>
                    <span class="category">Webdesign</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Eine etablierte Kreativagentur benötigte ein komplettes Rebranding, um ihre internationale Expansion zu unterstützen.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer modernen, flexiblen Markenidentität und einer Portfolio-Website, die die kreative Exzellenz der Agentur widerspiegelt.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine zeitgemäße Markenidentität und Website, die zu 30% mehr Anfragen und erfolgreicher internationaler Expansion führte.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Rebranding Strategy</li>
                    <li>Visual Identity System</li>
                    <li>Website Design & Development</li>
                    <li>Portfolio Presentation</li>
                </ul>
            `
        },
        6: {
            title: 'Financial Dashboard',
            categories: ['UX'],
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Komplexe Finanzinformationen verständlich aufbereitet - UX-Design für ein B2B-Dashboard mit hohen Sicherheitsanforderungen.',
            details: `
                <h2>Financial Dashboard</h2>
                <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Financial Dashboard" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">UX</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein Fintech-Unternehmen benötigte ein Dashboard, das komplexe Finanzdaten übersichtlich darstellt und höchste Sicherheitsstandards erfüllt.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer intuitiven Benutzeroberfläche mit personalisierbaren Dashboards, klaren Datenvisualisierungen und nahtloser Security-Integration.</p>
                
                <h3>Ergebnis</h3>
                <p>Ein benutzerfreundliches Dashboard, das die Effizienz der Nutzer um 50% steigerte und alle Compliance-Anforderungen erfüllt.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>UX Research & Strategy</li>
                    <li>Dashboard Design</li>
                    <li>Data Visualization</li>
                    <li>Security UX</li>
                </ul>
            `
        }
    };
    
    // Handle project expand buttons
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                projectDetail.innerHTML = project.details;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});