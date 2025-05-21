document.addEventListener('DOMContentLoaded', function() {
    // Demo credentials (in a real app, this would be handled server-side)
    const demoCredentials = {
        admin: {
            username: 'admin',
            password: '123'
        },
        user: {
            username: 'user',
            password: '123'
        }
    };

    // DOM element references
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    const adminUsernameDisplay = document.getElementById('admin-username');
    const userUsernameDisplay = document.getElementById('user-username');
    
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const userLogoutBtn = document.getElementById('user-logout-btn');
    
    const adminLastUpdateEl = document.getElementById('admin-last-update');
    const userLastUpdateEl = document.getElementById('user-last-update');
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        
        // Determine which credentials to check based on selected role
        let isValidCredentials = false;
        let dashboardId = '';
        let usernameDisplay = null;
        
        if (role === 'admin') {
            isValidCredentials = (username === demoCredentials.admin.username && 
                                 password === demoCredentials.admin.password);
            dashboardId = 'admin-dashboard';
            usernameDisplay = adminUsernameDisplay;
        } else {
            isValidCredentials = (username === demoCredentials.user.username && 
                                 password === demoCredentials.user.password);
            dashboardId = 'user-dashboard';
            usernameDisplay = userUsernameDisplay;
        }
        
        if (isValidCredentials) {
            // Successful login
            loginError.textContent = '';
            usernameDisplay.textContent = username;
            
            // Switch to appropriate dashboard
            document.getElementById('login-page').classList.remove('active');
            document.getElementById(dashboardId).classList.add('active');
            
            // Start mock data updates
            startMockUpdates(role);
        } else {
            // Failed login
            loginError.textContent = 'Invalid username or password. Please try again.';
        }

        initRackDetailView();
    });

    // Initialize rack detail view
    function initRackDetailView() {
    // Get all rack cards
    const rackCards = document.querySelectorAll('.rack-card');
    
    // Add click event to each rack card
    rackCards.forEach(rack => {
        rack.addEventListener('click', function() {
            const rackName = this.querySelector('h4').textContent;
            const isOnline = this.querySelector('.status-badge').classList.contains('online');
            
            // Set rack detail information
            document.getElementById('rack-detail-title').textContent = rackName;
            document.getElementById('rack-type').textContent = getRackType(rackName);
            
            // Update 3D rack status
            const rack3d = document.querySelector('.rack-3d');
            const rackStatusIndicator = document.querySelector('.rack-status-indicator');
            
            if (isOnline) {
                rack3d.classList.remove('offline');
                rack3d.classList.add('online');
                rackStatusIndicator.classList.remove('offline');
                rackStatusIndicator.classList.add('online');
                rackStatusIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Online';
            } else {
                rack3d.classList.remove('online');
                rack3d.classList.add('offline');
                rackStatusIndicator.classList.remove('online');
                rackStatusIndicator.classList.add('offline');
                rackStatusIndicator.innerHTML = '<i class="fas fa-exclamation-circle"></i> Offline';
            }
            
            // Show the rack detail view
            document.getElementById('rack-detail-view').classList.add('active');
            
            // Update timestamp
            const now = new Date();
            const timeString = now.toLocaleString();
            document.getElementById('rack-detail-last-update').textContent = timeString;
            
            // Start updating node stats
            startNodeStatsUpdates();
        });
    });
    
    // Back button functionality
    document.getElementById('back-to-overview').addEventListener('click', function() {
        document.getElementById('rack-detail-view').classList.remove('active');
        stopNodeStatsUpdates();
    });
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to selected tab and button
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Rack refresh button
    const rackRefreshBtn = document.getElementById('rack-refresh-btn');
    if (rackRefreshBtn) {
        rackRefreshBtn.addEventListener('click', function() {
            updateNodeStats();
            
            // Update timestamp
            const now = new Date();
            const timeString = now.toLocaleString();
            document.getElementById('rack-detail-last-update').textContent = timeString;
            
            // Add a refreshing animation
            this.classList.add('refreshing');
            setTimeout(() => {
                this.classList.remove('refreshing');
            }, 1000);
        });
    }
}

// Get rack type based on name
function getRackType(rackName) {
    if (rackName.includes('Compute')) {
        return 'Compute';
    } else if (rackName.includes('GPU')) {
        return 'GPU';
    } else if (rackName.includes('High-Mem')) {
        return 'High Memory';
    } else if (rackName.includes('Storage')) {
        return 'Storage';
    } else if (rackName.includes('Interactive')) {
        return 'Interactive';
    } else if (rackName.includes('Management')) {
        return 'Management';
    } else {
        return 'General Purpose';
    }
}

