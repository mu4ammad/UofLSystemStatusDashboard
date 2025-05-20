/**
 * API Service for Slurm Dashboard
 * Simulates API calls with mock data and random fluctuations
 */
class ApiService {
    constructor() {
        // Load initial mock data
        this.mockData = JSON.parse(JSON.stringify(initialMockData));
        
        // Internal tracking for simulated activity
        this.updateInterval = null;
        this.listeners = {
            'clusterStatus': [],
            'jobQueue': [],
            'userJobs': [],
            'resourceUsage': []
        };
    }
    
    /**
     * Initialize API service and start data simulation
     */
    init() {
        // Start simulated data updates
        this.startDataUpdates();
        console.log('API Service initialized');
        return this;
    }
    
    /**
     * Start simulated data updates
     */
    startDataUpdates() {
        // Update data every 5 seconds
        this.updateInterval = setInterval(() => {
            this.simulateDataChanges();
        }, 5000);
    }
    
    /**
     * Stop simulated data updates
     */
    stopDataUpdates() {
        clearInterval(this.updateInterval);
    }
    
    /**
     * Simulate changes in the mock data to mimic a real system
     */
    simulateDataChanges() {
        // Update timestamp
        this.mockData.clusterStatus.updateTimestamp = new Date().toISOString();
        
        // Simulate node changes
        const nodeChanges = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        if (this.mockData.clusterStatus.nodes.active + nodeChanges >= 0 && 
            this.mockData.clusterStatus.nodes.active + nodeChanges <= this.mockData.clusterStatus.nodes.total) {
            this.mockData.clusterStatus.nodes.active += nodeChanges;
            this.mockData.clusterStatus.nodes.idle = 
                this.mockData.clusterStatus.nodes.total - 
                this.mockData.clusterStatus.nodes.active - 
                this.mockData.clusterStatus.nodes.down;
            
            // Update utilization
            this.mockData.clusterStatus.nodes.utilization = 
                Math.round((this.mockData.clusterStatus.nodes.active / this.mockData.clusterStatus.nodes.total) * 100);
        }
        
        // Simulate job queue changes
        const newJobs = Math.floor(Math.random() * 5);
        const completedJobs = Math.floor(Math.random() * 5);
        
        this.mockData.jobQueue.pending += newJobs;
        
        if (this.mockData.jobQueue.running > completedJobs) {
            this.mockData.jobQueue.running -= completedJobs;
            this.mockData.jobQueue.completed += completedJobs;
        }
        
        // Move some pending jobs to running
        const startedJobs = Math.floor(Math.random() * 3);
        if (this.mockData.jobQueue.pending >= startedJobs) {
            this.mockData.jobQueue.pending -= startedJobs;
            this.mockData.jobQueue.running += startedJobs;
        }
        
        // Update resource usage trends
        // Remove first element and add a new one at the end
        this.mockData.resourceUsage.cpu.shift();
        this.mockData.resourceUsage.cpu.push(
            Math.min(95, Math.max(40, this.mockData.resourceUsage.cpu[this.mockData.resourceUsage.cpu.length - 1] + (Math.random() * 20 - 10)))
        );
        
        this.mockData.resourceUsage.memory.shift();
        this.mockData.resourceUsage.memory.push(
            Math.min(95, Math.max(40, this.mockData.resourceUsage.memory[this.mockData.resourceUsage.memory.length - 1] + (Math.random() * 15 - 7)))
        );
        
        this.mockData.resourceUsage.gpu.shift();
        this.mockData.resourceUsage.gpu.push(
            Math.min(95, Math.max(40, this.mockData.resourceUsage.gpu[this.mockData.resourceUsage.gpu.length - 1] + (Math.random() * 20 - 10)))
        );
        
        // Update time intervals
        const lastTimeStr = this.mockData.resourceUsage.timeIntervals[this.mockData.resourceUsage.timeIntervals.length - 1];
        const [hours, minutes] = lastTimeStr.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes + 60; // Add 1 hour
        
        if (newMinutes >= 60) {
            newHours = (newHours + 1) % 24;
            newMinutes = 0;
        }
        
        this.mockData.resourceUsage.timeIntervals.shift();
        this.mockData.resourceUsage.timeIntervals.push(
            `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
        );
        
        // Notify all listeners of updates
        Object.keys(this.listeners).forEach(key => {
            this.listeners[key].forEach(callback => {
                callback(this.mockData[key]);
            });
        });
    }
    
    /**
     * Get cluster status data
     * @returns {Promise} Promise that resolves with cluster status data
     */
    getClusterStatus() {
        return this.simulateApiCall('clusterStatus');
    }
    
    /**
     * Get job queue data
     * @returns {Promise} Promise that resolves with job queue data
     */
    getJobQueue() {
        return this.simulateApiCall('jobQueue');
    }
    
    /**
     * Get user jobs data
     * @returns {Promise} Promise that resolves with user jobs data
     */
    getUserJobs() {
        return this.simulateApiCall('userJobs');
    }
    
    /**
     * Get resource usage data
     * @returns {Promise} Promise that resolves with resource usage data
     */
    getResourceUsage() {
        return this.simulateApiCall('resourceUsage');
    }
    
    /**
     * Simulate an API call with a small delay
     * @param {string} dataKey - The key for the data to return
     * @returns {Promise} Promise that resolves with the requested data
     */
    simulateApiCall(dataKey) {
        return new Promise((resolve) => {
            // Simulate network delay (200-800ms)
            const delay = 200 + Math.random() * 600;
            setTimeout(() => {
                resolve(this.mockData[dataKey]);
            }, delay);
        });
    }
    
    /**
     * Subscribe to data updates
     * @param {string} dataType - Type of data to subscribe to (clusterStatus, jobQueue, etc.)
     * @param {Function} callback - Function to call when data is updated
     */
    subscribe(dataType, callback) {
        if (this.listeners[dataType]) {
            this.listeners[dataType].push(callback);
        } else {
            console.error(`Invalid data type: ${dataType}`);
        }
    }
    
    /**
     * Unsubscribe from data updates
     * @param {string} dataType - Type of data to unsubscribe from
     * @param {Function} callback - Function to remove from callbacks
     */
    unsubscribe(dataType, callback) {
        if (this.listeners[dataType]) {
            this.listeners[dataType] = this.listeners[dataType].filter(cb => cb !== callback);
        }
    }
}