# Mathieu Antonopoulos - Portfolio Website

A modern, premium portfolio website showcasing your computer science background with smooth animations, responsive design, and professional aesthetics.

## 🚀 Features

- **Modern Design**: Dark theme with glassmorphism effects and gradient accents
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices
- **Interactive Animations**: Scroll-triggered animations, typing effects, and smooth transitions
- **Project Filtering**: Dynamic filtering system for showcasing different types of projects
- **Contact Form**: Functional contact form with validation and success feedback
- **Navigation**: Smooth scrolling navigation with active section highlighting
- **Loading Screen**: Professional loading animation for better user experience
- **Easter Egg**: Hidden Konami code activation for fun interactions

## 📁 File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md          # This documentation file
```

## 🎨 Customization Guide

### 1. Personal Information

**In `index.html`, search for `<!-- PLACEHOLDER:` comments and replace with your information:**

#### Hero Section
- Replace `"Hi, I'm Mathieu Antonopoulos"` with your name
- Update the professional summary paragraph
- Replace profile image URL: `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=YOUR+PHOTO`

#### About Section
- Replace experience years and specializations
- Update the stats (projects completed, years of experience, technologies)
- Modify the code block with your actual information

#### Contact Information
- Update email: `your.email@example.com`
- Update phone: `+1 (555) 123-4567`
- Update location: `Your City, Country`
- Add your social media links (LinkedIn, GitHub, Twitter)

### 2. Projects Section

**For each project card, update:**
- Project title and description
- Replace placeholder images: `https://via.placeholder.com/400x250/1a1a2e/ffffff?text=PROJECT+X`
- Update technology tags
- Add live demo and GitHub repository links
- Set the correct `data-category` for filtering (web, ml, mobile)

**Example project update:**
```html
<div class="project-card" data-category="web">
    <div class="project-image">
        <img src="path/to/your/project-image.jpg" alt="Your Project Name">
        <div class="project-overlay">
            <a href="https://your-live-demo.com" class="project-link" target="_blank">
                <i class="fas fa-external-link-alt"></i>
            </a>
            <a href="https://github.com/yourusername/project-repo" class="project-link" target="_blank">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>
    <div class="project-content">
        <h3>Your Amazing Project</h3>
        <p>Detailed description of what your project does, the technologies used, and its impact.</p>
        <div class="project-tech">
            <span class="tech-tag">React</span>
            <span class="tech-tag">Node.js</span>
            <span class="tech-tag">MongoDB</span>
        </div>
    </div>
</div>
```

### 3. Education Section

**Update each timeline item with:**
- Degree name and university
- Graduation dates
- GPA (optional)
- Key achievements and coursework
- Relevant skills and technologies

### 4. Skills Section

**Customize skill categories and levels:**
- Update programming languages and their proficiency percentages
- Modify frameworks and libraries
- Add or remove tools and technologies
- Adjust skill bar percentages in `data-width` attributes

### 5. Images and Assets

**Required images to replace:**
1. **Profile Photo**: Replace the placeholder in the hero section
2. **Project Images**: Replace all project placeholder images
3. **Favicon** (optional): Add `<link rel="icon" href="favicon.ico">` to `<head>`

### 6. Color Customization

**To modify the color scheme, update CSS variables in `styles.css`:**
```css
:root {
    --primary-color: #6366f1;      /* Main accent color */
    --primary-dark: #4f46e5;       /* Darker accent */
    --primary-light: #8b5cf6;      /* Lighter accent */
    --secondary-color: #f59e0b;     /* Secondary accent */
    --accent-color: #10b981;        /* Success/accent color */
    /* ... other colors */
}
```

## 🛠️ Setup Instructions

1. **Clone or download** the repository
2. **Replace placeholders** with your personal information
3. **Add your images** to the project folder
4. **Update links** to your social media and projects
5. **Test locally** by opening `index.html` in a browser
6. **Deploy** to GitHub Pages, Netlify, or your preferred hosting platform

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🎯 SEO Optimization

**To improve SEO:**
1. Update the `<title>` tag with your name and profession
2. Add meta descriptions and keywords
3. Include Open Graph tags for social sharing
4. Add structured data (JSON-LD) for better search results

## 🚀 Deployment Options

### GitHub Pages
1. Push to a GitHub repository named `username.github.io`
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://username.github.io`

### Netlify
1. Connect your GitHub repository to Netlify
2. Auto-deploys on every commit
3. Custom domain support available

### Vercel
1. Import your GitHub repository
2. Automatic deployments and optimization
3. Excellent performance and CDN

## 🎨 Advanced Customizations

### Adding New Project Categories
1. Add a new filter button in the projects section
2. Update JavaScript filter functionality
3. Add corresponding `data-category` to project cards

### Custom Animations
- Modify animation delays in `script.js`
- Adjust CSS transition durations in `styles.css`
- Add new animation classes using the existing pattern

### Contact Form Integration
To make the contact form functional:
1. **Netlify Forms**: Add `data-netlify="true"` to the form tag
2. **Formspree**: Update form action to Formspree endpoint
3. **EmailJS**: Integrate EmailJS for client-side email sending

## 🎭 Easter Eggs

The portfolio includes a hidden Konami Code easter egg:
- **Sequence**: ↑↑↓↓←→←→BA
- **Effect**: Activates rainbow animation mode
- **Duration**: 10 seconds of colorful fun!

## 🔧 Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Not supported (uses modern CSS features)

## 📦 Dependencies

The portfolio uses minimal external dependencies:
- **Google Fonts**: Inter font family
- **Font Awesome**: Icons (loaded via CDN)
- **No JavaScript frameworks**: Pure vanilla JS for better performance

## 🤝 Contributing

Feel free to customize this portfolio template and make it your own! If you create cool enhancements, consider sharing them back with the community.

## 📄 License

This portfolio template is free to use for personal projects. Feel free to modify and distribute as needed.

---

**Happy coding! 🚀**

*Remember to replace all placeholder content with your actual information to make this portfolio truly yours.*