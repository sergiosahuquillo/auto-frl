import fs from 'fs';
import os from 'os';
import path from 'path';

const configFileName = 'config.json';
const configDir = path.join(os.homedir(), 'AppData', 'Local', 'auto-frl');
const configFilePath = path.join(configDir, configFileName);

const initialConfig = JSON.parse(fs.readFileSync('./initialConfig.json', 'utf8'));

export default function checkConfig(){
    if(fs.existsSync(configFilePath)){
        const configData = fs.readFileSync(configFilePath, 'utf-8');
        console.log('Config file found:', configFilePath);
        return JSON.parse(configData);
    }else{
        if(!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        fs.writeFileSync(configFilePath, JSON.stringify(initialConfig, null, 4));
        console.log('Config file created:', configFilePath);
        console.log('Edit the config file and add your processes (games) and her frl (frame rate limit). Then start the program again.');
        process.exit(0);
    }
}