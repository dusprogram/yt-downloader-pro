# 🎬 YT Downloader Pro - Frontend

Modern, responsive frontend for YouTube video and audio downloading.

## 🌐 Live Demo

**Frontend**: https://yt-downloader-pro-v011.netlify.app

## 🛠️ Technology Stack

- **HTML5/CSS3**: Modern web standards
- **JavaScript ES6+**: Vanilla JavaScript, no frameworks
- **Progressive Web App**: Installable, offline-capable
- **Responsive Design**: Mobile-first approach
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Inter typography

## 📱 Features

- 🎨 **Modern UI**: Clean, professional interface
- 📱 **Mobile Responsive**: Perfect on all screen sizes
- 🌙 **Dark/Light Theme**: User preference themes
- ⚡ **Fast Loading**: Optimized performance
- 🔒 **Secure**: HTTPS-only, no data collection
- 📦 **PWA Support**: Installable on mobile devices

## 🏗️ File Structure

```
├── index.html          # Main application
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── disclaimer.html     # Legal disclaimer
├── contact.html        # Contact page
├── css/
│   └── style.css       # All styling
├── js/
│   └── app.js          # Application logic
├── static/
│   ├── manifest.json   # PWA manifest
│   └── sw.js          # Service worker
└── netlify.toml       # Netlify configuration
```

## ⚙️ Configuration

### API Integration

The frontend connects to the backend API at:

```javascript
const API_BASE_URL = "https://yt-downloader-pro-v1-dus.railway.app";
```

### Netlify Deployment

```toml
[build]
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "https://yt-downloader-pro-v1-dus.railway.app/:splat"
  status = 200
```

## 🚀 Local Development

```bash
# Clone repository
git clone https://github.com/dusprogram/yt-downloader-pro.git
cd yt-downloader-pro

# Serve locally
python -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000

# Open browser
http://localhost:8000
```

## 📦 Deployment

1. Push changes to GitHub
2. Netlify automatically deploys
3. Live at: https://yt-downloader-pro-v011.netlify.app

## 🔗 Related Repositories

- **Backend API**: https://github.com/dusprogram/yt-downloader-prov1

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**Frontend for YT Downloader Pro - Made with ❤️**
