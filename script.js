document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearBtn = document.querySelector('.clear-btn');

    // Timer-related elements
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.getElementById('timer');
    const currentTaskDisplay = document.getElementById('currentTask');

    // Timer variables
    let timeInSeconds = 0;
    let timerInterval = null;
    let isTimerRunning = false;

    // Add new variable for elapsed time display
    let elapsedTimeDisplay = '';

    // Add variable to store current task
    let currentTask = '';

    // Timer functions
    function updateTimerDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        elapsedTimeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = elapsedTimeDisplay;

        // Update current task in timeline if timer is running
        if (isTimerRunning) {
            updateCurrentTaskInTimeline();
        }
    }

    function startTimer() {
        if (!isTimerRunning) {
            if (!currentTask) {
                // If no task is stored, check input field
                const taskText = taskInput.value.trim();
                if (taskText) {
                    currentTask = taskText;
                    taskInput.value = '';
                } else {
                    alert('Please enter or add a task first');
                    return;
                }
            }

            isTimerRunning = true;
            startBtn.style.opacity = '0.5';
            pauseBtn.style.opacity = '1';
            
            currentTaskDisplay.textContent = `Current Task: ${currentTask}`;
            updateCurrentTaskInTimeline();

            timerInterval = setInterval(() => {
                timeInSeconds++;
                updateTimerDisplay();
            }, 1000);
        }
    }

    function pauseTimer() {
        if (isTimerRunning) {
            isTimerRunning = false;
            startBtn.style.opacity = '1';
            pauseBtn.style.opacity = '0.5';
            clearInterval(timerInterval);
        }
    }

    function resetTimer() {
        pauseTimer();
        timeInSeconds = 0;
        updateTimerDisplay();
        
        if (currentTask) {
            // Create completed task entry
            const li = document.createElement('li');
            const currentTime = new Date().toLocaleTimeString();
            li.textContent = `${currentTime} - ${currentTask} (Duration: ${elapsedTimeDisplay})`;
            li.classList.add('completed-task');
            taskList.insertBefore(li, taskList.firstChild);
            saveTasksToLocalStorage();
        }

        // Reset current task and display
        currentTask = '';
        currentTaskDisplay.textContent = '';
        startBtn.style.opacity = '1';
        pauseBtn.style.opacity = '1';
    }

    function updateCurrentTaskInTimeline() {
        if (!currentTask) return;

        // Remove existing "In Progress" task if any
        const existingInProgress = document.querySelector('.in-progress');
        if (existingInProgress) {
            existingInProgress.remove();
        }

        // Create new "In Progress" task item
        const li = document.createElement('li');
        const currentTime = new Date().toLocaleTimeString();
        li.textContent = `${currentTime} - ${currentTask} (In Progress: ${elapsedTimeDisplay})`;
        li.classList.add('in-progress');
        li.style.animation = 'pulse 2s infinite';

        // Add to top of list
        taskList.insertBefore(li, taskList.firstFirst);
    }

    // Timer event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        // Store the task text
        currentTask = taskText;
        
        // Update current task display
        currentTaskDisplay.textContent = `Ready to start: ${currentTask}`;
        
        // Clear input but don't reset timer
        taskInput.value = '';
    }

    // Save tasks to localStorage
    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push(task.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            taskList.appendChild(li);
        });
    }

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearBtn.addEventListener('click', () => {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        currentTask = '';
        resetTimer();
    });

    // Load saved tasks when page loads
    loadTasksFromLocalStorage();
    updateTimerDisplay();

    // Add CSS for the pulsing effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        .in-progress {
            background: rgba(255, 255, 255, 0.15);
            border-left: 3px solid #4CAF50;
        }
        .completed-task {
            border-left: 3px solid #2196F3;
        }
    `;
    document.head.appendChild(style);
}); 