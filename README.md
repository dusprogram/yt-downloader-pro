# 🎬 YT Downloader Pro

Professional YouTube Video & Audio Downloader with modern UI and comprehensive format support.

## 🌟 Live Demo

- 🌐 **Frontend**: [https://yt-downloader-pro-v011.netlify.app](https://yt-downloader-pro-v011.netlify.app)
- ⚡ **API**: [https://yt-downloader-pro-v1-dus.railway.app](https://yt-downloader-pro-v1-dus.railway.app)
- 📚 **Source Code**: [https://github.com/dusprogram/yt-downloader-pro](https://github.com/dusprogram/yt-downloader-pro)

## ✨ Features

### 📹 Video Downloads
- **HD Quality**: Up to 1080p resolution
- **Multiple Formats**: MP4, WebM, MKV
- **Audio Included**: Guaranteed audio in all video downloads
- **Smart Fallbacks**: Multiple format options for compatibility

### 🎵 Audio Downloads  
- **High Quality**: MP3 (320kbps), M4A (256kbps)
- **Fast Conversion**: Server-side audio extraction
- **Multiple Bitrates**: 192kbps, 256kbps, 320kbps options

### 📱 User Experience
- **Mobile-First**: Responsive design for all devices
- **Dark/Light Theme**: User preference with system detection
- **Progressive Web App**: Installable on mobile devices
- **Real-time Progress**: Live download progress tracking

### 🔒 Privacy & Security
- **No Data Storage**: Files automatically deleted after download
- **HTTPS Only**: Secure connections throughout
- **No Tracking**: Privacy-focused design
- **CORS Protected**: Secure API access

## 🏗️ Technology Stack

### Frontend (Netlify)
```
- HTML5/CSS3/ES6+: Modern web standards
- Responsive Design: Mobile-first approach  
- PWA Features: Offline support & installable
- Font Awesome: Beautiful icons
- Google Fonts: Inter typography
```

### Backend (Railway)
```
- Python 3.9+: Modern Python with type hints
- Flask: Lightweight web framework
- yt-dlp: Latest YouTube processing engine
- FFmpeg: Professional media processing
- Flask-CORS: Cross-origin resource sharing
```

## 📦 Project Structure

```
yt-downloader-pro/
├── 📁 frontend/                 # Netlify deployment
│   ├── index.html              # Main application
│   ├── privacy.html            # Privacy policy  
│   ├── terms.html              # Terms of service
│   ├── disclaimer.html         # Legal disclaimer
│   ├── contact.html            # Contact information
│   ├── 📁 css/
│   │   └── style.css           # Responsive styling
│   ├── 📁 js/
│   │   └── app.js              # Frontend logic
│   └── 📁 static/
│       ├── manifest.json       # PWA configuration
│       └── sw.js               # Service worker
├── 📁 backend/                 # Railway deployment
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
│   └── Procfile               # Railway configuration
├── README.md                   # Documentation
├── .gitignore                 # Git ignore rules
└── netlify.toml               # Netlify configuration
```

## 🚀 Local Development

### Prerequisites
```bash
# Python 3.9 or higher
python --version

# Install yt-dlp
pip install yt-dlp

# Install FFmpeg (optional but recommended)
# Windows: Download from https://ffmpeg.org/
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
# Serve with any HTTP server
python -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000
```

### Environment Variables
```bash
# Backend (.env)
PORT=5000
MAX_DOWNLOADS=3
CLEANUP_SECONDS=120

# Frontend
# Update API_BASE_URL in js/app.js to your backend URL
```

## 🌐 Deployment

### Automatic Deployment
Both frontend and backend are configured for automatic deployment:

1. **Push to GitHub**: Code changes trigger deployments
2. **Netlify**: Automatically deploys frontend from `frontend/` folder
3. **Railway**: Automatically deploys backend from `backend/` folder

### Manual Deployment

#### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build directory to `frontend`
3. Deploy automatically on git push

#### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set root directory to `backend`
3. Add environment variables
4. Deploy automatically on git push

## ⚙️ Configuration

### Netlify Settings
```toml
[build]
  publish = "frontend"

[[redirects]]
  from = "/api/*"
  to = "https://yt-downloader-pro-v1-dus.railway.app/api/:splat"
  status = 200
```

### Railway Settings
```
# Procfile
web: gunicorn --bind 0.0.0.0:$PORT app:app

# Environment Variables
PORT=5000
PYTHON_VERSION=3.9.18
```

## 🔧 API Documentation

### Get Video Information
```http
POST /get_video_info
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=VIDEO_ID"
}
```

### Start Download
```http
POST /download  
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=VIDEO_ID",
  "format_id": "best",
  "output_format": "mp4",
  "type": "video",
  "title": "Video Title"
}
```

### Check Progress
```http
GET /progress/{download_id}
```

### Download File
```http
GET /download_file/{download_id}
```

### Health Check
```http
GET /health
```

## 🛡️ Security Features

- **CORS Protection**: Restricted to authorized domains
- **Rate Limiting**: Prevents server overload
- **Input Validation**: URL and parameter sanitization  
- **No Persistence**: Files deleted after download
- **HTTPS Only**: Secure connections required
- **Error Handling**: Graceful failure management

## 📊 Performance Metrics

- **Frontend**: ~50KB gzipped, <1s load time
- **Backend**: <500ms API response time
- **Downloads**: Direct streaming, no server storage
- **Cleanup**: Automatic file deletion after 2 minutes
- **Concurrency**: Up to 3 simultaneous downloads

## 🔍 Troubleshooting

### Common Issues

**CORS Errors**
```javascript
// Check if API_BASE_URL matches your backend
const API_BASE_URL = 'https://yt-downloader-pro-v1-dus.railway.app';
```

**Download Failures**
```python
# Check yt-dlp installation
yt-dlp --version

# Update yt-dlp
pip install -U yt-dlp
```

**No Audio in Videos**
```bash
# Install FFmpeg for audio processing
# Windows: Download from https://ffmpeg.org/
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

### Debug Mode
```python
# Enable debug logging in backend
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Monitoring

### Health Checks
- **Frontend**: Netlify status page
- **Backend**: `/health` endpoint
- **Uptime**: 99.9% availability target

### Analytics
- **Netlify Analytics**: Traffic and performance
- **Railway Metrics**: Backend performance
- **Error Tracking**: Automated error reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript
- Write descriptive commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube downloading engine
- [Flask](https://flask.palletsprojects.com/) - Web framework
- [FFmpeg](https://ffmpeg.org/) - Media processing
- [Netlify](https://netlify.com/) - Frontend hosting
- [Railway](https://railway.app/) - Backend hosting

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/dusprogram/yt-downloader-pro/issues)
- 📧 **Email**: support@ytdownloaderpro.com
- 📖 **Documentation**: [GitHub Wiki](https://github.com/dusprogram/yt-downloader-pro/wiki)

## 📊 Statistics

- ⭐ **Stars**: Growing community
- 🍴 **Forks**: Open source contributions  
- 📦 **Downloads**: Thousands of successful downloads
- 🌍 **Global**: Users worldwide

---

**Made with ❤️ for the open-source community**

*Professional YouTube downloading made simple, fast, and secure.*
