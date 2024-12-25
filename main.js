import psList from 'ps-list';
import checkConfig from './checkConfig.js';
import updateFrameRateLimit from './updateFrameRateLimit.js';

// Read config from config.json
const config = checkConfig();

// Variable to store detected processes
let detectedProcesses = {};

// Monitoring processes every 5 seconds
setInterval(async () => {
    const processes = await psList();
    const actualProcesses = {};

    // Check active processes
    config.processes.forEach(process => {
        const activeProcess = processes.find(p => p.name.toLowerCase() === process.name.toLowerCase());

        if (activeProcess) {
            if(!detectedProcesses[process.name]){
                console.log(`Process ${process.name} detected`);
                updateFrameRateLimit(process.frl, config.settings);
            }
            actualProcesses[process.name] = true;
        }else{
            if(detectedProcesses[process.name]){
                console.log(`Process ${process.name} ended`);
                updateFrameRateLimit(0, config.settings);
            }
        }
    });

    // Update the status of detected processes
    detectedProcesses = actualProcesses;
}, 8000);