// Node stats updates
let nodeStatsInterval;

// Start node stats updates
function startNodeStatsUpdates() {
    // Update immediately
    updateNodeStats();
    
    // Then update every 5 seconds
    nodeStatsInterval = setInterval(function() {
        updateNodeStats();
    }, 5000);
}

// Stop node stats updates
function stopNodeStatsUpdates() {
    clearInterval(nodeStatsInterval);
}

// Update node stats with random fluctuations
function updateNodeStats() {
    // Update node gauges with small random changes
    const nodeGauges = document.querySelectorAll('.node-card:not(.offline) .mini-gauge-fill');
    const gaugeValues = document.querySelectorAll('.node-card:not(.offline) .node-stat .value');
    
    nodeGauges.forEach((gauge, index) => {
        if (gauge.closest('.node-card').classList.contains('idle')) {
            // Idle nodes have low utilization
            const newValue = Math.max(5, Math.min(15, Math.floor(Math.random() * 10) + 5));
            gauge.style.width = `${newValue}%`;
            
            // Update the corresponding value text if it exists
            if (gaugeValues[index]) {
                gaugeValues[index].textContent = `${newValue}%`;
            }
        } else {
            // Busy nodes have high utilization
            let currentValue = parseInt(gauge.style.width);
            if (isNaN(currentValue)) currentValue = 70; // Default if not set
            
            // Random fluctuation between -5% and +5%
            const change = Math.floor(Math.random() * 11) - 5;
            const newValue = Math.max(60, Math.min(98, currentValue + change));
            
            gauge.style.width = `${newValue}%`;
            
            // Update the corresponding value text if it exists
            if (gaugeValues[index]) {
                gaugeValues[index].textContent = `${newValue}%`;
            }
        }
    });
    
    // Update job table gauges
    const jobGauges = document.querySelectorAll('.rack-jobs-table .mini-gauge-fill');
    jobGauges.forEach(gauge => {
        let currentValue = parseInt(gauge.style.width);
        if (isNaN(currentValue)) currentValue = 70; // Default if not set
        
        // Random fluctuation between -3% and +3%
        const change = Math.floor(Math.random() * 7) - 3;
        const newValue = Math.max(50, Math.min(98, currentValue + change));
        
        gauge.style.width = `${newValue}%`;
    });
    
    // Update stats charts
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        let currentHeight = parseInt(bar.style.height);
        if (isNaN(currentHeight)) currentHeight = 70; // Default if not set
        
        // Random fluctuation between -5% and +5%
        const change = Math.floor(Math.random() * 11) - 5;
        const newHeight = Math.max(20, Math.min(95, currentHeight + change));
        
        bar.style.height = `${newHeight}%`;
        bar.setAttribute('data-value', `${newHeight}%`);
    });
}
    // Handle admin logout
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            logoutUser('admin-dashboard');
        });
    }
    
    // Handle user logout
    if (userLogoutBtn) {
        userLogoutBtn.addEventListener('click', function() {
            logoutUser('user-dashboard');
        });
    }
    
    // Logout function
    function logoutUser(dashboardId) {
        // Switch back to login page
        document.getElementById(dashboardId).classList.remove('active');
        document.getElementById('login-page').classList.add('active');
        
        // Clear form fields
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        loginError.textContent = '';
        
        // Stop mock updates
        stopMockUpdates();
    }

    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleString();
        
        if (adminLastUpdateEl) adminLastUpdateEl.textContent = timeString;
        if (userLastUpdateEl) userLastUpdateEl.textContent = timeString;
    }
    
    // Mock data update variables
    let updateInterval;
    
    // Start mock data updates
    function startMockUpdates(role) {
        // Update immediately
        updateMockData(role);
        updateTimestamp();
        
        // Then update every 5 seconds
        updateInterval = setInterval(function() {
            updateMockData(role);
            updateTimestamp();
        }, 5000);
    }
    
    // Stop mock data updates
    function stopMockUpdates() {
        clearInterval(updateInterval);
    }
    
    // Add refresh button event listeners
    const adminRefreshBtn = document.getElementById('refresh-btn');
    if (adminRefreshBtn) {
        adminRefreshBtn.addEventListener('click', function() {
            updateMockData('admin');
            updateTimestamp();
            
            // Add a refreshing animation
            this.classList.add('refreshing');
            setTimeout(() => {
                this.classList.remove('refreshing');
            }, 1000);
        });
    }
    
    const userRefreshBtn = document.getElementById('user-refresh-btn');
    if (userRefreshBtn) {
        userRefreshBtn.addEventListener('click', function() {
            updateMockData('user');
            updateTimestamp();
            
            // Add a refreshing animation
            this.classList.add('refreshing');
            setTimeout(() => {
                this.classList.remove('refreshing');
            }, 1000);
        });
    }
    
    // Update mock data with random fluctuations
    function updateMockData(role) {
        if (role === 'admin') {
            updateAdminDashboardData();
        } else {
            updateUserDashboardData();
        }
    }
    
    // Update admin dashboard data
    function updateAdminDashboardData() {
        // Update rack utilization meters with small random changes
        const utilizationMeters = document.querySelectorAll('.rack-card .meter-fill');
        const utilizationValues = document.querySelectorAll('.rack-card .meter-value');
        
        utilizationMeters.forEach((meter, index) => {
            let currentValue = parseInt(meter.style.width);
            if (isNaN(currentValue)) currentValue = 70; // Default if not set
            
            // Random fluctuation between -5% and +5%
            const change = Math.floor(Math.random() * 11) - 5;
            const newValue = Math.max(10, Math.min(98, currentValue + change));
            
            meter.style.width = `${newValue}%`;
            if (utilizationValues[index]) {
                utilizationValues[index].textContent = `${newValue}%`;
            }
        });
        
        // Update job progress bars
        const progressBars = document.querySelectorAll('.admin-jobs-table .progress-fill');
        progressBars.forEach(bar => {
            let currentValue = parseInt(bar.style.width);
            if (isNaN(currentValue)) currentValue = 50; // Default if not set
            
            // Progress increases by 1-3%
            const increase = Math.floor(Math.random() * 3) + 1;
            const newValue = Math.min(100, currentValue + increase);
            
            bar.style.width = `${newValue}%`;
        });
    }
    
    // Update user dashboard data
    function updateUserDashboardData() {
        // Update job progress bars
        const progressBars = document.querySelectorAll('.job-card .progress-fill');
        const progressValues = document.querySelectorAll('.job-card .progress-label span:last-child');
        
        progressBars.forEach((bar, index) => {
            let currentValue = parseInt(bar.style.width);
            if (isNaN(currentValue)) currentValue = 50; // Default if not set
            
            // Progress increases by 1-3%
            const increase = Math.floor(Math.random() * 3) + 1;
            const newValue = Math.min(100, currentValue + increase);
            
            bar.style.width = `${newValue}%`;
            if (progressValues[index]) {
                progressValues[index].textContent = `${newValue}%`;
            }
        });
        
        // Update resource usage mini-gauges
        const miniGauges = document.querySelectorAll('.resource-usage-item .mini-gauge-fill');
        const gaugeValues = document.querySelectorAll('.resource-usage-item span:last-child');
        
        miniGauges.forEach((gauge, index) => {
            let currentValue = parseInt(gauge.style.width);
            if (isNaN(currentValue)) currentValue = 70; // Default if not set
            
            // Random fluctuation between -3% and +3%
            const change = Math.floor(Math.random() * 7) - 3;
            const newValue = Math.max(40, Math.min(98, currentValue + change));
            
            gauge.style.width = `${newValue}%`;
            if (gaugeValues[index]) {
                gaugeValues[index].textContent = `${newValue}%`;
            }
        });
        
        // Update job runtime displays
        const runtimeDisplays = document.querySelectorAll('.job-info-item:nth-child(6) span');
        runtimeDisplays.forEach(display => {
            if (display.textContent.includes(':')) {
                const timeParts = display.textContent.split(':').map(part => parseInt(part));
                
                // Add seconds
                timeParts[2] = (timeParts[2] || 0) + 5;
                if (timeParts[2] >= 60) {
                    timeParts[2] = 0;
                    timeParts[1]++;
                }
                
                // Handle minute overflow
                if (timeParts[1] >= 60) {
                    timeParts[1] = 0;
                    timeParts[0]++;
                }
                
                // Format and display
                display.textContent = timeParts.map(t => t.toString().padStart(2, '0')).join(':');
            }
        });
    }
});