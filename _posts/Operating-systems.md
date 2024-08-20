---
title: "Operating Systems"
category: "Notes"
date: "03-01-2024"
---

# Operating System Notes

This is the aggregation of all my notes from the University of Washington's CSE 451 Operating Systems course.

## Week 1
<!--> Week 1 Part 1 <-->
Physical memory

- Slow compared to CPU caches (pull memory into caches)
- “Byte addressable”

Storage devices

- Persistent, slower, non-volatile
- HDD vs SSD
- Sector vs page

Other devices 

- Network interface card (NIC)
- Input
    - Mouse, keyboard
- Output
    - Headphones, speakers

Typical abstractions

- CPU
    - Process
- DRAM
    - Virtual memory
- Storage devices
    - Files, directories (FileSystem)
- Network
    - Network stack, TCP/IP protocols

Why provide abstractions?

- OS Roles
    
    Illusionist, Glue, Referee
    
- Ease of use (illusionist)
    - Provides simplified services to user
        - Storage → FileSystem, creates named files, folders to organize,
        - DRAM (shared memory by all processes) → Virtual memory (all memory is yours, no matter where your place in physical memory)
    - Mask hardware limitations
        - FileSystem: hides block sizes by bytes
        - Virtual memory
- Common interface (glue)
    - allows processes to share files and other services
- Managed access (layout and permissions) (referee)
    - Resource management (process uses registers, memory)
        - Schedule processes into a single CPU
        - Sharing of physical memory
    - Isolation
        - Process can’t read another’s memory
        - Can’t read OS memory
    - Managed/Controlled sharing
        - Shared memory (shm call)

Motivation

- OS manages and abstracts hardware resources
- Three benefits of abstraction:
    - illusionist
    - common interface
    - managed access
- Must prevent processes from violating management
    - OS could monitor user instructions and memory access
        - How can every instruction be monitored?
        - Does every memory access need to be monitored
        - Efficiency

Protection Rings

- Supported by hardware
- Privilege level shown by lower 2 bits of the cs register
- Ring 0 (kernel mode)
    - Kernel code executes
    - Access to privileged instructions
        - Pausing processor, update virtual memory, I/O (move data from I/O port, disable interrupts)
    - Access to all mapped virtual memory
- Ring 1 & 2
    - Where device drivers execute
    - Can only access non-privileged instructions & some I/O sensitive instructions
    - Access to all mapped virtual memory
- Ring 3 (user mode)
    - Where the user code executes
    - Can only access non-privileged instructions
        - add, mov, call, ret
    - Can only access virtual memory mapped with user permission

<!--> Week 1 Part 2 <-->
Types of Mode Transfer

- Exception (synchronous)
    - A problem caused by current instruction
        - Divide by 0
        - Null pointer access
        - Segfault
        - Execute privileged instruction
    - Processes will be terminated
    - Process may resume on faulting instruction
        - If kernel can handle the exception
- System call (synchronous)
    - Processes requiring kernel services process (open, close, read, write)
    - syscall, sysret: the instruction to enter/exit the kernel for a system call
    - A process resumes at the next instruction upon a syscall return
- Interrupt (asynchronous)
    - Hardware events/notifications, often time sensitive
        - I/O completion (disk write complete, packet arrived), timer interrupt, keyboard input
    - Unrelated to the current instruction
        - Interrupt is checked and handled before the current instruction is executed
        - Resumes on the current instruction since it was interrupted
    - Who executes the kernel code when a mode switch occurs?
        - The current running process can only execute the kernel code
        - Once inside the kernel, a process can only execute the kernel code
        - Upon a user kernel mode switch, %rip is set to kernel code by hardware

<!--> Week 1 Part 3 <-->
PC - Program Counter

Types of mode transfers

- Interrupts
    - Issued by hardware (timely hardware event) high priority
    - Also called HW Interrupts / external interrupts
    - One at a time, End of Interrupt (EOI) after handling
    - Preempt exception & syscall handling
    - Example: disk finished writing, report back to kernel of completion
- Exceptions
    - Problem caused by the current instruction
    - Exception behavior varies (trap 13, trap 14 are common, invalid memory access)
    - If you cause exception in your interrupt handler?
    - syscalls
    - Example: Problems caused by current instruction
