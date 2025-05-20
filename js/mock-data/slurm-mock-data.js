// Mock API data for Slurm dashboard
const initialMockData = {
    clusterStatus: {
        isOnline: true,
        updateTimestamp: new Date().toISOString(),
        nodes: {
            total: 64,
            active: 48,
            idle: 12,
            down: 4,
            utilization: 75
        },
        partitions: [
            { name: "batch", nodesAllocated: 32, nodesTotal: 40, status: "up" },
            { name: "gpu", nodesAllocated: 6, nodesTotal: 8, status: "up" },
            { name: "interactive", nodesAllocated: 10, nodesTotal: 16, status: "up" }
        ]
    },
    jobQueue: {
        running: 156,
        pending: 42,
        completed: 384,
        failed: 8,
        cancelled: 3
    },
    userJobs: [
        { id: "12345", name: "data-analysis", status: "running", runtime: "01:23:45", nodes: 2, cores: 16 },
        { id: "12344", name: "sim-batch-3", status: "completed", runtime: "05:30:22", nodes: 4, cores: 32 },
        { id: "12343", name: "test-gpu", status: "pending", runtime: "--:--:--", nodes: 1, cores: 8 },
        { id: "12342", name: "preprocessing", status: "completed", runtime: "00:45:12", nodes: 1, cores: 4 },
        { id: "12341", name: "nn-training", status: "failed", runtime: "00:10:33", nodes: 2, cores: 16 }
    ],
    resourceUsage: {
        cpu: [65, 80, 50, 75, 65, 70, 85, 60, 55, 75, 80, 70],
        memory: [50, 60, 55, 65, 70, 75, 65, 60, 50, 45, 55, 60],
        gpu: [80, 85, 90, 75, 70, 80, 85, 90, 80, 70, 75, 80],
        storage: {
            total: 408,
            used: 287,
            available: 121
        },
        timeIntervals: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
                       "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
    }
};

// Export as module if using ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initialMockData };
}