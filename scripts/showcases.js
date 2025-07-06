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
            categories: ['Branding', 'Webdesign'],
            image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Komplette Markenidentität und Webauftritt für ein nachhaltiges Technologie-Startup. Von der Konzeption bis zur digitalen Umsetzung.',
            details: `
                <h2>Sustainable Tech Startup</h2>
                <img src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Sustainable Tech Startup" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Branding</span>
                    <span class="category">Webdesign</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein innovatives Startup im Bereich nachhaltiger Technologien benötigte eine komplette Markenidentität und professionelle Website, um sich in einem umkämpften Markt zu positionieren.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer authentischen Markenidentität, die Nachhaltigkeit und Innovation vereint. Gestaltung einer responsiven Website mit klarer Struktur und modernem Design.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine starke Markenidentität, die das Vertrauen der Zielgruppe gewinnt und eine professionelle Website, die neue Kunden erfolgreich akquiriert.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Markenidentität & Logo-Design</li>
                    <li>Responsive Webdesign</li>
                    <li>Website-Entwicklung</li>
                    <li>Content-Strategie</li>
                </ul>
            `
        },
        2: {
            title: 'E-Commerce Platform',
            categories: ['Webdesign', 'Online Marketing'],
            image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Redesign einer E-Commerce-Plattform mit Fokus auf Conversion-Optimierung und Online-Marketing-Integration.',
            details: `
                <h2>E-Commerce Platform</h2>
                <img src="https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="E-Commerce Platform" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Webdesign</span>
                    <span class="category">Online Marketing</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Eine etablierte E-Commerce-Plattform hatte niedrige Conversion-Raten und benötigte eine bessere Integration von Marketing-Tools.</p>
                
                <h3>Lösung</h3>
                <p>Komplettes Redesign mit Fokus auf vereinfachte Navigation, optimierten Checkout-Prozess und Integration von Marketing-Automation.</p>
                
                <h3>Ergebnis</h3>
                <p>Steigerung der Conversion-Rate um 65% und erfolgreiche Integration von E-Mail-Marketing und Retargeting-Kampagnen.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>E-Commerce Webdesign</li>
                    <li>Conversion-Optimierung</li>
                    <li>Marketing-Automation Setup</li>
                    <li>Performance-Tracking</li>
                </ul>
            `
        },
        3: {
            title: 'Organic Food Brand',
            categories: ['Branding', 'Printdesign'],
            image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Entwicklung einer authentischen Markenidentität und Printmaterialien für einen Bio-Lebensmittelhersteller mit regionalem Fokus.',
            details: `
                <h2>Organic Food Brand</h2>
                <img src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Organic Food Brand" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Branding</span>
                    <span class="category">Printdesign</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein regionaler Bio-Lebensmittelhersteller wollte seine Marke modernisieren und benötigte professionelle Printmaterialien für den Vertrieb.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer warmen, natürlichen Markenidentität mit umfassendem Printdesign-Paket: Verpackungen, Broschüren, Flyer und Verkaufsmaterialien.</p>
                
                <h3>Ergebnis</h3>
                <p>Eine starke Markenidentität mit professionellen Printmaterialien, die die Wiedererkennung um 80% steigerte und neue Vertriebskanäle erschloss.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Brand Strategy</li>
                    <li>Logo & Visual Identity</li>
                    <li>Packaging Design</li>
                    <li>Broschüren & Flyer</li>
                    <li>Verkaufsmaterialien</li>
                </ul>
            `
        },
        4: {
            title: 'Digital Marketing Campaign',
            categories: ['Online Marketing', 'Webdesign'],
            image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Umfassende Online-Marketing-Kampagne mit Landing Pages, Social Media Content und SEO-optimierten Visuals.',
            details: `
                <h2>Digital Marketing Campaign</h2>
                <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Healthcare App" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Online Marketing</span>
                    <span class="category">Webdesign</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein Technologie-Unternehmen benötigte eine umfassende Online-Marketing-Strategie zur Markteinführung eines neuen Produkts.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer 360°-Marketing-Kampagne mit Landing Pages, Social Media Content, Google Ads und Newsletter-Design für maximale Reichweite.</p>
                
                <h3>Ergebnis</h3>
                <p>Erfolgreiche Produkteinführung mit 300% Steigerung der Website-Besucher und 150% mehr qualifizierte Leads innerhalb von 3 Monaten.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Landing Page Design</li>
                    <li>Social Media Content</li>
                    <li>Google Ads Kampagnen</li>
                    <li>Newsletter Design</li>
                    <li>SEO-Visuals</li>
                </ul>
            `
        },
        5: {
            title: 'Corporate Identity Package',
            categories: ['Printdesign', 'Branding'],
            image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Komplettes Corporate Design mit Briefschaften, Visitenkarten, Broschüren und Markenrichtlinien für ein Beratungsunternehmen.',
            details: `
                <h2>Corporate Identity Package</h2>
                <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Creative Agency" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Printdesign</span>
                    <span class="category">Branding</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein wachsendes Beratungsunternehmen benötigte ein professionelles Corporate Design mit allen notwendigen Printmaterialien für den Geschäftsalltag.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer zeitlosen Corporate Identity mit umfassendem Printdesign-Paket: Briefschaften, Visitenkarten, Broschüren und Präsentationsvorlagen.</p>
                
                <h3>Ergebnis</h3>
                <p>Ein kohärentes Corporate Design, das die Professionalität des Unternehmens unterstreicht und bei Kunden einen bleibenden Eindruck hinterlässt.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Corporate Identity Design</li>
                    <li>Briefschaften & Vorlagen</li>
                    <li>Visitenkarten Design</li>
                    <li>Broschüren & Flyer</li>
                    <li>Visual Identity System</li>
                    <li>Brand Guidelines</li>
                </ul>
            `
        },
        6: {
            title: 'Social Media Strategy',
            categories: ['Online Marketing'],
            image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Entwicklung einer kohärenten Social Media Strategie mit Content-Planung, Ads-Kampagnen und Newsletter-Design für ein Tech-Startup.',
            details: `
                <h2>Social Media Strategy</h2>
                <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Financial Dashboard" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem;">
                
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    <span class="category">Online Marketing</span>
                </div>
                
                <h3>Herausforderung</h3>
                <p>Ein Tech-Startup wollte seine Online-Präsenz ausbauen und benötigte eine kohärente Social Media Strategie für verschiedene Plattformen.</p>
                
                <h3>Lösung</h3>
                <p>Entwicklung einer umfassenden Social Media Strategie mit Content-Kalender, visuellen Templates, Ads-Kampagnen und Newsletter-Integration.</p>
                
                <h3>Ergebnis</h3>
                <p>Steigerung der Social Media Reichweite um 400%, Aufbau einer engagierten Community und erfolgreiche Lead-Generierung über alle Kanäle.</p>
                
                <h3>Services</h3>
                <ul>
                    <li>Social Media Strategie</li>
                    <li>Content-Planung & Templates</li>
                    <li>Facebook & Instagram Ads</li>
                    <li>Newsletter Design</li>
                    <li>Community Management</li>
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