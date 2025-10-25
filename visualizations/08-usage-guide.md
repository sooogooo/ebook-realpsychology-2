# Mermaid.js Visualizations Usage Guide

## 📊 Overview

This comprehensive visualization system for the medical aesthetics consumer psychology book provides over 50+ professional diagrams covering decision processes, stakeholder relationships, psychological frameworks, assessment tools, and research methodologies.

## 🚀 Quick Start

### 1. Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@8.14.0/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="mermaid">
        flowchart TD
            A[开始] --> B[处理]
            B --> C[结束]
    </div>

    <script>
        mermaid.initialize({startOnLoad: true});
    </script>
</body>
</html>
```

### 2. Professional Integration

Copy the complete HTML template from `07-html-integration.html` and customize with your specific diagrams.

## 📁 File Structure

```
visualizations/
├── README.md                           # Project overview
├── 01-consumer-decision-journey.md    # Decision process flowcharts
├── 02-stakeholder-ecosystem.md        # Stakeholder relationship maps
├── 03-psychological-frameworks.md     # Psychological theory models
├── 04-assessment-tools.md             # Assessment tool diagrams
├── 05-research-methodologies.md        # Research methodology charts
├── 06-template-system.md              # Reusable templates
├── 07-html-integration.html           # Complete web implementation
└── 08-usage-guide.md                  # This usage guide
```

## 🎨 Color System

### Primary Colors
- **Professional Blue**: `#2E86AB` - Professional trust, medical expertise
- **Psychology Purple**: `#A23B72` - Psychology insights, healthcare
- **Success Green**: `#8FD14F` - Growth, positive outcomes
- **Warning Orange**: `#F18F01` - Risk, caution, important notices

### Usage Guidelines
```css
/* Consistent color application */
.consumer-node { fill: #E3F2FD; stroke: #2E86AB; }
.professional-node { fill: #F3E5F5; stroke: #A23B72; }
.business-node { fill: #E8F5E8; stroke: #8FD14F; }
.warning-node { fill: #FFF3E0; stroke: #F18F01; }
```

## 📋 Diagram Categories

### 1. Decision-Making Processes
- **Consumer Journey**: Complete 5-stage decision process
- **Information Search**: Multi-channel information gathering patterns
- **Risk Assessment**: Systematic risk identification and evaluation
- **Bias Correction**: Cognitive bias identification and correction strategies

### 2. Stakeholder Ecosystems
- **Multi-Party Framework**: 4-stakeholder relationship model
- **Role Interaction Networks**: Professional collaboration patterns
- **Value Exchange Networks**: Economic and psychological value flows
- **Communication Flows**: Information exchange sequences

### 3. Psychological Frameworks
- **Motivation Classification**: Intrinsic vs. extrinsic motivation analysis
- **Body Image Disorders**: Types and intervention strategies
- **Maslow's Hierarchy**: Applied to medical aesthetics needs
- **Anxiety Assessment**: Multi-dimensional anxiety evaluation

### 4. Assessment Tools
- **Decision Assessment**: Comprehensive pre-decision evaluation
- **Quality Assessment**: Information quality evaluation framework
- **Satisfaction Tracking**: Post-procedure satisfaction monitoring
- **Tool Integration**: Multi-tool assessment workflow

### 5. Research Methodologies
- **Mixed Methods Design**: Integrated quantitative-qualitative approaches
- **Action Research**: Iterative improvement cycles
- **Data Analysis Pipeline**: End-to-end data processing workflow
- **Quality Assurance**: Research quality validation framework

## 🔧 Technical Implementation

### Mermaid.js Version
- **Recommended**: v8.14.0 or higher
- **Browser Support**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Initialization Options

```javascript
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    themeVariables: {
        primaryColor: '#2E86AB',
        primaryTextColor: '#1565C0',
        lineColor: '#4A4A4A',
        fontFamily: "'Segoe UI', 'Microsoft YaHei', sans-serif",
        fontSize: 12
    },
    flowchart: {
        curve: 'basis',
        padding: 20
    },
    gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        gridLineStartPadding: 35
    }
});
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px+ (Full grid layout)
- **Tablet**: 768-1199px (2-column layout)
- **Mobile**: <768px (Single column layout)

### CSS Classes
```css
.visualization-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 30px;
}

