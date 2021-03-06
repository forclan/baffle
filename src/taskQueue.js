/* 
	it's used to store tasks in a queue;

	add a task 
		- addTaskToQueue(fn)
	add some delay 
		- addDelayToQueue(delay)
	execute task after delay
		- addTaskWithDelay(fn, delay)
*/
class taskQueue {
	// checkDelay is in *ms*
	constructor(checkDelay = 50) {
		// bindings
		this.executeTask = this.executeTask.bind(this);
		this.isTaskQueueEmpty = this.isTaskQueueEmpty.bind(this);
		this.getTaskInQueue = this.getTaskInQueue.bind(this);
		this.addDelayToQueue = this.addDelayToQueue.bind(this);
		this.addTaskToQueue = this.addTaskToQueue.bind(this);
		this.clearTasksInQueue = this.clearTasksInQueue.bind(this);
		this.clearQueueImmediately = this.clearQueueImmediately.bind(this);
		// set executeTask every 'checkDelay'ms
		this.interval = setInterval(this.executeTask, checkDelay);
		// store checkDelay
		this.checkDelay = checkDelay;
		// used to store tasks;
		this.queue = [];
	}

	executeTask() {
		// if there is a delayTime 
		if (this.timeDelayTo) {
			if ((new Date()).getTime() < this.timeDelayTo) {
				return;
			}
			else {
				// current time is bigger than timeDelayTo
				// clear delay time
				this.timeDelayTo = null;
			}
		}
		// task is empty, return
		let task = this.getTaskInQueue();
		if (!task) {
			return;
		}

		// task is delay
		if (task.type === 'delay') {
			// set timeDalayTo according to current time
			this.timeDelayTo = (new Date()).getTime() + task.delayTime;
			return;
		}

		// if is task, execute it;
		if (task.type === 'task') {
			task.taskFunc();	
		}

	}

    isTaskQueueEmpty() {
        return !this.queue.length;
    }

    // get a task from the queue; if queue is empty, return *null*
    getTaskInQueue() {
        return this.queue.shift() || null;
    }

    // add a 'clear queue' task in queue;
	clearTasksInQueue() {
		this.queue.push({
			type: 'clear-queue'
		})
	}

	runImmediately(fn) {
		fn();
		return this;
	}
	// clear a queue immediately 
	clearQueueImmediately() {
		this.queue = [];
		this.timeDelayTo = null;
	}

    addDelayToQueue(delay) {
    	this.queue.push({
    		type: 'delay',
    		delayTime: delay
    	});
    	return this;
    }

    addTaskToQueue(task) {
    	this.queue.push({
    		type: 'task',
    		taskFunc: task,
    	});
    	return this;
    } 

	addTaskWithDelay(task, delay) {
		this.addDelayToQueue(delay);
		this.addTaskToQueue(task);
	}

}

export default delay => new taskQueue(delay);
