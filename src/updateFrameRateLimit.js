import { execSync } from 'child_process';
import fs from 'fs';

export default function updateFrameRateLimit(frl, settings){
    try{
        const filePath = settings.RTSSProfileLocation;

        if (!fs.existsSync(filePath)) {
            console.error('RTSS Profile not found:', filePath);
            return;
        }

        let RTSSProfilePath = fs.readFileSync(filePath, 'utf8');
        const regex = /Limit=\d+/;

        if(regex.test(RTSSProfilePath)){
            RTSSProfilePath = RTSSProfilePath.replace(regex, `Limit=${frl}`);
            console.log('Frame Rate Limit updated to:', frl);
        }else{
            console.error('RTSS Profile does not have framerate section');
            return;
        }

        // Save the updated RTSS Profile
        fs.writeFileSync(filePath, RTSSProfilePath);

        // Reload RTSS
        reloadRTSS(settings);
    }catch(error){
        console.error('Error updating Frame Rate Limit:', error);
    }
}

function reloadRTSS(settings){
    try{
        const executableName = settings.RTSSExecutableName;
        const hooksLoaderName = settings.RTSSHooksLoaderName;

        console.log('Reloading RTSS...');

        // Kill RTSS (RTSS will rerun the process as soon as we kill it, so there is no need to start it manually)
        execSync(`taskkill /f /im ${executableName}`, {stdio: 'ignore'});

        // Kill RTSSHooksLoader (RTSS will rerun the process as soon as we kill it, so there is no need to start it manually)
        execSync(`taskkill /f /im ${hooksLoaderName}`, {stdio: 'ignore'});

        console.log('RTSS reloaded');
    }catch(error){
        console.error('Error reloading RTSS:', error);
    }
}