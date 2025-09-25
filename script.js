// NewsAI Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const smoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Add loading class and remove it when content is loaded
    const handlePageLoad = () => {
        document.body.classList.add('loaded');
    };

    // Mobile navigation toggle (for future enhancement)
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    };

    // Add hover effects for better interactivity
    const enhanceInteractivity = () => {
        const articleCards = document.querySelectorAll('.article-card');
        
        articleCards.forEach(card => {
            // Add subtle animation on card hover
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    };

    // Reading progress indicator (for article pages)
    const addReadingProgress = () => {
        const article = document.querySelector('article.article-content');
        if (!article) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const articleHeight = article.offsetHeight;
            const articleTop = article.offsetTop;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const progress = Math.min(
                Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
                1
            );
            
            const progressBarElement = document.querySelector('.reading-progress-bar');
            if (progressBarElement) {
                progressBarElement.style.width = (progress * 100) + '%';
            }
        });
    };

    // Dark mode toggle (for future enhancement)
    const initDarkMode = () => {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (!darkModeToggle) return;

        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isNowDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isNowDark);
        });
    };

    // Share functionality for articles
    const initShareButtons = () => {
        const shareButtons = document.querySelectorAll('.share-button');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.dataset.url || window.location.href;
                const title = this.dataset.title || document.title;
                const platform = this.dataset.platform;
                
                let shareUrl = '';
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        break;
                    default:
                        // Native share API if available
                        if (navigator.share) {
                            navigator.share({
                                title: title,
                                url: url
                            });
                            return;
                        }
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    };

    // Search functionality (basic implementation)
    const initSearch = () => {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        
        if (!searchInput) return;
        
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                if (searchResults) searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
    };

    const performSearch = (query) => {
        // This is a basic client-side search
        // In a real implementation, this would call an API
        const articles = document.querySelectorAll('.article-card');
        const results = [];
        
        articles.forEach(article => {
            const title = article.querySelector('.article-title a')?.textContent || '';
            const excerpt = article.querySelector('.article-excerpt')?.textContent || '';
            const category = article.querySelector('.category')?.textContent || '';
            
            const searchText = (title + ' ' + excerpt + ' ' + category).toLowerCase();
            if (searchText.includes(query.toLowerCase())) {
                results.push({
                    title: title,
                    excerpt: excerpt,
                    link: article.querySelector('.article-title a')?.href || '#'
                });
            }
        });
        
        displaySearchResults(results, query);
    };

    const displaySearchResults = (results, query) => {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;
        
        // Helper function to escape HTML to prevent XSS
        const escapeHtml = (unsafe) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        
        if (results.length === 0) {
            searchResults.innerHTML = `<p>No results found for "${escapeHtml(query)}"</p>`;
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <h4><a href="${escapeHtml(result.link)}">${escapeHtml(result.title)}</a></h4>
                    <p>${escapeHtml(result.excerpt)}</p>
                </div>
            `).join('');
        }
        
        searchResults.style.display = 'block';
    };

    // Initialize all functionality
    smoothScroll();
    handlePageLoad();
    initMobileNav();
    enhanceInteractivity();
    addReadingProgress();
    initDarkMode();
    initShareButtons();
    initSearch();

    // Add some performance monitoring
    if (window.performance) {
        window.addEventListener('load', function() {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        });
    }

    // Lazy loading for images (if IntersectionObserver is supported)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Utility functions for adding new articles (for easy content management)
window.NewsAI = {
    // Helper function to escape HTML to prevent XSS
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // Function to create a new article card
    createArticleCard: function(articleData) {
        const {
            title,
            excerpt,
            category,
            date,
            readTime,
            imageUrl,
            articleUrl,
            featured = false
        } = articleData;

        // Sanitize all inputs to prevent XSS
        const safeTitle = this.escapeHtml(title);
        const safeExcerpt = this.escapeHtml(excerpt);
        const safeCategory = this.escapeHtml(category);
        const safeDate = this.escapeHtml(date);
        const safeReadTime = this.escapeHtml(readTime);
        const safeImageUrl = this.escapeHtml(imageUrl);
        const safeArticleUrl = this.escapeHtml(articleUrl);

        const articleHTML = `
            <article class="article-card${featured ? ' featured' : ''}">
                <div class="article-image">
                    <img src="${safeImageUrl}" alt="${safeTitle}">
                    ${featured ? '<div class="article-badge">Breaking</div>' : ''}
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="category">${safeCategory}</span>
                        <span class="date">${safeDate}</span>
                    </div>
                    <h3 class="article-title">
                        <a href="${safeArticleUrl}">${safeTitle}</a>
                    </h3>
                    <p class="article-excerpt">${safeExcerpt}</p>
                    <div class="article-footer">
                        <span class="read-time">${safeReadTime}</span>
                        <a href="${safeArticleUrl}" class="read-more">Read More →</a>
                    </div>
                </div>
            </article>
        `;

        return articleHTML;
    },

    // Function to add article to the grid
    addArticleToGrid: function(articleData) {
        const articlesGrid = document.querySelector('.articles-grid');
        if (articlesGrid) {
            const articleHTML = this.createArticleCard(articleData);
            articlesGrid.insertAdjacentHTML('beforeend', articleHTML);
        }
    }
};