@media (max-width: 768px) {
    .visualization-grid {
        grid-template-columns: 1fr;
    }
}
```

## 🎯 Use Cases

### 1. Academic Presentations
- Conference presentations
- Academic lectures
- Research seminars
- Thesis defense

### 2. Clinical Applications
- Patient education materials
- Clinical decision support
- Risk assessment tools
- Treatment planning

### 3. Business Intelligence
- Market analysis reports
- Consumer behavior insights
- Strategic planning
- Training materials

### 4. Web Integration
- Educational websites
- Patient portals
- Professional development platforms
- Research dissemination

## 📤 Export Options

### SVG Export (Recommended)
```javascript
function exportSVG() {
    const svg = document.querySelector('.mermaid svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    link.click();
}
```

### PNG Export
- Use Mermaid CLI: `mmdc -i input.mmd -o output.png`
- Browser screenshot tools
- Online converters (SVG to PNG)

### PDF Export
- Print to PDF from browser
- Mermaid CLI with PDF output
- Professional design software integration

## 🔍 Customization Guidelines

### 1. Color Customization
```css
:root {
    --primary-blue: #your-color;
    --secondary-purple: #your-color;
    --accent-green: #your-color;
    --warning-orange: #your-color;
}
```

### 2. Font Customization
```javascript
mermaid.initialize({
    fontFamily: "'Your Font', 'Microsoft YaHei', sans-serif",
    fontSize: 14, // Adjust size
    fontSizeUnit: 'px'
});
```

### 3. Layout Adjustments
```javascript
mermaid.initialize({
    flowchart: {
        curve: 'basis', // or 'linear', 'step'
        padding: 30    // Adjust spacing
    }
});
```

## 🚀 Advanced Features

### 1. Interactive Elements
```javascript
// Add click handlers to diagram elements
document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('click', function() {
        // Handle node click
    });
});
```

### 2. Dynamic Data Loading
```javascript
// Load data from API and update diagrams
fetch('data.json')
    .then(response => response.json())
    .then(data => updateDiagrams(data));
```

### 3. Animation Support
```css
.node {
    transition: all 0.3s ease;
}

.node:hover {
    transform: scale(1.05);
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Diagrams not rendering**
   - Check Mermaid.js is loaded properly
   - Verify syntax is correct
   - Check browser console for errors

2. **Styling not applying**
   - Ensure CSS is loaded after Mermaid
   - Check CSS selector specificity
   - Verify CSS variables are defined

3. **Export not working**
   - Check browser permissions
   - Verify SVG element exists
   - Test in different browser

### Performance Optimization
```javascript
// Lazy load large diagrams
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            mermaid.init();
        }
    });
});

document.querySelectorAll('.mermaid').forEach(diagram => {
    observer.observe(diagram);
});
```

## 📚 Best Practices

### 1. Diagram Design
- Keep diagrams simple and focused
- Use consistent color coding
- Provide clear labels and legends
- Test on different screen sizes

### 2. Content Organization
- Group related diagrams together
- Provide context and explanations
- Use descriptive titles
- Include data sources when applicable

### 3. Accessibility
- Provide alt text for diagrams
- Ensure sufficient color contrast
- Support keyboard navigation
- Consider screen reader compatibility

### 4. Performance
- Optimize diagram size and complexity
- Use lazy loading for large datasets
- Minimize external dependencies
- Test on various devices and connections

## 🔄 Maintenance

### Regular Updates
- Update Mermaid.js library regularly
- Review and update content periodically
- Test browser compatibility
- Backup custom configurations

### Content Management
- Version control for diagram changes
- Documentation of custom modifications
- Regular performance monitoring
- User feedback collection and implementation

## 📞 Support

For technical support or customization requests:
1. Check this usage guide first
2. Review Mermaid.js official documentation
3. Test in isolated environment
4. Provide specific error messages when seeking help

This comprehensive visualization system provides professional, academic-quality diagrams that effectively communicate complex psychological concepts in medical aesthetics consumer psychology.