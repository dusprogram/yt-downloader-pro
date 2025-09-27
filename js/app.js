// frontend/js/app.js - Updated for Production Deployment
// Updated with your Railway backend URL

// Production API configuration - YOUR ACTUAL BACKEND URL
const API_BASE_URL = "https://yt-downloader-pro-v1-dus.railway.app";

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
    this.setupTheme();
    this.setupEventListeners();
    console.log("🚀 YouTube Downloader Pro initialized - Production Mode");
    console.log("🔗 Backend API:", API_BASE_URL);
  }

  setupTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // URL input events
    const urlInput = document.getElementById("videoUrl");
    urlInput.addEventListener("input", (e) => {
      this.handleUrlInput(e.target.value);
    });

    urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.getVideoInfo();
      }
    });

    // Clear URL
    document.getElementById("clearUrl").addEventListener("click", () => {
      this.clearUrl();
    });

    // Get video info button
    document.getElementById("getInfoBtn").addEventListener("click", () => {
      this.getVideoInfo();
    });

    // Download tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.closest(".tab-btn").getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Download button
    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.startDownload();
    });

    // Final download button
    document
      .getElementById("finalDownloadBtn")
      .addEventListener("click", () => {
        this.downloadFile();
      });
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("theme", this.theme);
    this.showToast(`Switched to ${this.theme} theme`, "success");
  }

  handleUrlInput(value) {
    const clearBtn = document.getElementById("clearUrl");
    clearBtn.style.display = value ? "block" : "none";
    this.hideAlert("urlError");
  }

  clearUrl() {
    document.getElementById("videoUrl").value = "";
    document.getElementById("clearUrl").style.display = "none";
    this.hideAlert("urlError");
  }

  goToStep(step) {
    // Hide all steps
    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active");
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add("active");
    this.currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async getVideoInfo() {
    const url = document.getElementById("videoUrl").value.trim();

    if (!url) {
      this.showAlert("urlError", "Please enter a YouTube URL");
      return;
    }

    if (!this.isValidYouTubeURL(url)) {
      this.showAlert("urlError", "Please enter a valid YouTube URL");
      return;
    }

    this.hideAlert("urlError");
    this.setButtonLoading("getInfoBtn", true);

    try {
      console.log(
        "🔍 Fetching video info from:",
        API_BASE_URL + "/get_video_info"
      );

      // Updated API call with your Railway backend
      const response = await fetch(API_BASE_URL + "/get_video_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        this.videoData = data;
        this.displayVideoPreview(data);
        this.displayFormats(data);
        this.goToStep(2);
        this.showToast("Video info loaded successfully!", "success");
      } else {
        this.showAlert(
          "urlError",
          data.error || "Failed to get video information"
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      let errorMessage = "Network error. Please try again.";

      if (error.message.includes("CORS")) {
        errorMessage = "CORS error - Backend configuration issue";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error - Please try again later";
      } else if (error.message.includes("404")) {
        errorMessage = "API endpoint not found";
      }

      this.showAlert("urlError", errorMessage);
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
        type: this.selectedFormat.convert ? "audio" : "video",
        quality: this.selectedFormat.quality,
        title: this.videoData.title,
      };

      console.log("🚀 Starting download via:", API_BASE_URL + "/download");

      // Updated API call with your Railway backend
      const response = await fetch(API_BASE_URL + "/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadData),
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
      console.error("Download Error:", error);
      this.showAlert("formatError", "Network error. Please try again.");
    }
  }

  async startProgressTracking() {
    this.progressInterval = setInterval(async () => {
      try {
        // Updated progress API call with your Railway backend
        const response = await fetch(
          API_BASE_URL + `/progress/${this.currentDownloadId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const progress = await response.json();
        this.updateProgress(progress);

        if (progress.status === "completed") {
          clearInterval(this.progressInterval);
          this.goToStep(4);
          this.setupFinalDownload();
          this.showToast("Download completed!", "success");
        } else if (progress.status === "error") {
          clearInterval(this.progressInterval);
          this.showAlert("formatError", progress.message || "Download failed");
          this.goToStep(2);
        }
      } catch (error) {
        console.error("Progress tracking error:", error);
        // Continue trying for a while
      }
    }, 1000);
  }

  setupFinalDownload() {
    const finalDownloadBtn = document.getElementById("finalDownloadBtn");
    if (finalDownloadBtn) {
      finalDownloadBtn.onclick = () => {
        // Updated download URL with your Railway backend
        const downloadUrl =
          API_BASE_URL + `/download_file/${this.currentDownloadId}`;
        console.log("📥 Downloading file from:", downloadUrl);
        window.open(downloadUrl, "_blank");
      };
    }
  }

  downloadFile() {
    if (this.currentDownloadId) {
      // Updated download URL with your Railway backend
      const downloadUrl =
        API_BASE_URL + `/download_file/${this.currentDownloadId}`;
      window.open(downloadUrl, "_blank");
    }
  }

  // Keep all existing helper methods...
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
    const text = button.querySelector(".btn-text");
    const loader = button.querySelector(".btn-loader");

    if (loading) {
      button.disabled = true;
      if (text) text.style.display = "none";
      if (loader) loader.style.display = "flex";
    } else {
      button.disabled = false;
      if (text) text.style.display = "flex";
      if (loader) loader.style.display = "none";
    }
  }

  showToast(message, type = "info") {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "info-circle"
            }"></i>
            <span>${message}</span>
        `;

    // Add to container or body
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  displayVideoPreview(data) {
    const preview = document.getElementById("videoPreview");
    const duration = this.formatDuration(data.duration);
    const views = this.formatNumber(data.view_count);

    preview.innerHTML = `
            <div class="video-card">
                <div class="video-thumbnail-wrapper">
                    <img src="${data.thumbnail}" alt="${data.title}" class="video-thumbnail" onerror="this.style.display='none'">
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
    this.displayVideoFormats(data.video_formats);
    this.displayAudioFormats(data.audio_formats);
  }

  displayVideoFormats(formats) {
    const container = document.getElementById("videoFormatsContainer");
    if (!container) return;

    let html = "";

    // Sort qualities by resolution (highest first)
    const sortedQualities = Object.keys(formats).sort((a, b) => {
      const aHeight = parseInt(a.replace("p", ""));
      const bHeight = parseInt(b.replace("p", ""));
      return bHeight - aHeight;
    });

    sortedQualities.forEach((quality) => {
      const qualityFormats = formats[quality];

      Object.entries(qualityFormats).forEach(([ext, format]) => {
        const fileSize = format.filesize
          ? this.formatFileSize(format.filesize)
          : "Unknown size";
        const hasAudio = format.has_audio ? "Video + Audio" : "Video Only";

        html += `
                    <div class="format-card" data-format='${JSON.stringify(
                      format
                    )}' data-type="video">
                        <div class="format-info">
                            <div class="format-details">
                                <h4><i class="fas fa-video"></i> ${quality} ${ext.toUpperCase()}</h4>
                                <p>${format.width || "N/A"}x${
          format.height || "N/A"
        } • ${format.fps || 30}fps • ${fileSize}</p>
                            </div>
                        </div>
                        <div class="format-badge ${
                          format.has_audio ? "has-audio" : "video-only"
                        }">
                            ${hasAudio}
                        </div>
                    </div>
                `;
      });
    });

    if (!html) {
      html = '<div class="no-formats">No video formats available</div>';
    }

    container.innerHTML = html;

    // Add click listeners
    container.querySelectorAll(".format-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.selectFormat(card, "video");
      });
    });
  }

  displayAudioFormats(formats) {
    const container = document.getElementById("audioFormatsContainer");
    if (!container) return;

    let html = "";

    Object.entries(formats).forEach(([ext, qualities]) => {
      Object.entries(qualities).forEach(([quality, format]) => {
        const fileSize = format.filesize
          ? this.formatFileSize(format.filesize)
          : "Estimated size";

        html += `
                    <div class="format-card" data-format='${JSON.stringify(
                      format
                    )}' data-type="audio">
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

    // Add click listeners
    container.querySelectorAll(".format-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.selectFormat(card, "audio");
      });
    });
  }

  selectFormat(card, type) {
    // Remove previous selections
    document.querySelectorAll(".format-card").forEach((c) => {
      c.classList.remove("selected");
    });

    // Select current card
    card.classList.add("selected");

    // Store selected format
    this.selectedFormat = JSON.parse(card.dataset.format);

    // Enable download button
    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
      downloadBtn.disabled = false;
    }

    this.hideAlert("formatError");
  }

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

    // Update format sections
    document.querySelectorAll(".format-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(`${tab}Section`).classList.add("active");

    // Clear selection when switching tabs
    document.querySelectorAll(".format-card").forEach((card) => {
      card.classList.remove("selected");
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
    if (status) status.textContent = progress.message || "Processing...";
    if (speed) speed.textContent = progress.speed || "--";
    if (eta) eta.textContent = progress.eta || "--";

    // Update circular progress
    const circle = document.getElementById("progressCircle");
    if (circle) {
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (progress.progress / 100) * circumference;
      circle.style.background = `conic-gradient(
                var(--primary-color) ${progress.progress * 3.6}deg,
                var(--border-primary) ${progress.progress * 3.6}deg
            )`;
    }
  }

  formatDuration(seconds) {
    if (!seconds) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  formatFileSize(bytes) {
    if (!bytes) return "Unknown";
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + "GB";
    } else if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + "MB";
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(1) + "KB";
    }
    return bytes + "B";
  }
}

// Global functions
function scrollToDownloader() {
  const downloaderSection = document.getElementById("step1");
  if (downloaderSection) {
    downloaderSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
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

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.downloader = new YouTubeDownloader();
  console.log("✅ YouTube Downloader Pro loaded successfully!");
  console.log("🌐 Frontend:", window.location.origin);
  console.log("⚡ Backend:", API_BASE_URL);
});
