// cmd: wmic logicaldisk get  
// options for props: caption,description,drivetype,filesystem,freespace,size,volumenamev
import { platform } from 'node:os';
import { exec } from 'node:child_process';


/**
 * @description Get all drives on Windows systems
*/
async function getWindowsDrives() {
    return new Promise((resolve, reject) => {
        exec('wmic logicaldisk get caption', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            const drives = stdout.split('\n')
                .map(drive => drive.trim())
                .filter(drive => /^[A-Za-z]:$/.test(drive));
            resolve(drives);
        });
    });
}

/**
 * @description Get all mount points on Unix-like systems(+macOS)
*/
async function getUnixMountPoints() {
    return new Promise((resolve, reject) => {
        exec('mount', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            const mountPoints = stdout.split('\n')
                .map(line => line.split(' ')[2])
                .filter(Boolean);
            resolve(mountPoints);
        });
    });
}

let _getDrives = async () => {
    const p = platform();
    if (p === 'win32') {
        _getDrives = getWindowsDrives;
    } else if (p === 'darwin' || p === 'linux') {
        _getDrives = getUnixMountPoints;
    } else {
        throw new Error('Unsupported platform');
    }
    return await _getDrives();
}
export const getDrives = _getDrives;