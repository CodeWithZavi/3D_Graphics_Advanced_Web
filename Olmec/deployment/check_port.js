const { NodeSSH } = require('node-ssh');
const { getSshConfig } = require('./loadConfig');
const ssh = new NodeSSH();

const config = getSshConfig();

async function checkPort() {
    await ssh.connect(config);
    
    console.log('--- NGINX STATUS ---');
    const status = await ssh.execCommand('systemctl status nginx');
    console.log(status.stdout || status.stderr);

    console.log('\n--- UFW STATUS ---');
    const ufw = await ssh.execCommand('ufw status');
    console.log(ufw.stdout || ufw.stderr);

    console.log('\n--- LISTENING PORTS ---');
    const ss = await ssh.execCommand('ss -tulpn | grep :80');
    console.log(ss.stdout || ss.stderr);

    console.log('\n--- CURL LOCALHOST ---');
    const curl = await ssh.execCommand('curl -I http://localhost');
    console.log(curl.stdout || curl.stderr);

    ssh.dispose();
}

checkPort().catch(console.error);
