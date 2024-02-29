/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

//import './ui/assets/output.css';

console.log('👋 This message is being logged by "renderer.js", included via Vite');
/*document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })
  
  document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    document.getElementById('theme-source').innerHTML = 'System'
  })*/

  document.getElementById('send').addEventListener('click', async () => {
    await window.mq.put()
    //document.getElementById('theme-source').innerHTML = 'System'
  })  

const logs = document.getElementById('logs')
window.mq.logs((content) => {
  
  logs.innerHTML = '<div>  <br><hr><pre class="success-text text-orange-500">' + content + "</pre><br></div>" + "\n" + logs.innerHTML
})


document.getElementById("drop_zone").addEventListener('dragenter', async (event) => {
    event.preventDefault();
})
document.getElementById("drop_zone").addEventListener('dragleave', async (event) => {
    event.preventDefault();
})
document.getElementById("drop_zone").addEventListener('drop', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    let pathArr = [];
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path)
        pathArr.push(f.path); // assemble array for main.js
    }
    console.log(pathArr);
    const ret = await window.input.drop(pathArr);
    console.log(ret);

    
})
document.getElementById("drop_zone").addEventListener('dragover', async (event) => {
    event.preventDefault();
})





