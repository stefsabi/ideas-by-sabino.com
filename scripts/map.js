// Interactive Map with Leaflet
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Leaflet to load
    if (typeof L === 'undefined') {
        console.log('Leaflet not loaded yet, retrying...');
        setTimeout(initializeMap, 500);
        return;
    }
    
    initializeMap();
});

function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    try {
        // OpenStreetMap coordinates for Dättwilerstrasse 11, 5405 Baden-Dättwil, AG, Switzerland
        // Source: https://osm.org/go/0Ce9W~mn7?way=134821429
        const lat = 47.4751;
        const lng = 8.3089;
        
        // Initialize the map
        const map = L.map('map', {
            center: [lat, lng],
            zoom: 16,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Custom marker icon in brand colors
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: #399b4a;
                    width: 30px;
                    height: 30px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 3px solid #003e1f;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(45deg);
                        width: 8px;
                        height: 8px;
                        background-color: white;
                        border-radius: 50%;
                    "></div>
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        
        // Add marker
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        
        // Add popup with company information
        const popupContent = `
            <div style="text-align: center; font-family: 'Inter', sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #003e1f; font-size: 16px; font-weight: 600;">
                    ideas by sabino
                </h3>
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; line-height: 1.4;">
                    Dättwilerstrasse 11<br>
                    CH-5405 Baden-Dättwil AG<br>
                    Schweiz
                </p>
                <div style="margin-top: 12px;">
                    <a href="https://www.google.com/maps/dir//Dättwilerstrasse+11,+5405+Baden-Dättwil,+Schweiz" 
                       target="_blank" 
                       style="
                           display: inline-block;
                           background-color: #399b4a;
                           color: white;
                           padding: 6px 12px;
                           border-radius: 6px;
                           text-decoration: none;
                           font-size: 12px;
                           font-weight: 500;
                           margin: 2px;
                           transition: background-color 0.3s ease;
                       "
                       onmouseover="this.style.backgroundColor='#003e1f'"
                       onmouseout="this.style.backgroundColor='#399b4a'">
                        📍 Route planen
                    </a>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });
        
        // Open popup by default
        marker.openPopup();
        
        // Add a subtle circle to highlight the area
        L.circle([lat, lng], {
            color: '#399b4a',
            fillColor: '#9cce39',
            fillOpacity: 0.1,
            radius: 100,
            weight: 2
        }).addTo(map);
        
        // Add custom CSS for the popup
        const style = document.createElement('style');
        style.textContent = `
            .custom-popup .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 2px solid #9cce39;
            }
            
            .custom-popup .leaflet-popup-tip {
                background-color: white;
                border: 2px solid #9cce39;
                border-top: none;
                border-right: none;
            }
            
            .custom-marker {
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            }
            
            .leaflet-control-zoom a {
                background-color: #399b4a !important;
                color: white !important;
                border: 1px solid #003e1f !important;
            }
            
            .leaflet-control-zoom a:hover {
                background-color: #003e1f !important;
            }
            
            .leaflet-control-attribution {
                background-color: rgba(255, 255, 255, 0.9) !important;
                font-size: 10px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add click event to map for additional interaction
        map.on('click', function(e) {
            console.log('Map clicked at:', e.latlng);
        });
        
        // Ensure map renders properly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
        console.log('Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
        
        // Fallback content if map fails to load
        mapElement.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
                text-align: center;
                padding: 20px;
                border-radius: 8px;
            ">
                <div>
                    <h4 style="color: #003e1f; margin-bottom: 10px;">
                        📍 Unser Standort in Baden
                    </h4>
                    <p style="color: #6c757d; margin-bottom: 15px;">
                        Dättwilerstrasse 11<br>
                        CH-5405 Baden-Dättwil AG, Schweiz
                    </p>
                    <a href="https://www.google.com/maps/dir//Dättwilerstrasse+11,+5405+Baden-Dättwil,+Schweiz" 
                       target="_blank" 
                       style="
                           background-color: #399b4a;
                           color: white;
                           padding: 8px 16px;
                           border-radius: 6px;
                           text-decoration: none;
                           font-weight: 500;
                       ">
                        Karte in Google Maps öffnen
                    </a>
                </div>
            </div>
        `;
    }
}

// Retry initialization if needed
window.initializeMap = initializeMap;