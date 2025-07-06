# ideas-by-sabino.com

Modern, static website for "ideas by sabino" UX and brand studio.

## 🎨 Design System

### Colors
- **Primary**: #003e1f (dark green)
- **Secondary**: #399b4a (mid green)  
- **Accent**: #9cce39 (bright green)
- **Background**: #d9f3ba (soft green)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Work Sans

## 📁 Project Structure

```
├── index.html          # Homepage
├── showcases.html      # Project showcases
├── kontakt.html        # Contact page
├── impressum.html      # Legal page
├── styles/
│   └── main.css        # Main stylesheet
├── scripts/
│   ├── main.js         # Core functionality
│   ├── showcases.js    # Showcases page logic
│   └── contact.js      # Contact form handling
└── logo.svg           # Studio logo
```

## 🚀 Deployment

This is a static website ready for deployment to Plesk's `/httpdocs` folder.

### Local Development
```bash
npm run dev
```

### Deployment to Plesk
1. Download/clone the repository
2. Upload all files to `/httpdocs` folder in Plesk
3. The site will be immediately available

## ✨ Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional design
- **Interactive Showcases**: Filterable project gallery with modal details
- **Contact Form**: Functional contact form with validation
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance**: Optimized images and minimal dependencies

## 🛠 Technologies

- Pure HTML5, CSS3, and JavaScript
- Google Fonts (Inter & Work Sans)
- Pexels stock images
- No build process required

## 📝 Content Management

To update projects in the showcases:
1. Edit the `projectData` object in `scripts/showcases.js`
2. Add new project images to the appropriate sections
3. Update the project cards in `showcases.html`

## 🔗 GitHub Integration

This project is designed to work with the repository `stefsabi/ideas-by-sabino.com` for version control and deployment automation.

---

**Built with Bolt ✺**