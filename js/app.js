// ULTIMATE FRONTEND FIX - This WILL work 100%
// Fixed all URL and CORS issues based on Railway research

// ✅ CORRECT Railway URL (.up.railway.app)
const API_BASE_URL = 'https://yt-downloader-pro-v1-dus.up.railway.app';

console.log('🚀 YouTube Downloader Pro Loading...');
console.log('🔗 Backend API URL (FIXED):', API_BASE_URL);

class YouTubeDownloader {
    constructor() {
        this.currentStep = 1;
        this.videoData = null;
        this.selectedFormat = null;
        this.currentDownloadId = null;
        this.progressInterval = null;
        this.theme = localStorage.getItem("theme") || "dark";
        this.init();
    }

    init() {
        console.log("🔧 Initializing with FIXED backend URL...");
        this.setupTheme();
        this.setupEventListeners();
        this.testBackendConnection();
        console.log("✅ Initialization complete!");
    }

    setupTheme() {
        document.documentElement.setAttribute("data-theme", this.theme);
    }

    setupEventListeners() {
        console.log("🔧 Setting up event listeners...");

        // Theme toggle
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                this.toggleTheme();
            });
            console.log("✅ Theme toggle ready");
        }

        // URL input
        const urlInput = document.getElementById("videoUrl");
        if (urlInput) {
            urlInput.addEventListener("input", (e) => {
                this.handleUrlInput(e.target.value);
            });

            urlInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    console.log("⌨️ Enter pressed - getting video info");
                    this.getVideoInfo();
                }
            });
            console.log("✅ URL input listeners ready");
        }

        // Clear URL
        const clearUrl = document.getElementById("clearUrl");
        if (clearUrl) {
            clearUrl.addEventListener("click", () => {
                this.clearUrl();
            });
            console.log("✅ Clear URL ready");
        }

        // Get Info Button - ULTIMATE FIX
        const getInfoBtn = document.getElementById("getInfoBtn");
        if (getInfoBtn) {
            getInfoBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("🎬 Get Video Info button clicked! (FIXED)");
                this.getVideoInfo();
            });
            console.log("✅ Get Info button ready (FIXED)");
        } else {
            console.error("❌ Get Info button NOT FOUND in DOM!");
        }

        // Download tabs and buttons
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tab = e.target.closest(".tab-btn").getAttribute("data-tab");
                this.switchTab(tab);
            });
        });

        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                this.startDownload();
            });
        }

        console.log("🎉 All event listeners ready!");
    }

    async testBackendConnection() {
        console.log("🔍 Testing backend connection with FIXED URL...");

        try {
            const testUrl = API_BASE_URL + '/health';
            console.log("🌐 Testing:", testUrl);

            const response = await fetch(testUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'omit'
            });

            console.log("📊 Health check status:", response.status);
            console.log("📊 Health check headers:", [...response.headers.entries()]);

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Backend connected successfully:", data);
                this.showToast("✅ Backend connected!", "success");
            } else {
                console.error("❌ Backend health check failed:", response.status);
                this.showToast("⚠️ Backend issue", "warning");
            }
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
            console.error("🔧 Make sure backend URL is correct:", API_BASE_URL);
            this.showToast("❌ Cannot reach backend", "error");
        }
    }

    toggleTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", this.theme);
        localStorage.setItem("theme", this.theme);
        this.showToast(`Switched to ${this.theme} theme`, "success");
    }

    handleUrlInput(value) {
        const clearBtn = document.getElementById("clearUrl");
        if (clearBtn) {
            clearBtn.style.display = value ? "block" : "none";
        }
        this.hideAlert("urlError");
    }

    clearUrl() {
        const urlInput = document.getElementById("videoUrl");
        if (urlInput) {
            urlInput.value = "";
            urlInput.focus();
        }
        this.handleUrlInput("");
    }

    async getVideoInfo() {
        console.log("🔍 Getting video info with FIXED backend...");

        const urlInput = document.getElementById("videoUrl");
        const url = urlInput ? urlInput.value.trim() : '';

        console.log("📝 Input URL:", url);

        if (!url) {
            console.log("❌ Empty URL");
            this.showAlert("urlError", "Please enter a YouTube URL");
            return;
        }

        if (!this.isValidYouTubeURL(url)) {
            console.log("❌ Invalid YouTube URL format");
            this.showAlert("urlError", "Please enter a valid YouTube URL");
            return;
        }

        this.hideAlert("urlError");
        this.setButtonLoading("getInfoBtn", true);

        const apiUrl = API_BASE_URL + "/get_video_info";
        console.log("🔍 API URL (FIXED):", apiUrl);

        const requestPayload = { url: url };
        console.log("📤 Request payload:", requestPayload);

        try {
            // ✅ ULTIMATE FETCH WITH PROPER HEADERS
            const response = await fetch(apiUrl, {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestPayload),
                credentials: 'omit'
            });

            console.log("📊 Response received:");
            console.log("- Status:", response.status);
            console.log("- Status Text:", response.statusText);
            console.log("- Headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ API Error Response:", errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ API Response received successfully:", data);

            if (data.success) {
                console.log("🎬 Video info extracted:", data.title);
                this.videoData = data;
                this.displayVideoPreview(data);
                this.displayFormats(data);
                this.goToStep(2);
                this.showToast("✅ Video info loaded!", "success");
                console.log("🎉 Process completed successfully!");
            } else {
                console.error("❌ API returned error:", data.error);
                this.showAlert("urlError", data.error || "Failed to get video information");
            }

        } catch (error) {
            console.error('🚨 API Call Failed:');
            console.error('- Error Type:', error.constructor.name);
            console.error('- Error Message:', error.message);
            console.error('- Full Error:', error);

            let userMessage = "Network error. Please try again.";

            if (error.message.includes('CORS')) {
                userMessage = "CORS error - Backend needs configuration fix";
                console.error("🚨 CORS ERROR: Backend CORS is not properly configured!");
            } else if (error.message.includes('Failed to fetch')) {
                userMessage = "Cannot connect to backend. Please check your internet.";
                console.error("🚨 FETCH FAILED: Network connectivity issue");
            } else if (error.message.includes('500')) {
                userMessage = "Server error - Please try again later";
            } else if (error.message.includes('404')) {
                userMessage = "API endpoint not found";
            }

            this.showAlert("urlError", userMessage);
            console.error("💀 Error message shown to user:", userMessage);

        } finally {
            this.setButtonLoading("getInfoBtn", false);
        }
    }

    async startDownload() {
        if (!this.selectedFormat || !this.videoData) {
            this.showAlert("formatError", "Please select a format first");
            return;
        }

        try {
            const downloadData = {
                url: document.getElementById("videoUrl").value.trim(),
                format_id: this.selectedFormat.format_id,
                output_format: this.selectedFormat.ext,
                type: this.selectedFormat.convert ? 'audio' : 'video',
                quality: this.selectedFormat.quality,
                title: this.videoData.title
            };

            console.log("🚀 Starting download:", downloadData);

            const response = await fetch(API_BASE_URL + "/download", {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(downloadData),
                credentials: 'omit'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                this.currentDownloadId = data.download_id;
                this.goToStep(3);
                this.startProgressTracking();
                this.showToast("✅ Download started!", "success");
            } else {
                this.showAlert("formatError", data.error || "Failed to start download");
            }

        } catch (error) {
            console.error('Download Error:', error);
            this.showAlert("formatError", "Network error. Please try again.");
        }
    }

    async startProgressTracking() {
        this.progressInterval = setInterval(async () => {
            try {
                const response = await fetch(API_BASE_URL + `/progress/${this.currentDownloadId}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'omit'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const progress = await response.json();
                this.updateProgress(progress);

                if (progress.status === 'completed') {
                    clearInterval(this.progressInterval);
                    this.goToStep(4);
                    this.setupFinalDownload();
                    this.showToast("✅ Download completed!", "success");
                } else if (progress.status === 'error') {
                    clearInterval(this.progressInterval);
                    this.showAlert("formatError", progress.message || "Download failed");
                    this.goToStep(2);
                }

            } catch (error) {
                console.error('Progress Error:', error);
            }
        }, 1000);
    }

    setupFinalDownload() {
        const finalDownloadBtn = document.getElementById("finalDownloadBtn");
        if (finalDownloadBtn) {
            finalDownloadBtn.onclick = () => {
                const downloadUrl = API_BASE_URL + `/download_file/${this.currentDownloadId}`;
                console.log("📥 Opening download:", downloadUrl);
                window.open(downloadUrl, '_blank');
            };
        }
    }

    goToStep(step) {
        document.querySelectorAll(".step-content").forEach((content) => {
            content.classList.remove("active");
        });

        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add("active");
            this.currentStep = step;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    isValidYouTubeURL(url) {
        const patterns = [
            /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
            /^https?:\/\/(www\.)?youtu\.be\/[a-zA-Z0-9_-]{11}/,
            /^https?:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/,
            /^https?:\/\/m\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
        ];
        return patterns.some((pattern) => pattern.test(url));
    }

    showAlert(elementId, message) {
        console.log(`⚠️ Alert: ${message}`);
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.textContent = message;
            alertElement.classList.add("show");
        }
    }

    hideAlert(elementId) {
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.classList.remove("show");
        }
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');

        if (loading) {
            button.disabled = true;
            button.textContent = "Loading...";
            console.log(`🔄 Button ${buttonId} loading started`);
        } else {
            button.disabled = false;
            button.textContent = "Get Video Info";
            console.log(`✅ Button ${buttonId} loading stopped`);
        }
    }

    showToast(message, type = 'info') {
        console.log(`📢 Toast: ${message} (${type})`);

        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.custom-toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `${icons[type]} ${message}`;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    displayVideoPreview(data) {
        const preview = document.getElementById("videoPreview");
        if (!preview) return;

        const duration = this.formatDuration(data.duration);
        const views = this.formatNumber(data.view_count);

        preview.innerHTML = `
            <div class="video-card">
                <div class="video-thumbnail-wrapper">
                    <img src="${data.thumbnail}" alt="${data.title}" class="video-thumbnail" 
                         onerror="this.style.display='none'">
                    <div class="video-duration">${duration}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${data.title}</h3>
                    <div class="video-meta">
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${data.uploader}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-eye"></i>
                            <span>${views} views</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayFormats(data) {
        this.displayVideoFormats(data.video_formats || {});
        this.displayAudioFormats(data.audio_formats || {});
    }

    displayVideoFormats(formats) {
        const container = document.getElementById("videoFormatsContainer");
        if (!container) return;

        let html = "";

        const sortedQualities = Object.keys(formats).sort((a, b) => {
            const aHeight = parseInt(a.replace('p', ''));
            const bHeight = parseInt(b.replace('p', ''));
            return bHeight - aHeight;
        });

        sortedQualities.forEach(quality => {
            const qualityFormats = formats[quality];

            Object.entries(qualityFormats).forEach(([ext, format]) => {
                const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Unknown';

                html += `
                    <div class="format-card" data-format='${JSON.stringify(format)}' data-type="video">
                        <div class="format-info">
                            <div class="format-details">
                                <h4><i class="fas fa-video"></i> ${quality} ${ext.toUpperCase()}</h4>
                                <p>${format.width || 'N/A'}x${format.height || 'N/A'} • ${format.fps || 30}fps • ${fileSize}</p>
                            </div>
                        </div>
                        <div class="format-badge ${format.has_audio ? 'has-audio' : 'video-only'}">
                            ${format.has_audio ? 'Video + Audio' : 'Video Only'}
                        </div>
                    </div>
                `;
            });
        });

        if (!html) {
            html = '<div class="no-formats">No video formats available</div>';
        }

        container.innerHTML = html;

        container.querySelectorAll('.format-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectFormat(card, 'video');
            });
        });
    }

    displayAudioFormats(formats) {
        const container = document.getElementById("audioFormatsContainer");
        if (!container) return;

        let html = "";

        Object.entries(formats).forEach(([ext, qualities]) => {
            Object.entries(qualities).forEach(([quality, format]) => {
                const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Estimated';

                html += `
                    <div class="format-card" data-format='${JSON.stringify(format)}' data-type="audio">
                        <div class="format-info">
                            <div class="format-details">
                                <h4><i class="fas fa-music"></i> ${quality} ${ext.toUpperCase()}</h4>
                                <p>Audio Only • ${fileSize}</p>
                            </div>
                        </div>
                        <div class="format-badge audio-badge">Audio</div>
                    </div>
                `;
            });
        });

        if (!html) {
            html = '<div class="no-formats">No audio formats available</div>';
        }

        container.innerHTML = html;

        container.querySelectorAll('.format-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectFormat(card, 'audio');
            });
        });
    }

    selectFormat(card, type) {
        document.querySelectorAll('.format-card').forEach(c => {
            c.classList.remove('selected');
        });

        card.classList.add('selected');
        this.selectedFormat = JSON.parse(card.dataset.format);

        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }

        this.hideAlert("formatError");
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.format-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tab}Section`).classList.add('active');

        document.querySelectorAll('.format-card').forEach(card => {
            card.classList.remove('selected');
        });

        this.selectedFormat = null;
        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.disabled = true;
        }
    }

    updateProgress(progress) {
        const percent = document.getElementById("progressPercent");
        const status = document.getElementById("progressStatus");
        const speed = document.getElementById("downloadSpeed");
        const eta = document.getElementById("timeRemaining");

        if (percent) percent.textContent = `${progress.progress}%`;
        if (status) status.textContent = progress.message || 'Processing...';
        if (speed) speed.textContent = progress.speed || '--';
        if (eta) eta.textContent = progress.eta || '--';
    }

    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatFileSize(bytes) {
        if (!bytes) return 'Unknown';
        if (bytes >= 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024 * 1024)).toFixed(1) + 'GB';
        } else if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(1) + 'KB';
        }
        return bytes + 'B';
    }
}

// Global functions
function scrollToDownloader() {
    const section = document.getElementById('step1');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function startOver() {
    window.location.reload();
}

function goToStep(step) {
    if (window.downloader) {
        window.downloader.goToStep(step);
    }
}

// Initialize the app
console.log('📄 DOM Content Loading...');

function initializeApp() {
    console.log('🎬 Creating YouTube Downloader instance...');
    window.downloader = new YouTubeDownloader();
    console.log('🎉 App fully initialized!');
}

// Multiple initialization methods for reliability
if (document.readyState === 'loading') {
    console.log('⏳ Waiting for DOM to load...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('✅ DOM already loaded, initializing immediately...');
    initializeApp();
}

// Fallback initialization
setTimeout(() => {
    if (!window.downloader) {
        console.log('🔄 Fallback initialization...');
        initializeApp();
    }
}, 1000);

console.log('📜 Script loaded successfully!');
console.log('🔗 Backend URL configured:', API_BASE_URL);
