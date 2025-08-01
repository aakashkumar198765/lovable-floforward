// Documentation Website JavaScript

class DocumentationSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupTabs();
        this.setupCodeCopy();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupComponentInteractions();
        this.setupThemeToggle();
    }

    // Navigation Setup
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .nav-section a');
        const sections = document.querySelectorAll('.section');

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Handle nav clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const navSections = document.querySelectorAll('.nav-section');

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            navSections.forEach(section => {
                const links = section.querySelectorAll('a');
                let hasVisibleLinks = false;

                links.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    const listItem = link.parentElement;
                    
                    if (text.includes(searchTerm) || searchTerm === '') {
                        listItem.style.display = 'block';
                        hasVisibleLinks = true;
                    } else {
                        listItem.style.display = 'none';
                    }
                });

                // Hide section if no matching links
                section.style.display = hasVisibleLinks || searchTerm === '' ? 'block' : 'none';
            });
        });
    }

    // Tab System
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showTab(targetTab, button);
            });
        });
    }

    showTab(tabId, activeButton) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show target tab and activate button
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        activeButton.classList.add('active');
    }

    // Code Copy Functionality
    setupCodeCopy() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.copyCode(button);
            });
        });
    }

    copyCode(button) {
        const codeBlock = button.previousElementSibling.querySelector('code');
        const text = codeBlock.textContent;

        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success-500)';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = 'var(--gray-700)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        // Handle hash links on page load
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // Theme Toggle Setup
    setupThemeToggle() {
        // Initialize theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Find theme toggle buttons and set up event listeners
        const themeToggleBtns = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
        
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleTheme();
            });
        });

        // Update theme toggle button states
        this.updateThemeToggleButtons(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeToggleButtons(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeToggleButtons(theme) {
        const themeToggleBtns = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
        
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    btn.setAttribute('title', 'Switch to light mode');
                } else {
                    icon.className = 'fas fa-moon';
                    btn.setAttribute('title', 'Switch to dark mode');
                }
            }
        });
    }

    // Component Interactions
    setupComponentInteractions() {
        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryType = card.getAttribute('onclick');
                if (categoryType) {
                    // Extract category from onclick attribute
                    const match = categoryType.match(/'([^']+)'/);
                    if (match) {
                        this.showComponents(match[1]);
                    }
                }
            });
        });

        // Component detail buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const onclick = button.getAttribute('onclick');
                if (onclick) {
                    // Extract function call from onclick
                    if (onclick.includes('showComponentDetails')) {
                        const match = onclick.match(/'([^']+)'/);
                        if (match) {
                            this.showComponentDetails(match[1]);
                        }
                    } else if (onclick.includes('showComponentAPI')) {
                        const match = onclick.match(/'([^']+)'/);
                        if (match) {
                            this.showComponentAPI(match[1]);
                        }
                    }
                }
            });
        });
    }

    // Show Components by Category
    showComponents(category) {
        const sectionId = this.getCategorySectionId(category);
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            history.pushState(null, null, `#${sectionId}`);
        }
    }

    getCategorySectionId(category) {
        const categoryMap = {
            'atoms': 'form-components',
            'molecules': 'data-components',
            'organisms': 'data-grids',
            'templates': 'layout-templates'
        };
        return categoryMap[category] || 'components';
    }

    // Show Component Details
    showComponentDetails(componentName) {
        // Create modal for component details
        const modal = this.createModal(`${componentName} Component Details`, 
            this.getComponentDetailsContent(componentName));
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Show Component API
    showComponentAPI(componentName) {
        // Create modal for API reference
        const modal = this.createModal(`${componentName} API Reference`, 
            this.getComponentAPIContent(componentName));
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Create Modal
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: var(--space-4);
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: var(--radius-lg);
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        `;

        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-6);
            border-bottom: 1px solid var(--gray-200);
        `;

        const modalBody = modal.querySelector('.modal-body');
        modalBody.style.cssText = `
            padding: var(--space-6);
        `;

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--gray-500);
            cursor: pointer;
            padding: var(--space-2);
        `;

        // Add active state styles
        modal.classList.add = function(className) {
            if (className === 'active') {
                this.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
            }
        };

        // Close modal functionality
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    // Get Component Details Content
    getComponentDetailsContent(componentName) {
        const componentDetails = {
            'button': `
                <h4>Button Component Overview</h4>
                <p>The Button component is a versatile, accessible button that supports multiple variants, sizes, loading states, and enterprise features.</p>
                
                <h5>Key Features</h5>
                <ul>
                    <li><strong>10 Variants:</strong> primary, secondary, tertiary, outline, danger, success, warning, ghost, link</li>
                    <li><strong>5 Sizes:</strong> xs, sm, md, lg, xl</li>
                    <li><strong>Loading States:</strong> Built-in spinner and disabled state</li>
                    <li><strong>Icon Support:</strong> Left and right icon positioning</li>
                    <li><strong>Link Mode:</strong> Renders as anchor tag when href provided</li>
                    <li><strong>Enterprise Features:</strong> Commerce state awareness, audit trails, RBAC</li>
                </ul>

                <h5>Usage Examples</h5>
                <div class="code-example">
                    <pre><code class="language-jsx">// Basic usage
&lt;Button variant="primary"&gt;Click me&lt;/Button&gt;

// With icon and loading
&lt;Button 
  variant="secondary" 
  iconLeft={&lt;SaveIcon /&gt;}
  loading={isLoading}
&gt;
  Save
&lt;/Button&gt;

// Enterprise features
&lt;Button
  commerceState="execution"
  userRole={{ permissions: ['approve'] }}
  auditTrail={{ enabled: true }}
&gt;
  Approve
&lt;/Button&gt;</code></pre>
                </div>
            `,
            'input': `
                <h4>Input Component Overview</h4>
                <p>A comprehensive input component with validation, accessibility, and enterprise features built-in.</p>
                
                <h5>Key Features</h5>
                <ul>
                    <li><strong>8 Input Types:</strong> text, email, password, number, tel, url, search, date</li>
                    <li><strong>Built-in Validation:</strong> Pattern matching, length constraints, required fields</li>
                    <li><strong>Icon Support:</strong> Left and right icon positioning</li>
                    <li><strong>Status States:</strong> default, error, warning, success</li>
                    <li><strong>Accessibility:</strong> ARIA labels, descriptions, keyboard navigation</li>
                    <li><strong>Enterprise Ready:</strong> Audit trails, commerce state awareness</li>
                </ul>

                <h5>Usage Examples</h5>
                <div class="code-example">
                    <pre><code class="language-jsx">// Basic usage
&lt;Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
  required
/&gt;

// With validation and icons
&lt;Input
  label="Password"
  type="password"
  leftIcon={&lt;LockIcon /&gt;}
  status="error"
  errorMessage="Password must be at least 8 characters"
  minLength={8}
/&gt;</code></pre>
                </div>
            `,
            'select': `
                <h4>Select Component Overview</h4>
                <p>Feature-rich select component with search, multiple selection, grouping, and custom rendering.</p>
                
                <h5>Key Features</h5>
                <ul>
                    <li><strong>Searchable:</strong> Built-in search functionality</li>
                    <li><strong>Multi-select:</strong> Support for selecting multiple options</li>
                    <li><strong>Option Groups:</strong> Organize options into categories</li>
                    <li><strong>Custom Rendering:</strong> Icons, descriptions, and custom option templates</li>
                    <li><strong>Badge Display:</strong> Show selected options as badges</li>
                    <li><strong>Async Loading:</strong> Support for dynamic option loading</li>
                </ul>

                <h5>Usage Examples</h5>
                <div class="code-example">
                    <pre><code class="language-jsx">// Basic usage
&lt;Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
/&gt;

// Multi-select with search
&lt;Select
  label="Skills"
  multiple
  searchable
  showBadges
  options={skillOptions}
  maxSelections={5}
/&gt;</code></pre>
                </div>
            `
        };

        return componentDetails[componentName] || `
            <h4>${componentName} Component</h4>
            <p>Detailed documentation for the ${componentName} component is coming soon.</p>
        `;
    }

    // Get Component API Content
    getComponentAPIContent(componentName) {
        const apiContent = {
            'button': `
                <h4>Button Props</h4>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>variant</code></td>
                                <td><code>'primary' | 'secondary' | 'tertiary' | 'outline' | 'danger' | 'success' | 'warning' | 'ghost' | 'link'</code></td>
                                <td><code>'primary'</code></td>
                                <td>Visual style variant</td>
                            </tr>
                            <tr>
                                <td><code>size</code></td>
                                <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
                                <td><code>'md'</code></td>
                                <td>Button size</td>
                            </tr>
                            <tr>
                                <td><code>disabled</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Disable the button</td>
                            </tr>
                            <tr>
                                <td><code>loading</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Show loading state</td>
                            </tr>
                            <tr>
                                <td><code>fullWidth</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Make button full width</td>
                            </tr>
                            <tr>
                                <td><code>iconLeft</code></td>
                                <td><code>React.ReactNode</code></td>
                                <td><code>-</code></td>
                                <td>Icon to display on the left</td>
                            </tr>
                            <tr>
                                <td><code>iconRight</code></td>
                                <td><code>React.ReactNode</code></td>
                                <td><code>-</code></td>
                                <td>Icon to display on the right</td>
                            </tr>
                            <tr>
                                <td><code>href</code></td>
                                <td><code>string</code></td>
                                <td><code>-</code></td>
                                <td>Render as link when provided</td>
                            </tr>
                            <tr>
                                <td><code>onClick</code></td>
                                <td><code>(event: MouseEvent) => void</code></td>
                                <td><code>-</code></td>
                                <td>Click event handler</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4>Enterprise Props</h4>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>commerceState</code></td>
                                <td><code>'initiation' | 'agreement' | 'execution' | 'settlement' | 'completion'</code></td>
                                <td>Commerce transaction state</td>
                            </tr>
                            <tr>
                                <td><code>allowedActions</code></td>
                                <td><code>string[]</code></td>
                                <td>List of allowed actions for RBAC</td>
                            </tr>
                            <tr>
                                <td><code>userRole</code></td>
                                <td><code>{ name: string; permissions: string[] }</code></td>
                                <td>User role information</td>
                            </tr>
                            <tr>
                                <td><code>auditTrail</code></td>
                                <td><code>{ enabled: boolean; logUserActions: boolean }</code></td>
                                <td>Audit trail configuration</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            'input': `
                <h4>Input Props</h4>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>type</code></td>
                                <td><code>'text' | 'email' | 'password' | 'number' | 'tel' | 'url'</code></td>
                                <td><code>'text'</code></td>
                                <td>Input type</td>
                            </tr>
                            <tr>
                                <td><code>size</code></td>
                                <td><code>'sm' | 'md' | 'lg'</code></td>
                                <td><code>'md'</code></td>
                                <td>Input size</td>
                            </tr>
                            <tr>
                                <td><code>variant</code></td>
                                <td><code>'default' | 'outlined' | 'filled'</code></td>
                                <td><code>'default'</code></td>
                                <td>Visual variant</td>
                            </tr>
                            <tr>
                                <td><code>status</code></td>
                                <td><code>'default' | 'error' | 'warning' | 'success'</code></td>
                                <td><code>'default'</code></td>
                                <td>Validation status</td>
                            </tr>
                            <tr>
                                <td><code>label</code></td>
                                <td><code>string</code></td>
                                <td><code>-</code></td>
                                <td>Input label</td>
                            </tr>
                            <tr>
                                <td><code>placeholder</code></td>
                                <td><code>string</code></td>
                                <td><code>-</code></td>
                                <td>Placeholder text</td>
                            </tr>
                            <tr>
                                <td><code>helperText</code></td>
                                <td><code>string</code></td>
                                <td><code>-</code></td>
                                <td>Helper text below input</td>
                            </tr>
                            <tr>
                                <td><code>errorMessage</code></td>
                                <td><code>string</code></td>
                                <td><code>-</code></td>
                                <td>Error message to display</td>
                            </tr>
                            <tr>
                                <td><code>leftIcon</code></td>
                                <td><code>React.ReactNode</code></td>
                                <td><code>-</code></td>
                                <td>Icon on the left side</td>
                            </tr>
                            <tr>
                                <td><code>rightIcon</code></td>
                                <td><code>React.ReactNode</code></td>
                                <td><code>-</code></td>
                                <td>Icon on the right side</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            'select': `
                <h4>Select Props</h4>
                <div class="api-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Type</th>
                                <th>Default</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>options</code></td>
                                <td><code>SelectOption[]</code></td>
                                <td><code>[]</code></td>
                                <td>Array of options</td>
                            </tr>
                            <tr>
                                <td><code>multiple</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Allow multiple selection</td>
                            </tr>
                            <tr>
                                <td><code>searchable</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Enable search functionality</td>
                            </tr>
                            <tr>
                                <td><code>clearable</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Show clear button</td>
                            </tr>
                            <tr>
                                <td><code>showBadges</code></td>
                                <td><code>boolean</code></td>
                                <td><code>true</code></td>
                                <td>Show selected options as badges</td>
                            </tr>
                            <tr>
                                <td><code>maxSelections</code></td>
                                <td><code>number</code></td>
                                <td><code>-</code></td>
                                <td>Maximum number of selections</td>
                            </tr>
                            <tr>
                                <td><code>placeholder</code></td>
                                <td><code>string</code></td>
                                <td><code>'Select...'</code></td>
                                <td>Placeholder text</td>
                            </tr>
                            <tr>
                                <td><code>onChange</code></td>
                                <td><code>(value: string | string[]) => void</code></td>
                                <td><code>-</code></td>
                                <td>Value change handler</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4>SelectOption Interface</h4>
                <div class="code-example">
                    <pre><code class="language-typescript">interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}</code></pre>
                </div>
            `
        };

        return apiContent[componentName] || `
            <h4>${componentName} API Reference</h4>
            <p>API documentation for the ${componentName} component is coming soon.</p>
        `;
    }
}

// Global functions for onclick handlers
function showTab(tabId, button) {
    window.docSite.showTab(tabId, button);
}

function copyCode(button) {
    window.docSite.copyCode(button);
}

function showComponents(category) {
    window.docSite.showComponents(category);
}

function showComponentDetails(componentName) {
    window.docSite.showComponentDetails(componentName);
}

function showComponentAPI(componentName) {
    window.docSite.showComponentAPI(componentName);
}

function toggleTheme() {
    if (window.docSite) {
        window.docSite.toggleTheme();
    }
}

// Initialize documentation site
document.addEventListener('DOMContentLoaded', () => {
    window.docSite = new DocumentationSite();

    // Add API table styles
    const style = document.createElement('style');
    style.textContent = `
        .api-table {
            margin: var(--space-4) 0;
            overflow-x: auto;
        }

        .api-table table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-md);
            overflow: hidden;
        }

        .api-table th,
        .api-table td {
            padding: var(--space-3);
            text-align: left;
            border-bottom: 1px solid var(--gray-200);
            font-size: 0.875rem;
        }

        .api-table th {
            background: var(--gray-50);
            font-weight: 600;
            color: var(--gray-700);
        }

        .api-table code {
            background: var(--gray-100);
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            color: var(--gray-800);
            font-family: var(--font-mono);
        }

        .code-example {
            margin: var(--space-4) 0;
        }

        .code-example pre {
            background: var(--gray-900);
            color: var(--gray-100);
            padding: var(--space-4);
            border-radius: var(--radius-md);
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            line-height: 1.6;
        }

        .modal-overlay.active {
            opacity: 1 !important;
        }

        .modal-overlay.active .modal-content {
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentationSite;
}