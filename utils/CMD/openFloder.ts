import { exec } from 'child_process';
// const exec = require('child_process').exec;
export function useOpenPath(path: string, isSelect: boolean = false) {
  exec(`explorer.exe ${isSelect ? '/select,' : ''}${path}`);
}
