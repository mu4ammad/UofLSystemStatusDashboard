document.addEventListener('DOMContentLoaded', function() {
    // Demo credentials (in a real app, this would be handled server-side)
    const demoCredentials = {
        username: 'admin',
        password: 'password123'
    };

    // DOM element references
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const lastUpdateEl = document.getElementById('last-update');

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication (for demo purposes only)
        if (username === demoCredentials.username && password === demoCredentials.password) {
            // Successful login
            loginError.textContent = '';
            usernameDisplay.textContent = username;
            
            // Switch to dashboard page
            document.getElementById('login-page').classList.remove('active');
            document.getElementById('dashboard-page').classList.add('active');
            
            // Start mock data updates
            startMockUpdates();
        } else {
            // Failed login
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
    });

    // Handle logout
    logoutBtn.addEventListener('click', function() {
        // Switch back to login page
        document.getElementById('dashboard-page').classList.remove('active');
        document.getElementById('login-page').classList.add('active');
        
        // Clear form fields
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        loginError.textContent = '';
        
        // Stop mock updates
        stopMockUpdates();
    });

    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        lastUpdateEl.textContent = now.toLocaleString();
    }
    
    // Mock data update variables
    let updateInterval;
    
    // Start mock data updates
    function startMockUpdates() {
        // Update immediately
        updateMockData();
        updateTimestamp();
        
        // Then update every 5 seconds
        updateInterval = setInterval(function() {
            updateMockData();
            updateTimestamp();
        }, 5000);
    }
    
    // Stop mock data updates
    function stopMockUpdates() {
        clearInterval(updateInterval);
    }
    
    // Update mock data with random fluctuations
    function updateMockData() {
        // Update node counts with small random changes
        const totalNodes = 64;
        let activeNodes = parseInt(document.getElementById('active-nodes').textContent);
        let change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        
        activeNodes = Math.max(30, Math.min(60, activeNodes + change));
        const idleNodes = totalNodes - activeNodes - 4; // 4 is down nodes
        
        document.getElementById('active-nodes').textContent = activeNodes;
        document.getElementById('idle-nodes').textContent = idleNodes;
        
        // Update job stats with small random changes
        let runningJobs = parseInt(document.getElementById('running-jobs').textContent);
        let pendingJobs = parseInt(document.getElementById('pending-jobs').textContent);
        let completedJobs = parseInt(document.getElementById('completed-jobs').textContent);
        
        // Add some new jobs
        const newJobs = Math.floor(Math.random() * 3);
        pendingJobs += newJobs;
        
        // Complete some jobs
        const finishedJobs = Math.floor(Math.random() * 3);
        if (runningJobs > finishedJobs) {
            runningJobs -= finishedJobs;
            completedJobs += finishedJobs;
        }
        
        // Start some pending jobs
        const startedJobs = Math.floor(Math.random() * 2);
        if (pendingJobs >= startedJobs) {
            pendingJobs -= startedJobs;
            runningJobs += startedJobs;
        }
        
        document.getElementById('running-jobs').textContent = runningJobs;
        document.getElementById('pending-jobs').textContent = pendingJobs;
        document.getElementById('completed-jobs').textContent = completedJobs;
        
        // Update chart bars with random heights
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            const currentHeight = parseInt(bar.style.height);
            const newHeight = Math.max(20, Math.min(90, currentHeight + Math.floor(Math.random() * 20) - 10));
            bar.style.height = newHeight + '%';
        });
    }
});