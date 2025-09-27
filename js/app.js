// FIXED APP.JS - Format Display Issue Fixed & Toast Notifications Removed
// Backend URL: https://yt-downloader-pro-v1-dus.up.railway.app

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

        // Get Info Button
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

        // Download tabs
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tab = e.target.closest(".tab-btn").getAttribute("data-tab");
                console.log("🔄 Tab switched to:", tab);
                this.switchTab(tab);
            });
        });

        // Download button
        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                console.log("📥 Download button clicked!");
                this.startDownload();
            });
            console.log("✅ Download button ready");
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
            } else {
                console.error("❌ Backend health check failed:", response.status);
            }
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
        }
    }

    toggleTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", this.theme);
        localStorage.setItem("theme", this.theme);
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

                console.log("🖼️ Displaying video preview...");
                this.displayVideoPreview(data);

                console.log("🎨 Displaying formats...");
                console.log("📊 Video formats:", data.video_formats);
                console.log("🎵 Audio formats:", data.audio_formats);
                this.displayFormats(data);

                console.log("📍 Going to step 2...");
                this.goToStep(2);

                console.log("🎉 Process completed successfully!");
            } else {
                console.error("❌ API returned error:", data.error);
                this.showAlert("urlError", data.error || "Failed to get video information");
            }

        } catch (error) {
            console.error('🚨 API Call Failed:', error);
            let userMessage = "Network error. Please try again.";

            if (error.message.includes('CORS')) {
                userMessage = "CORS error - Backend needs configuration fix";
            } else if (error.message.includes('Failed to fetch')) {
                userMessage = "Cannot connect to backend. Please check your internet.";
            }

            this.showAlert("urlError", userMessage);

        } finally {
            this.setButtonLoading("getInfoBtn", false);
        }
    }

    displayVideoPreview(data) {
        console.log("🖼️ Creating video preview...");
        const preview = document.getElementById("videoPreview");
        if (!preview) {
            console.error("❌ Video preview element not found!");
            return;
        }

        const duration = this.formatDuration(data.duration);
        const views = this.formatNumber(data.view_count);

        preview.innerHTML = `
            <div class="video-card">
                <div class="video-thumbnail-wrapper">
                    <img src="${data.thumbnail}" alt="${data.title}" class="video-thumbnail" 
                         onerror="this.style.display='none'" onload="console.log('✅ Thumbnail loaded')">
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

        console.log("✅ Video preview displayed successfully");
    }

    displayFormats(data) {
        console.log("🎨 Starting format display...");
        console.log("📊 Received video formats:", data.video_formats);
        console.log("🎵 Received audio formats:", data.audio_formats);

        // Display both video and audio formats
        this.displayVideoFormats(data.video_formats || {});
        this.displayAudioFormats(data.audio_formats || {});

        console.log("✅ Format display completed");
    }

    displayVideoFormats(formats) {
        console.log("📹 Displaying video formats...");
        const container = document.getElementById("videoFormatsContainer");

        if (!container) {
            console.error("❌ Video formats container not found!");
            return;
        }

        console.log("📊 Processing video formats:", formats);
        let html = "";
        let formatCount = 0;

        // Check if formats exist and have content
        if (!formats || Object.keys(formats).length === 0) {
            console.log("⚠️ No video formats available");
            html = `
                <div class="no-formats">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No video formats available for this video</p>
                </div>
            `;
        } else {
            // Sort qualities (highest first)
            const sortedQualities = Object.keys(formats).sort((a, b) => {
                const aHeight = parseInt(a.replace('p', ''));
                const bHeight = parseInt(b.replace('p', ''));
                return bHeight - aHeight;
            });

            console.log("📊 Sorted video qualities:", sortedQualities);

            sortedQualities.forEach(quality => {
                const qualityFormats = formats[quality];
                console.log(`🎬 Processing ${quality}:`, qualityFormats);

                Object.entries(qualityFormats).forEach(([ext, format]) => {
                    const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Size unknown';

                    html += `
                        <div class="format-card" data-format='${JSON.stringify(format)}' data-type="video" 
                             onclick="window.downloader.selectFormatCard(this)">
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
                    formatCount++;
                });
            });
        }

        container.innerHTML = html;
        console.log(`✅ Video formats displayed: ${formatCount} cards`);
    }

    displayAudioFormats(formats) {
        console.log("🎵 Displaying audio formats...");
        const container = document.getElementById("audioFormatsContainer");

        if (!container) {
            console.error("❌ Audio formats container not found!");
            return;
        }

        console.log("🎵 Processing audio formats:", formats);
        let html = "";
        let formatCount = 0;

        // Check if formats exist and have content
        if (!formats || Object.keys(formats).length === 0) {
            console.log("⚠️ No audio formats available");
            html = `
                <div class="no-formats">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No audio formats available for this video</p>
                </div>
            `;
        } else {
            Object.entries(formats).forEach(([ext, qualities]) => {
                console.log(`🎵 Processing ${ext}:`, qualities);

                Object.entries(qualities).forEach(([quality, format]) => {
                    const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Size estimated';

                    html += `
                        <div class="format-card" data-format='${JSON.stringify(format)}' data-type="audio"
                             onclick="window.downloader.selectFormatCard(this)">
                            <div class="format-info">
                                <div class="format-details">
                                    <h4><i class="fas fa-music"></i> ${quality} ${ext.toUpperCase()}</h4>
                                    <p>Audio Only • ${fileSize}</p>
                                </div>
                            </div>
                            <div class="format-badge audio-badge">
                                Audio Only
                            </div>
                        </div>
                    `;
                    formatCount++;
                });
            });
        }

        container.innerHTML = html;
        console.log(`✅ Audio formats displayed: ${formatCount} cards`);
    }

    // ✅ FIXED: Format selection method
    selectFormatCard(card) {
        console.log("🎯 Format card selected:", card);

        // Remove selection from all cards
        document.querySelectorAll('.format-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Add selection to clicked card
        card.classList.add('selected');

        try {
            this.selectedFormat = JSON.parse(card.dataset.format);
            console.log("✅ Selected format:", this.selectedFormat);

            // Enable download button
            const downloadBtn = document.getElementById("downloadBtn");
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Selected Format';
                console.log("✅ Download button enabled");
            }

            this.hideAlert("formatError");

        } catch (error) {
            console.error("❌ Error parsing format data:", error);
            this.showAlert("formatError", "Error selecting format");
        }
    }

    switchTab(tab) {
        console.log("🔄 Switching to tab:", tab);

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.format-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${tab}Section`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ Switched to ${tab} section`);
        } else {
            console.error(`❌ Section ${tab}Section not found`);
        }

        // Clear selection when switching tabs
        document.querySelectorAll('.format-card').forEach(card => {
            card.classList.remove('selected');
        });

        this.selectedFormat = null;
        const downloadBtn = document.getElementById("downloadBtn");
        if (downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Select a Format First';
        }

        console.log(`🎯 Tab switched to: ${tab}`);
    }

    async startDownload() {
        console.log("📥 Starting download process...");

        if (!this.selectedFormat || !this.videoData) {
            console.error("❌ No format selected or no video data");
            this.showAlert("formatError", "Please select a format first");
            return;
        }

        console.log("🚀 Download data:", {
            format: this.selectedFormat,
            video: this.videoData.title
        });

        try {
            const downloadData = {
                url: document.getElementById("videoUrl").value.trim(),
                format_id: this.selectedFormat.format_id,
                output_format: this.selectedFormat.ext,
                type: this.selectedFormat.convert ? 'audio' : 'video',
                quality: this.selectedFormat.quality,
                title: this.videoData.title
            };

            console.log("📤 Sending download request:", downloadData);

            const response = await fetch(API_BASE_URL + "/download", {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(downloadData),
                credentials: 'omit'
            });

            console.log("📊 Download response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📥 Download response:", data);

            if (data.success) {
                this.currentDownloadId = data.download_id;
                console.log("🎯 Download ID:", this.currentDownloadId);

                this.goToStep(3);
                this.startProgressTracking();
            } else {
                console.error("❌ Download failed:", data.error);
                this.showAlert("formatError", data.error || "Failed to start download");
            }

        } catch (error) {
            console.error('❌ Download Error:', error);
            this.showAlert("formatError", "Network error. Please try again.");
        }
    }

    async startProgressTracking() {
        console.log("📊 Starting progress tracking for:", this.currentDownloadId);

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
                console.log("📊 Progress update:", progress);
                this.updateProgress(progress);

                if (progress.status === 'completed') {
                    clearInterval(this.progressInterval);
                    console.log("✅ Download completed!");
                    this.goToStep(4);
                    this.setupFinalDownload();
                } else if (progress.status === 'error') {
                    clearInterval(this.progressInterval);
                    console.error("❌ Download failed:", progress.message);
                    this.showAlert("formatError", progress.message || "Download failed");
                    this.goToStep(2);
                }

            } catch (error) {
                console.error('❌ Progress tracking error:', error);
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
            console.log("✅ Final download button configured");
        }
    }

    goToStep(step) {
        console.log(`📍 Going to step ${step}`);

        // Hide all steps
        document.querySelectorAll(".step-content").forEach((content) => {
            content.classList.remove("active");
        });

        // Show target step
        const targetStep = document.getElementById(`step${step}`);
        if (targetStep) {
            targetStep.classList.add("active");
            this.currentStep = step;
            window.scrollTo({ top: 0, behavior: "smooth" });
            console.log(`✅ Now on step ${step}`);
        } else {
            console.error(`❌ Step ${step} element not found!`);
        }
    }

    updateProgress(progress) {
        const percent = document.getElementById("progressPercent");
        const status = document.getElementById("progressStatus");

        if (percent) {
            percent.textContent = `${progress.progress || 0}%`;
        }
        if (status) {
            status.textContent = progress.message || 'Processing...';
        }

        console.log(`📊 Progress: ${progress.progress}% - ${progress.message}`);
    }

    // Helper methods
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
            alertElement.querySelector('span').textContent = message;
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

        if (loading) {
            button.disabled = true;
            button.querySelector('.btn-text').style.display = 'none';
            button.querySelector('.btn-loader').style.display = 'flex';
            console.log(`🔄 Button ${buttonId} loading started`);
        } else {
            button.disabled = false;
            button.querySelector('.btn-text').style.display = 'flex';
            button.querySelector('.btn-loader').style.display = 'none';
            console.log(`✅ Button ${buttonId} loading stopped`);
        }
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
