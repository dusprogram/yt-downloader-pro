// FINAL FRONTEND FIX - Updated Backend URL and Enhanced Debugging
// Updated for Railway's new domain: .up.railway.app

// ✅ CORRECT BACKEND URL (Fixed from .railway.app to .up.railway.app)
const API_BASE_URL = 'https://yt-downloader-pro-v1-dus.up.railway.app';

console.log('🚀 YouTube Downloader Pro Loading...');
console.log('🔗 Backend API URL:', API_BASE_URL);

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
        console.log("🔧 Initializing YouTube Downloader Pro...");
        this.setupTheme();
        this.setupEventListeners();
        this.testBackendConnection();
        console.log("✅ YouTube Downloader Pro initialized successfully!");
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
            console.log("✅ Theme toggle listener added");
        }

        // URL input events
        const urlInput = document.getElementById("videoUrl");
        if (urlInput) {
            urlInput.addEventListener("input", (e) => {
                this.handleUrlInput(e.target.value);
            });

            urlInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    console.log("⌨️ Enter key pressed - getting video info");
                    this.getVideoInfo();
                }
            });
            console.log("✅ URL input listeners added");
        }

        // Clear URL
        const clearUrl = document.getElementById("clearUrl");
        if (clearUrl) {
            clearUrl.addEventListener("click", () => {
                this.clearUrl();
            });
            console.log("✅ Clear URL listener added");
        }

        // Get Info Button - CRITICAL FIX
        const getInfoBtn = document.getElementById("getInfoBtn");
        if (getInfoBtn) {
            getInfoBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("🎬 Get Video Info button clicked!");
                this.getVideoInfo();
            });
            console.log("✅ Get Info button listener added");
        } else {
            console.error("❌ ERROR: Get Info button not found! Check HTML element ID.");
        }

        // Download tabs
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tab = e.target.closest(".tab-btn").getAttribute("data-tab");
                this.switchTab(tab);
            });
        });
        console.log("✅ Tab listeners added");

        // Download button
        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                this.startDownload();
            });
        }

        console.log("🎉 All event listeners set up successfully!");
    }

    async testBackendConnection() {
        try {
            console.log("🔍 Testing backend connection...");
            console.log("🌐 Backend URL:", API_BASE_URL);

            const response = await fetch(API_BASE_URL + '/health', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Backend connected successfully:", data);
                this.showToast("Backend connected successfully!", "success");
            } else {
                console.error("❌ Backend health check failed:", response.status, response.statusText);
                this.showToast("Backend connection issue", "error");
            }
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
            console.error("🚨 Check if backend URL is correct:", API_BASE_URL);
            this.showToast("Cannot connect to backend", "error");
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
        console.log("🔍 Getting video info...");

        const urlInput = document.getElementById("videoUrl");
        const url = urlInput.value.trim();

        console.log("📝 Input URL:", url);

        if (!url) {
            console.log("❌ Empty URL");
            this.showAlert("urlError", "Please enter a YouTube URL");
            return;
        }

        if (!this.isValidYouTubeURL(url)) {
            console.log("❌ Invalid YouTube URL");
            this.showAlert("urlError", "Please enter a valid YouTube URL");
            return;
        }

        this.hideAlert("urlError");
        this.setButtonLoading("getInfoBtn", true);

        const apiUrl = API_BASE_URL + "/get_video_info";
        console.log("🔍 Fetching video info from:", apiUrl);
        console.log("📤 Request payload:", { url: url });

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ url: url }),
            });

            console.log("📊 Response status:", response.status);
            console.log("📊 Response ok:", response.ok);
            console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ API Error Response:", errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ API Response received:", data);

            if (data.success) {
                this.videoData = data;
                this.displayVideoPreview(data);
                this.displayFormats(data);
                this.goToStep(2);
                this.showToast("Video info loaded successfully!", "success");
                console.log("🎉 Video info processing completed successfully!");
            } else {
                console.error("❌ API returned error:", data.error);
                this.showAlert("urlError", data.error || "Failed to get video information");
            }

        } catch (error) {
            console.error('🚨 API Error Details:', error);
            console.error('🚨 Error name:', error.name);
            console.error('🚨 Error message:', error.message);
            console.error('🚨 Full error:', error);

            let errorMessage = "Network error. Please try again.";

            if (error.message.includes('CORS')) {
                errorMessage = "CORS error - Backend configuration issue";
                console.error("🚨 CORS Error detected - Backend needs CORS fix");
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = "Cannot connect to backend. Check your internet connection.";
                console.error("🚨 Fetch failed - Network or backend issue");
            } else if (error.message.includes('500')) {
                errorMessage = "Server error - Please try again later";
            } else if (error.message.includes('404')) {
                errorMessage = "API endpoint not found";
            }

            this.showAlert("urlError", errorMessage);
            console.error("💀 Error shown to user:", errorMessage);

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
                body: JSON.stringify(downloadData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                this.currentDownloadId = data.download_id;
                this.goToStep(3);
                this.startProgressTracking();
                this.showToast("Download started!", "success");
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
                    mode: 'cors'
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
                    this.showToast("Download completed!", "success");
                } else if (progress.status === 'error') {
                    clearInterval(this.progressInterval);
                    this.showAlert("formatError", progress.message || "Download failed");
                    this.goToStep(2);
                }

            } catch (error) {
                console.error('Progress tracking error:', error);
            }
        }, 1000);
    }

    setupFinalDownload() {
        const finalDownloadBtn = document.getElementById("finalDownloadBtn");
        if (finalDownloadBtn) {
            finalDownloadBtn.onclick = () => {
                const downloadUrl = API_BASE_URL + `/download_file/${this.currentDownloadId}`;
                console.log("📥 Downloading file from:", downloadUrl);
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
        console.log(`⚠️ Showing alert: ${message}`);
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
            if (text) text.style.display = 'none';
            if (loader) loader.style.display = 'flex';
            console.log(`🔄 Button ${buttonId} set to loading`);
        } else {
            button.disabled = false;
            if (text) text.style.display = 'flex';
            if (loader) loader.style.display = 'none';
            console.log(`✅ Button ${buttonId} loading removed`);
        }
    }

    showToast(message, type = 'info') {
        console.log(`📢 Toast: ${message} (${type})`);

        // Create toast container if not exists
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            margin-bottom: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            pointer-events: auto;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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

        console.log("✅ Video preview displayed");
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
                const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Unknown size';

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

        console.log(`✅ Video formats displayed: ${Object.keys(formats).length} qualities`);
    }

    displayAudioFormats(formats) {
        const container = document.getElementById("audioFormatsContainer");
        if (!container) return;

        let html = "";

        Object.entries(formats).forEach(([ext, qualities]) => {
            Object.entries(qualities).forEach(([quality, format]) => {
                const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Estimated size';

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

        console.log(`✅ Audio formats displayed`);
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
        console.log(`✅ Format selected: ${this.selectedFormat.quality} ${this.selectedFormat.ext}`);
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
    const downloaderSection = document.getElementById('step1');
    if (downloaderSection) {
        downloaderSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - Initializing App');
    window.downloader = new YouTubeDownloader();
});

// Fallback initialization
if (document.readyState === 'complete') {
    console.log('📄 Document already loaded - Initializing App');
    window.downloader = new YouTubeDownloader();
}

console.log('🎉 App script loaded successfully!');
