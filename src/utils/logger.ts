import fs from 'fs';
import path from 'path';

export const logToFile = (checkType: string, data: any): void => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      checkType,
      data
    };
    
    const logPath = path.join(process.cwd(), 'logs.txt');
    const logString = JSON.stringify(logEntry, null, 2) + '\n\n';
    
    fs.appendFileSync(logPath, logString);
    
    console.log(`Logged ${checkType} check results to logs.txt`);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};
