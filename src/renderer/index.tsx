import { createRoot } from 'react-dom/client';
import App from './App';
import { ipcRenderer } from 'electron';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

async function selectFolder(): Promise<string | null> {
  try {
    const { filePaths } = await ipcRenderer.invoke('select-folder');
    if (filePaths.length > 0) {
      return filePaths[0];
    }
    return null;
  } catch (error) {
    console.error('Error selecting folder:', error);
    return null;
  }
}

// 3. ipcRenderer get each content of each file
async function getFileContents(filePath: string): Promise<string | null> {
  try {
    const fileContent = await ipcRenderer.invoke('read-file', filePath);
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}


const result = await selectFolder();

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log("IPC test:", arg);
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);


