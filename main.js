import psList from 'ps-list';
import checkConfig from './checkConfig.js';
import updateFrameRateLimit from './updateFrameRateLimit.js';

// Read config from config.json
const config = checkConfig();

// Variable to store detected processes
let detectedProcesses = {};

// Wait for X seconds before updating the frame rate limit
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Monitoring processes every 5 seconds
setInterval(async () => {
    const processes = await psList();
    const actualProcesses = {};

    // Check active processes
    for(process of config.processes){
        const activeProcess = processes.find(p => p.name.toLowerCase() === process.name.toLowerCase());

        if (activeProcess) {
            if(!detectedProcesses[process.name]){
                console.log(`Process ${process.name} detected`);
                await wait(5000);
                updateFrameRateLimit(process.frl, config.settings);
            }
            actualProcesses[process.name] = true;
        }else{
            if(detectedProcesses[process.name]){
                console.log(`Process ${process.name} ended`);
                await wait(5000);
                updateFrameRateLimit(0, config.settings);
            }
        }
    }

    // Update the status of detected processes
    detectedProcesses = actualProcesses;
}, 5000);