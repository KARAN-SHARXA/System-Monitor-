import os from 'node:os';

let oldCpus = os.cpus();

function calculateCPU(oldCpu, newCpu) {
  const oldTotal = Object.values(oldCpu.times).reduce((a, b) => a + b);
  const newTotal = Object.values(newCpu.times).reduce((a, b) => a + b);

  const idle = newCpu.times.idle - oldCpu.times.idle;
  const total = newTotal - oldTotal;
  const used = total - idle;

  return ((100 * used) / total).toFixed(2);
}

function monitor() {
  const newCpus = os.cpus();

  const usage = newCpus.map((cpu, i) => {
    return {
      core: i,
      usage: calculateCPU(oldCpus[i], newCpus[i]) + '%',
    };
  });

  console.clear();
  console.table(usage);

  const usedMemory = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024);
  console.log(
    `Memory Used: ${usedMemory.toFixed(2)} GB / ${(
      os.totalmem() /
      (1024 * 1024 * 1024)
    ).toFixed(2)} GB`
  );

  // Update oldCpus for next iteration
  oldCpus = newCpus;
}

// Run monitor every 1 second
setInterval(monitor, 1000);