- Syscalls
    - Requested by the user (software interrupt) interrupt (INT#)

Mode Transfer Mechanisms

- When entering kernel, hardware overwrites %rip to kernel handler address
    - We must save the process %rip user code (after completing kernel execution)
    - Must save user’s registers
    - Execution needs a stack
- User stack is available
    - Who has access to this stack? The user process itself
    - If the kernel uses the stack, what information might be on the stack?
        - This might lead to granting other processes visibility of sensitive kernel information
        - Example: Kernel performs decryption, stores result onto user stack, other process can view data in stack
        - Example: When kernel procedure finishes executing and calls a return address, another thread can overwrite the return address to elsewhere (arbitrary code)
    - To fix this, we allocate a separate kernel stack (user no permissions)
        - Stack switch occurs on mode switch (carried out by hardware)
        - How many kernel stacks are there?
            - One stack per process (thread) (because they each do their own task)
        - Which handler to load in %rip?
            - Interrupt vector table / x86 Interrupt descriptor table
            - An array that holds entries into a fixed array of system interrupts

## Week 2
<!--> Week 2 Part 1 <-->
Mode Transfer control flow

- Switch into kernel mode, hw saves some registers, switch to kernel stack, push saved states onto the kernel stack → kernel code (IDT) handler pushes rest of the process’s states → execute handler logic → restore the states → switch into user mode, hw restores rsp, rip
- 256 vector functions, handlers in IDT entries
    - Vector handlers push onto trapasm.S
    - Pushing registers into trap frame to prepare for entrance into kernel
    - %rsp points to location that stores %rax
    - Then, we call trap which defines kernel C logic, unified interrupt handler
- Trap frame definition
    - Includes all the registers that are pushed by the kernel
        - rax, rbx, rcv, r8-r15 … (saved by the kernel)
        - err, rip, cs, rflags (saved by the hardware)
    - When we return from kernel back into user mode, we restore the trap frame values back into the corresponding registers ensuring users have the exact same view before entering the kernel
- System calls (syscall) include arguments
    - x86 rdi, rsi…
    - When we enter into the kernel, reading trapframe for arguments
        - Come in many different types, void*, integers, addresses
        - Kernel must validate that these addresses are valid - user might pass in kernel memory address (kernel must prevent this from occurring)
        - Kernel performs validation, OS typically makes a copy of the arguments
        - String is null terminated, kernel must go through the entire string
            - If we validate the size of a string, but then allow other processes to manipulate the original memory location then we get corruption and security issues
        - xk deals with single thread, OS supports multithreading and opens security vulnerabilities
    - Return value (rax) set within the trap frame, allowing user to see when resuming execution

<!--> Week 2 Part 2 <-->
Processes

- A process is a running instance of a program
    - Execution stream
        - rip, stack, registers used by that process
        - virtual memory (address space)
        - Process metadata, management data tracked by the OS, known as the PCB (process control block)
            - In Lab 1, we must add syscall supports for each process, requiring tracking of additional metadata for each process
                - Struct proc_ stores this information
            - id, process kernel stack, OS abstractions (file descriptor tables)
    - Boundary for isolation and protection
        - Process only have visibility into its own thing, unless permitted by the kernel
    - Kernel memory at the top of the address space, mapped by supervision
    - Mapping of virtual memory to physical memory is done by the kernel through translation table
    - All kernel data is within kernel memory, this is a design choice made by modern OS (security vulnerability in 2018)
        - By mapping the kernel and user memory in the same virtual address space, it makes it easier for kernel to access user memory
            - Assume kernel memory is stored elsewhere, kernel must work harder to fetch
        - Separate translation tables for process kernel memory and user memory comes with a nontrivial cost of switching
            - Some 4-5x performance overhead
        - TLB (translation lookup buffer) (memory translation cache from memory translation results)
        - Modern OS don’t map entire kernel memory into user memory, only part of kernel memory to enter the kernel itself

Process Implementation

- ELF loading (executable and linkable format)
    - How to set up virtual address space (VAS) of a process
    - Entry point of that process
    - Stores program headers
        - File offset x size bytes
        - Virtual address
        - Size of virtual memory region
    - Code section, initial read-only data in VAS
    - Initial stack page is set up by the OS
        - When we first start executing, let’s say we have an int main(int argc, char** argv) {}
        - We store char** argv data on the initial stack frame, and the pointer argv itself on the initial stack frame
        - rsp points to this location
        - There is a size for how much of the file we should read, and how big the VAS is
    - PCB
        - pid, kernel stack, initialize file descriptor table (any data structure), virtual memory data
        - Kernel responsible for setting up trapframe to the starting state of the process
            - rip, entry point, rsp in trap frame

How processes share a CPU (core)

- Scheduling: OS policy on who should run on the CPU
    - Let processes take turns using the CPU (not all programs process to completion)
    - Round Robin (10-100ms)
        - Fixed time slice (how long each turn is)
        - FIFO order through all processes
    - Context switching takes place in kernel mode
        - Mode switch into kernel first, then context switch

<!--> Week 2 Part 3 <-->
Fork & Exec combo

We spent time copying parent’s memory content, set up a translation table

Set up process’s new VAS, resource intensive

Copy on write (COW)

Share the same physical memory for as long as possible (while only servicing reads)

The moment write occurs, we need to make a copy

Both of the above, HW detects memory permission violation

Mark shared memory as read-only, even if the parent VAS memory was writable

The moment a write occurs, page fault, then detected by hardware (kernel must determine if copy on write, or real permission violation)

Process creation transition

- Elf loading
- Setting virtual address space (VAS)
- Initialize process control block (PCB)

Ready State (RUNNABLE)

- Ready to get scheduled on the CPU
- OS keeps track of ready queue
- Gets dispatched (scheduled)

Running state

- Single core, single running state
- Gets terminated (ZOMBIE) (will never go back into ready queue)
- Timeout, preempt, time slice expires (time slice/time quantum)

Blocked State (waiting)

- Running enters a blocked state
- Do not schedule
- Examples: IO Request, timer (sleeptimer)
- We can only be blocked by one event at a time, single execution stream
- Unblocking, event has taken place

Grocery Line Example

- Checkout is execution
- Standing in line is process ready queue
- Kernel must track waiting event

procstate is scheduling state (runnable, waiting, zombie)

- chan channel is tracking the waiting event, if waiting event then event is pointer
- xk: sleep(*chan) → block on this event
- wakeup(*chan) → unblock procs/threads waiting on chan
- Even if the time quantum is larger than the time that a process gets to run
- Example: Time Q = 10ms, program exec = 1ms, blocking = 9ms
- CPU is a scarce resource, so when a process enters a blocking state, the scheduler will maximize the utilization of the CPU, and schedule another process

Process APIs

- fork()
    - Creates a new process, a child process, that’s identical to the parent at the time of fork
    - No params
    - Two different/separate processes, different VAS, different physical memory
    - Separate memory translation table (page table)
    - Child inherits OS resources from parent (open files)
    - Child will have its own fd array (copied from parent)
    - Different kernel stack, different processes enter the kernel at different times
    - Child will not execute code before the fork() call from parent
    - %rax will hold different return values for parent and child, >0 and 0 respectively
- exec() (system call)
    - Loads a program into an existing process
    - Process will be stored on the same process VAS, but with new code, new data, new stack, new entry point
    - Does not create a new process
    - This is what new program the process should execute
    - Example:
        
```c
pid = fork()
if (pid == 0) {
    fd = open("output.txt");
    close(stdout);
    dup(fd);
    exec("ls");
}
 // Redirection logic is written under the child case (pid == 0)
 // Fork gives you the opportunity to configure a bunch of things
 // without the knowledge of another program being involved
```
        
- Fork & Exec combo
    - We spent time copying parent’s memory content, set up a translation table
    - Set up process’s new VAS, resource-intensive
    - Copy on write (COW)
        - Share the same physical memory for as long as possible (while only servicing reads)
        - The moment a write occurs, we need to make a copy
        - Both of the above, HW detects memory permission violation
        - Mark shared memory as read-only, even if the parent VAS memory was writable
        - The moment a write occurs, page fault, then detected by hardware (kernel must determine if copy on write, or real permission violation)

Process APIs

fork, exec, cow fork (performance optimization)

- fork inherits OS resources
- Windows uses spawn() instead of fork and exec
    - Combination of both
- Unix api uses clone()
    - Creates a new process
    - Takes several params to pass which resources it requires

exit()

- How a process voluntarily terminates
- Recall when a new process is initialized, we set up the PCB, VAS, KStack, open files
    - All open files are closed upon exit()
    - Exit handler lives in kernel mode, if it tries to clear itself, it will lose the kernel memory — process cannot naiively free its own memory as it exits
    - It can definitely free the VAS excluding the kernel memory

OS is responsible for reclaiming these resources after termination

- One option to free the process memory is to make the next process clear it, or the let the parent free the memory
- Another option is to switch to kernel only VAS
- Kernel stack must still be freed by parent (or some other process)

wait() (xk = waitpid(-1)) / waitpid() (unix)

- Allows calling process to wait until a child has exited
- Example: Parent waits for child process to finish execution until it itself will resume executing
- Kernel needs to track the parent/child relationship for each process
    - Parent pointer being stored in PCB
- Potentially blocking operation (blocking syscall), cannot return until condition is true
    - No longer running on CPU, in blocked state
    - When child has called exit, process must be able to unblock
- Using sleep() and wakeup() to implement wakeup
- Initial process, when parent exiting make init process adopt the children
    - Init proc is responsible for cleaning up abandoned children
    - Alternative strategy instead of making the next process clean the children memory
- Better to just make the parent responsible of cleaning up the children if the parent never returns from waiting

Scheduling

- Policy (OS level) that decides who to run next on the CPU
    - Processes and threads run on the CPU
    - Task based evaluation rather than policy based
- Metrics
    - Latency (turnaround time)
        - User perceived time of how long the task took (start at arrival includes wait time & run time)
    - Throughput
        - Rate of task completion, how many tasks to be completed in a certain amount of time
    - Fairness & Starvation
        - Fairness is similar time on CPU & similar time waiting
        - Starvation is asking: does the policy cause a process to wait forever
    - Scheduling overhead
        - Cost of doing scheduling itself (includes time of run scheduling policy & context switching time)
- Scheduling policies
    - FIFO
        - Run each task to completion (or until a process voluntarily yields) in FIFO order, kernel never stops process from running (preemption)
        - No starvation, low overhead, minimal task switching (scheduling overhead)
        - Performance is highly dependent on the arrival order
            - A: 10ms B: 20ms C: 100ms
            - [A, B, C] - scheduled as such
                - Latency A = 10, Latency B = 30, Latency C = 130
                - Total Latency = 170ms
            - [C, B, A] - scheduled opposite
                - Latency C = 100, Latency B = 120, Latency A = 130
                - Total Latency = 350ms
    - Preemptive Shortest Job First
        - OS might preempt processes
        - Attempts to minimize average latency, avoid having shorter task wait behind longer task
        - Always schedule the job with shortest CPU time
        - If a new task arrives and has a shorter time, then the new task will preempt the current running task, and be the new scheduled task (runs)
        - Order of input is ignored, tasks are preempt and overtakes longer latency processes
        - More switching is involved during preemption
        - But, it does fruit optimal latency, and has good throughput
        - Not a fair policy, and can lead to starvation (if shorter jobs come in infinitely)
        - What happens when task blocks?
            - When the task blocks, it goes into a blocked state, removed from the processing queue
            - But when the task unblocks and reenters the processing queue, it might preempt the current running task
    - Round Robin
        - FIFO with a time quantum (10ms - 100ms)
        - Preemptive scheduling policy
        - More realistic than PSJF, does not require knowing how long a task will take to process
        - Example:
            - [C, B, A], time slice = 10ms
            - A = 30ms, B = 50ms, C = 130ms
            - Total latency = 210
            - Scheduling overhead goes up because every 10ms we switch tasks
            - Compromise of the naiive FIFO ordering
            - Relatively fair, throughput is acceptable

## Week 3
<!--> Week 3 Part 1 <-->
Scheduling methods

- Round Robin
- FIFO w/ time quantum, preemptive
    - Unfair to jobs not using the full time quantum
    - Must balance IO bound and CPU bound jobs
- Option 2:
    - Jobs with less time on CPU get scheduled first
    - Completely fair scheduling (CFS)
        - Time ordered red black tree
    - Option 2: Different time quantums
        - Different levels of queues, different time quantums
        - Multi-level feedback queue (MLFQ)
            - Short: less wait time for IO bound (interactive) jobs
            - High priority, will work its way down
            - Long: less interruption for longer jobs (less scheduling overhead)
            - Upon init, all new tasks are short. We don’t know what tasks will take what amount of time.
            - If a task blocks, the time slice is larger than what it actually needs (execution time < time quantum), ensuring short tasks get highest priority and lowest total latency
            - During execution, if a task blocks, it will stay at the same execution level on the back of the queue
            - Else if a task completes its time quantum / the time slice is used entirely (execution time = time quantum), the task is moved down a queue (needs longer time on CPU without re-scheduling overhead)
            - There is a concern for lower queued tasks being starved of CPU by alternating tasks in the highest queues
                - Potential priority boost
                - Resource accounting, maximum time limit for each queue (if you have spent over X amount of time, move the program down)
                - This prevents exploitation from user processes
                - Even if a current task priority is running, a higher priority task will preempt lower priority task

Threads

- A unit of task/execution
- Multithreaded program → a program that logically divides into independent tasks
- Parallelism: things executing at the same time (not possible for xk, with only one core)
- Concurrency: even with one core, still switches between tasks, each making progress
- Kernel is concurrent

Process

- An address space + OS resources (open files) + 1 + threads

Thread

- Shares access to entire address space, code, heap, data
- But each has their own stack (execution stream) in user space
- Has its own pc (program counter), sp (stack pointer), registers
- Threads are managed by the kernel
    - Managed by thread control block (TCB)
    - Switching between tasks is context switching
        - Threads are the actual execution, context switching is switching thread states
        - Save thread execution state
        - Run scheduling policy
        - Switch to another thread
        - Restore states from the thread to run (each kernel stack of each thread)
        - xk: old thread → scheduler thread → next thread (if it belongs to the same process, no need to switch address space, otherwise need to reload memory translation table and flush TLB)
        - Threads share the same VAS, but have different stacks (sections of VAS, could be in heap or elsewhere)
        - Threads are cheaper to create compared to a process
            - Each thread just needs its own stack that accesses the VAS, and kernel TCB
            - New process requires a whole new address space and set up a new translation table, PCB, etc.
            - If we have a number of tasks to perform within the process, instead of forking a new process to perform those tasks, the cost is much smaller if we just created another thread to perform the task

Creating threads, pthread API

- Not like fork (per-process), pthread_create(thread_functions, args);
- thread_functions: starting point, instead of fork where it starts at ip/sp
- returns tid
- pthread_join(tid); // waitpid
- pthread_exit();
- pthread_detach(); // can’t be waited on, cannot join it, resources cleaned up upon exit

<!--> Week 3 Part 2 <-->
Threads

- A unit of task/execution
- Multithreaded program → a program that logically divides into independent tasks
- Parallelism: things executing at the same time (not possible for xk, with only one core)
- Concurrency: even with one core, still switches between tasks, each making progress
- Kernel is concurrent

Process

- An address space + OS resources (open files) + 1 + threads

Thread

- Shares access to entire address space, code, heap, data
- But each has their own stack (execution stream) in user space
- Has its own pc (program counter), sp (stack pointer), registers
- Threads are managed by the kernel
    - Managed by thread control block (TCB)
    - Switching between tasks is context switching
        - Threads are the actual execution, context switching is switching thread states
        - Save thread execution state
        - Run scheduling policy
        - Switch to another thread
        - Restore states from the thread to run (each kernel stack of each thread)
        - xk: old thread → scheduler thread → next thread (if it belongs to the same process, no need to switch address space, otherwise need to reload memory translation table and flush TLB)
        - Threads share the same VAS, but have different stacks (sections of VAS, could be in heap or elsewhere)
        - Threads are cheaper to create compared to a process
            - Each thread just needs its own stack that accesses the VAS, and kernel TCB
            - New process requires a whole new address space and set up a new translation table, PCB, etc.
            - If we have a number of tasks to perform within the process, instead of forking a new process to perform those tasks, the cost is much smaller if we just created another thread to perform the task

Creating threads, pthread API

- Not like fork (per-process), pthread_create(thread_functions, args);
- thread_functions: starting point, instead of fork where it starts at ip/sp
- returns tid
- pthread_join(tid); // waitpid
- pthread_exit();
- pthread_detach(); // can’t be waited on, cannot join it, resources cleaned up upon exit

Threads

- Results from threads differ based on scheduling order (firing) → race condition if we run without protections
- We might observe undefined behavior due to race conditions
- Thread reasoning is very difficult without the support of thread coordination (synchronization)
- Synchronization primitive

Locks

- A synchronization primitive that guarantees exclusive access to a designated section of code
    - Exclusive access (mutual exclusion)
    - Designated section of code (critical section)
- APIs
    - lock_acquire(*lock_pointer): does not return until we actually acquire the lock
        - If multiple threads attempt to grab the lock, none will return until success
    - lock_release(): how we release the lock, available for other threads to acquire
- Safety contract: only one thread in the critical section at a time
- Progress (liveness) property: a thread can enter the critical section if no one else is in it; someone must be able to acquire the lock eventually
- Bounded wait (fairness): upper bound to how long a thread has to wait before entering
- In practice, lk_acquire to access shared state, then lk_release

Lock Implementation

```c
struct lk { // this struct itself is a shared state
	int locked; // boolean
	holder;
	id/name;
}

// What protects lock_acquire from other threads attempting
// to lock simultaneously
void lock_acquire(*lk lock_pointer) {
	while(lk->locked) {
		continue;
	}
	lk->locked = 1; // Lock the lock, how we acquire it
	return;
}

// Alternate implementation
void lock_acquire(*lk lock_pointer) {
	if (!locked) {
		lk->locked = 1 // Lock the lock
		return;
	} else {
		while(lk->locked) {
			continue;
		}
	}
}

lock_release(*lk lock_pointer) {
	
}
```

Problem: multiple threads can attempt to lock simultaneously

Solution: requires hardware support for atomically performing read & modify

- Test & set instruction
    - Sets the value to 1 only if the current value is 0 (hardware, atomically)
    - Otherwise, it will not write a value, but returns the value that was read
    - Takes longer to execute this instead of a normal instruction (load & store), performance overhead

```c
void lock_acquire() {
	while (test&set & locked) {
		// upon exit the locked is already 1
		// then test&set = 1, and locked = 0, breaking loop
	}
}
```
Types of locks

- Spinlock: when the lock is not free, keep checking the status (running on CPU), until it acquires the lock (spinning, busy waiting)
    - When we expect the critical section to be short (execution time), smaller CPU busy waiting overhead
    - Few waiters/contenders
- Sleeplock/posix mutex: when the lock is not free, block/sleeps until it’s free
    - When we expect the critical section to be long, IO access
    - Many waiters/contenders

<!--> Week 3 Part 3 <-->
Types of locks

- Spinlock: wait (spins) on CPU while the lock is busy
    - Why should we use spinlock in a single core system?
        - Because we need live CPU in places where we cannot block, like the interrupt handler
            - Interrupts need to be serviced very timely, otherwise interrupts might get lost
        - xk: disables interrupts to acquire spinlock
- Sleeplock: blocks/sleeps while the lock is busy
    - Context switch (scheduling, switch VAS)
    - Unblock
    

Lock granularity

- Protect how much shared data with a single lock?
- A single lock for an entire array
    - Must acquire the lock, then perform operations, the release the lock?
        - Works for safety, poor performance for large arrays
- Coarse-grained vs fine-grained locking
    - Coarse-grained: used for simplicity
    - Fine-grained: acquire multiple locks, undesirable behavior, deadlock
- Example use cases:
    - icache, uses a spinlock because functions like idup have fast critical sections
    - inode, uses a sleeplock because functions like concurrent_readi will take longer to read from the CPU, and CPu should not be wasted waiting so the new read call is put to sleep
    - Both functions can process concurrently

Disable interrupt

- Avoid preemption
- Does not enable mutual exclusion like locks because
    - It is a per-core operation, multiple cores can still have access to the same memory
    - It is a privileged instruction, only kernel can use it
    - pushcli();

We need to coordinate threads based on events → Monitors

Monitors

- Design pattern & synchronization construct that provides coordination between threads based on events
- Monitor → a lock + resource state (track event/conditions) + condition variables (synchronization primitive)
    - Manages waiters of a condition
    - Lock: does not matter what type of lock, xk only uses spinlock
    - Resource state: synchronize on a particular state (resource we are tracking)
    - Condition variable: tasked to manage waiters, if false put to sleep if true wake up the waiter for condition; wait(), keeps track of a list of wait()
        - When true, call signal() on condition variable, removes a waiter and unblocks it
        - broadcast(), wakes up all waiters, removes everybody from waiting list
            - If we have N threads to sleep for X amount of time, and upon time X we can unblock all N threads, it is safe because all threads will recheck the condition variable

## Week 4
<!-->Week 4 Part 1 <-->
The Morning Coffee Problem

```c
Lock lk;
int coffee = 0;
Condvar coffee_cv;

get_coffee() {
	lk.acquire();
	// For condition variables, we should expect
	// spurious/fake wakeups with missing resources
	while (coffee <= 0) {
		coffee_cv.wait(lk);
	}
	coffee--;
	lk.release();
}

make_coffee() {
	lk.acquire();
	coffee++;
	coffee_sv.signal();
	lk.release();
}
```

Implement a Sleeplock

```c
Lock lk;
bool free = False;
Condvar lock_cv;

lock_acquire() {
	lk.acquire();
	while (!free) {
		lock_cv.wait(lk);
	}
	free = False;
	lk.release();
}

lock_release() {
	lk.acquire(); // assert(!free)
	free = True;
	lock_cv.signal();
	lk.release();
}
```

Implement a Fair Sleeplock with Bounded Waiting

```c
// Lock must be acquired in FIFO order
// New thread can't acquire the lock untill
// all prior waiters have done so.
// Maybe we could implement a queue?
Lock lk;
bool free = False;
Condvar lock_cv;
wait_queue = [];
Condvar wait_cv;

lock_acquire() {
	lk.acquire();
	wait_queue.append(self); // Wait for our turn to acquire the lock
	while (wait_queue.head() != self) {
		wait_cv.wait(lk);
	}
	while (!free) {
		lock_cv.wait(lk);
	}
	free = False;
	wait_queue.remove_head();
	wait_cv.signal();
	lk.release();
}

lock_release() {
	lk.acquire();
	free = True;
	lock_cv.signal();
	lk.release();
}
```

<!-->Week 4 Part 2 <-->
Bounded buffer problem

Common system design regarding locking

```c
Lock lk;
buffer[N]
int consume_ofs = 0;
int produce_ofs = 0;
int total_items = 0;

produce(item) {
	lk.acquire();
	while (total_items == N) {
		not_full_cv.wait(lk); // Releases the lock
	}
	total_items++;
	buffer[produce_ofs] = (produce_ofs + 1) % N;
	not_empty_cv.signal(); // Signal consumers
	lk.release();
}

consume() {
	lk.acquire()
	while (total_items == 0) {
		non_empty_cv.wait(lk); // Releases the lock
	}
	total_item--;
	item = buffer[consume_ofs] % N;
	not_full_cv.signal(); // Signal producers
	lk.release;
}
```

Pipe

- Interprocess communication (IPC)
    - Will open a pipe, file descriptors for read and write
    - Cannot be interleaving, writes must be atomic, “aaabbb” is valid while “ababab” is not
        - Need to make sure the same writer
- Pipe is only valid for the number of fds still open (the ref count)
    
    

Read writer locks

- Multiple threads accessing shared data, same kernel memory
- PCB is private, looking at its own fields
- Shared data is something like file open, file close
- Lock
    - If we have array of structs read only, no need for protection
    - But for write, modifiable data, we need protection

Top Comment Example (scrolling down)

- We have mostly reads, and occasional write
- One implementation: Lock on every read and write
    - Poor performance
- Don’t lock reads, lock writes
    - Simultaneous reads, serial writes
    - Problem is possibly reading partial writes, maybe half of a comment A and half of a comment B, very bad
- Reader writer locks
    - Concurrent reads
        - No writes can occur while there are reads, avoiding reading partial write
    - Exclusive write
        - No reads or writes can can happen when a writer writes
    - Read acquire and release + Write acquire and release
    

Read writer locks (RWL) in depth

- read_acquire, read_release, write_acquire, write_release
- Do we prefer readers or writers? Read preferring/write preferring
    - Read: lets new reads join in even when there are waiting writes
    - Write: lets pause NEW readers, waiting writers run after all read locks are released
    

Write Preferring RWL

```c
Lock lk;
Condvar reader_cv;
Condvar writer_cv;
// Need to know if reader active to block
int active_readers = 0; // Don't need waiting readers
int waiting_writers = 0; // Need to track number to wake readers later
bool active_write = False; // Check for current writer
read_acquire() {
	lk.acquire();
	// Waiting writers condition prioritizes writers
	// Notice: Readers can be interleaved with no active writers
	while (active_write || waiting_writer > 0) {
		reader_cv.wait(lk);
	}
	active_readers++;
	...
	lk.release();
}

write_acquire() {
	lk.acquire();
	waiting_writers++; // Write about to happen, prioritize writers
	// Check if another writer inprogress
	// But wait to finish up readers before writing new
	while (active_write || active_readers > 0) { 
		writer_cv.wait(lk);
	}
	waiting_writers--;
	active_write = True;
	...
	lk.release();
}
```

<!-->Week 4 Part 3 <-->
Write Preferring Reader Writer Locks (RWL)

Read and write acquire spec:

```c
Lock lk;
Condvar reader_cv;
Condvar writer_cv;
// Need to know if reader active to block
int active_readers = 0; // Don't need waiting readers
int waiting_writers = 0; // Need to track number to wake readers later
bool active_write = False; // Check for current writer
read_acquire() {
	lk.acquire();
	// Waiting writers condition prioritizes writers
	// Notice: Readers can be interleaved with no active writers
	while (active_write || waiting_writer > 0) {
		reader_cv.wait(lk);
	}
	active_readers++;
	...
	lk.release();
}

write_acquire() {
	lk.acquire();
	waiting_writers++; // Write about to happen, prioritize writers
	// Check if another writer inprogress
	// But wait to finish up readers before writing new
	while (active_write || active_readers > 0) { 
		writer_cv.wait(lk);
	}
	waiting_writers--;
	active_write = True;
	...
	lk.release();
}
```

Read and write release spec:

```c
read_release() {
	lk.acquire();
	active_readers--;
	// Signal write because we write-preferring
	if (active_readers == 0 && waiting_writers > 0) {
		write_cv.signal();
	}
	lk.release();
}

write_acquire() {
	lk.acquire();
	active_write = False;
	// Writers can block both readers and writers
	// Checking and waking writers before waking readers
	// is the implementation of write-preferring policy
	if (waiting_writers > 0) {
		writer_cv.signal();
	} else {
		// As a writer, we can unblock any number of concurrent readers
		// We do not care if multiple readers, as long as no current writers
		// Or no waiting writers
		reader_cv.broadcast();
	}
	lk.release();
}
```

Read Preferring vs Write Preferring

- If we read prefer, we might starve writers, writers must wait until all readers serviced
- Variations in policy (track # of waiting writers), but we don’t want writers to block forever
    - Possibly set a threshold of waiting writers before we let them write, say if 5 waiting writers, threshold is 10, upon 10 let them write
    - Possibly track the wait time
- For write preferring, we could possibly track the # of waiting readers (threshold to avoid reader starvation, block new readers coming in)
- Hybrid policy is common in design patterns
    
    

Deadlocks

- Cycle of waiting among a set of threads, threads mutually waiting for one another to take some action

Deadlock Example 1:

```c
// Classic deadlock
Lock A;
Lock B;

thread_func1() {
	A.acquire();
	B.acquire();
}

thread_func2() {
	B.acquire();
	A.acquire();
}
```

Deadlock example 2: Even without locks, blocking conditions

```c
// 2 Bounded Buffer Deadlock
buffer A[];
buffer B[];

thread_func1() {
	A.consume(); // Blocks because A is empty, waits
	B.produce(item);
}

thread_func2() {
	B.consume(); // Blocks because B is empty, waits
	A.produce(item);
}
```

Deadlock example 3: Monitor lock vs General Lock

```c
// Nested locking issue, common issue
// Can happen with general lock and pipe lock etc.
Lock lk;
Boundedbuf A[];

thread_func1() {
	lk.acquire(); // General lock
	...
	A.consume(); // Monitor-specific lock release
	...
	lk.release();
}

thread_func2() {
	// General lock
	lk.acquire(); // Cannot be acquired because t1 holds
	...
	A.produce(item); // Will not be run
	...
	lk.release();
}
```

Dining philosophers

- 5 diners, 5 chopsticks
    - Each philosopher picks their left chopstick, then waits for their right
    - Will each wait indefinitely because they wait on one another
- 4 necessary conditions of deadlock
    - Bounded resource: finite number of resources (infinite number is no problem)
    - No preemption, cannot forcibly take resource away
    - Hold & wait, philosophers wont give up their own resource upon knowing the next resource is blocked
    - Circular wait, a cycle of dependency, each philosopher waits for another
- Are these 4 conditions sufficient for deadlock? Is implication true?
    - For single instance resource (it is sufficient)
    - Multiple instances of a resource (not sufficient)
        - A new resource may break a deadlock condition
- What to do to break deadlock?
    - Breaking any of the necessary conditions
    - Exists 3 types of approaches
        - Deadlock prevention by limiting system/program behaviors
        - Bounded resources → reserve some resources (not always possible)
        - No preemption → allow for resource to be preempted (timer, timeouts, leases)
        - Hold & wait → acquire all or release all locks if we fail to do one or the other
        - try_acquire, if any of them fail then releases all locks
        - Circular wait → global locking order, maybe use the ID as a comparison ABC (most common)
    - Deadlock avoidance by letting the program do whatever, but system determines when it is safe to grant resources at runtime (Admission control)
    - Remember, it is not that the logic is faulty 100% of the time, but the interleaving of events will possibly cause deadlock
    - All resources must be granted by the system
    - Chopstick fairy analogy, hands out one chopstick at a time, make sure a philosopher finishes eating before handing resource to another (maximally permissive)
        - Hand out chopstick freely until the last one
        - Handout the last one to someone already holding a chopstick
    - Bankers algorithm
        - When is it safe for a system to grant a particular request
        - 3 states, safe, unsafe, deadlock
            - Safe → at least 1 ordering to grant request such that everyone can finish
            - Unsafe → At least 1 possible future request that will lead to deadlock, no matter scheduling order
            - Deadlock → A future request resulting in deadlock
        - Can move from unsafe state to safe if thread finishes future request
        - But, we should try to keep the system in a continually safe state

## Week 5
<!-->Week 5 Part 1 <-->
Safe, unsafe, and deadlock states

- Safe → At least one possible way of granting resource that lets every member finish their request
- Unsafe → At least one future request can cause system to deadlock, unsafe but not deadlock (future request has not been made yet)

Example:

- Available is the actual current state of the system
- To be available is the prophecy, imagining the potential state of the system
- 3 chopsticks, 3 philosophers, each need a max of 2 chopsticks, but will request one at a time
- Let philosophers A, B, C start with 0 chopsticks
    
    1. Grant A 1 chopstick, available = 2, to be available = 2
    
    1.1 When A gets another chopstick, to be available = 3 because 2 (TBA) - 1 (give to A) + 2 (A returns 2) = 3
    
    1.2 We can check this for each member A, B, C for the current state, and determine that we remain in a safe state
    
    2. Grant C a chopstick, available = 1, to be available = 2 or 3
    
    2.1 To be available = 2 assumes that we give the chopstick to either A or C before B
    
    3. Grant B a chopstick, available = 0, to be available = 0
    
    3.1 No parties can finish (to be available will never be > 0), system is in an unsafe state
    
    3.2 Unsafe until a party chooses to execute a future request (request made) that it becomes a deadlock state
    

Last deadlock prevention, deadlock detection

- If it is rare, detect and recover when deadlock occurs
- Detection can be done via resource allocation graph
- P1 waiting for → r1 held by → P2 waiting for → r2 held by → P1 (cycle)
- High number of false positives but comes with performance penalties
    - Abort & recover after detection
- Ostrich algorithm
    - Just let user kill or reboot, relieves responsibility from system

Physical memory management

- Volatile, byte addressable, order of GBs
- Access latency is ~200 cycles, L1 cache is (~7 cycles/single digits)
- Process’s code & data needs to be in memory

Problem: Many processes, limited physical memory, possible solutions includ

- Attempt 1: If we are single core, maybe process can use the entire physical memory
    - Removes the need for memory translation and overhead
    - Context switch, very high scheduling overhead
- Write A’s VAS somewhere else (disk, slow but lots of room)
- Then load B’s VAS into memory
- How do we enforce kernel/user memory separation?
- Cannot do this in a multicore setting
- Attempt 2: Divide up physical memory, support multiple processes, divvy up memory per process A, B, C regions
- Less context switch overhead
- Still needs virtual → physical translation
- Base = where does a process’s memory start in DRAM (we need to + C some constant to offset the proper physical location in DRAM)
- Bound = size of VAS (sizes of program region)
    
    ![Screenshot 2024-05-08 at 8.27.54 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d05bbc56-e21c-47d8-b807-9362ccfd7522/46623c31-2708-4729-a061-46627248cc1c/Screenshot_2024-05-08_at_8.27.54_PM.png)
    
- How does this support growth? We get lucky if a new process terminates. Otherwise we reject growing the memory space.
- If we terminate a region, lets say B, where B lies between A and C (A, B, C), and a new process D requires a lot of memory but A and C prevent it, D must stall until a suitable region becomes available
- External fragmentation, common for memory allocation
- We can perform compaction (squishing A and C up together) to avoid fragmentation, must update base and bound registers for each compacted process
    - Expensive operation, must wait for compaction, variability in performance, non-consistent results
    - Often times we want to share library code, cow fork, but base and bound approach makes this impossible, cannot specify which parts of each region is shared
- Translation done on the entire VAS, cannot share part of it

Attempt 3: Finer-grained translation & permission management

- Process’s VAS can map its memory to different regions in DRAM
- More control of sharing, many multiple processes can point to same physical location
- Want to use a fixed size chunk (page, typically 4096 KB)
- No more external fragmentation
    - But can result in internal fragmentation, because let’s say our process only uses 1 byte of a virtual page, but allocated a whole page to it, wasted space because too much
    - Versus external fragmentation, where there is space but not enough, both lead to wasted space
    - As long as any room is physically available, then process can grow its own VAS, DRAM no longer contiguous
- We can only load pages in use to memory, we can have holes in the VAS and only allocate to DRAM when we need to access it
    - Demand paging
- Access new DRAM page, no existing translation → page fault (trap 14), stores address causing page fault in cr2 and %rip causing access

Kernel must track what VAS are valid and should be brought into memory, versus what address should not be accessed

- Segfault is when process tries to access invalid memory
- Page fault is seamless, when pointer tries to access page of VAS not mapped to physical memory, so memory management unit (MMU) must fetch from disk
- https://stackoverflow.com/questions/6950549/segmentation-fault-vs-page-fault

Strategy is called paging: translation table

<!-->Week 5 Part 2 <-->
Attempt 3: divide virtual & physical memory

- Mapping VAS to physical memory, called frames or physical pages
- Different processes can share the read-only portions of code
- Having finer granularity, more complicated management, requires translation on a page level
    - Versus a naiive approach where we only maintain VA + base approach for lookups
- Memory translation table
    - Page to physical page (frame)
        - Any offset in a page will be the same offset in the physical page, no need for translation
        - Offset will be lower bits (from the right side, typically 12 bits because 2^12 = 4096)
            
            

Page table, storing translations for all pages

- Giant array [], index using page # as the index, if it is mapped to physical address, then store the frame number in the corresponding entry
    - Then get the value, concat with the offset to find the physical address
- Memory translation done by hardware, page table walk
- Address is stored in the page table base register, %cr3, address is a physical address
- Each frame has an access mode, R/W permissions
- We are doubling memory access every time, slow without caching
    
    

Translation Lookaside Buffer (TLB)

- Dedicated cache for memory translation
- After a failed cache hit and after a page table lookup, we store the frame back in the cache
- Cost of single array page table
- Per-process data structure, same kernel mapping in VAS maps to same physical address
- Large array can take up a lot of space, we reserve space for it regardless of if it is even being used
    - We want to reduce the space of this page table
    - Some may create super page/huge page with 2 MB and 1 GB, less bits available to represent pages because larger chunks
    - Internal fragmentation, low memory utilization, but cache hits would be more frequent because larger pages, less total number of pages in the array
- Still many page tables, lots of memory
- Inverted page table
- Typically we map a virtual page → frame, but instead we have a global inverted page table
    - Indexed by frame #, storing page #, must also store PID because pages are per process-dependent
<!-->Week 5 Part 3 <-->
Multilevel page table

![Screenshot 2024-05-08 at 10.36.33 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d05bbc56-e21c-47d8-b807-9362ccfd7522/e71e9079-3bb7-4710-aa23-5d265dcab06a/Screenshot_2024-05-08_at_10.36.33_PM.png)

- In a traditional 1 level page table, we may have 2^52 pages (2^64 (address bits) - 2^12 (4 KB page offset), we have subsets of tables
- Lets say we only use one a single page, instead of allocating an array of 2^52 pages, we only allocate one level 3 page table, one level 2 page table, and one level 1 page table (all used as indices to get to the level 3)
    
    

Example:

- We have a 21 bit virtual address, page size 4096 bits → 12 bit representation
- Index 1 is 4 bits, index 2 is 5 bits, offset is 12 bits = 21 bits VA
- Let code region be 0x1000 - 0x1fff
- Let stack region be 0xfe000 - 0xfefff
- First, we allocate a first level page table, 2^4 (16) entries
- Then, we allocate a second level page table, 2^5 (32) entries
- Maximum number of pages = 512, equivalent to the number of bits (2^9 = 512)

x86 Page Table

![Screenshot 2024-05-08 at 11.00.01 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d05bbc56-e21c-47d8-b807-9362ccfd7522/45c72cf7-3c64-4571-a90f-758b3aa38773/Screenshot_2024-05-08_at_11.00.01_PM.png)

- Trap 13 is memory accesses outside of the possible 2^48 bit VAS
- Sign extend is usually just 1s or 0s, and addresses with random bits are invalid, invokes a general protection fault
- At any point, if we traverse and the present bit is 0, then invoke a page fault

![Screenshot 2024-05-08 at 11.07.00 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d05bbc56-e21c-47d8-b807-9362ccfd7522/4e606667-4c41-4c79-8c7d-4bb9e4a4494c/Screenshot_2024-05-08_at_11.07.00_PM.png)

Page Faults

- %rip accesses memory, stores the fault address into a register
- Exception: problem with page table walk, or there is a permission mismatch (marked read/write only or kernel only page)
- Error code in “tf→err” if the bit is present, user/kernel, read/write
- Demand paging is one cause of page fault (pages that kernel knows exists)
    - Growing the stack, as we push more items to stack it will be page fault if exceeds size, not currently mapped
    - OS is responsible for determining fault address
    - Heap growth may also cause page fault
    - Memory map
- Permission mismatching
- Copy on write (cow) fork, when process has write access, we map it to read only to detect when a write occurs, then establish new mapping with write permissions
    - Kernel must track whether page is COW or not
- Write to read only page (actual permission violation)
- TLB caches permissions, so when we update the permissions we must flush the TLB
    - When we make a new mapping and add to the TLB, we don’t need to flush, but when we change the permission such as when we do COW, then we need to flush
- Kernel needs to track additional info about VAS
    - Machine independent, specified by architecture, set of bookkeeping structure, describes state of the virtual address
    - Machine dependent page table → loaded in page table base register (cr3)
    - vspaceupdate() updates entries into the machine dependent page table (presumably after updating some page update such as a permission update)

## Week 6
<!-->Week 6 Part 1 <-->
<!-->Week 6 Part 2 <-->
<!-->Week 6 Part 3 <-->

## Week 7
<!-->Week 7 Part 1 <-->
<!-->Week 7 Part 2 <-->
<!-->Week 7 Part 3 <-->

## Week 8
<!-->Week 8 Part 1 <-->
<!-->Week 8 Part 2 <-->
<!-->Week 8 Part 3 <-->