const { NodeSSH } = require('node-ssh');
const { getSshConfig } = require('./loadConfig');
const ssh = new NodeSSH();

const config = getSshConfig();

async function fixApt() {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);

    console.log('🛠 Fixing malformed apt source...');
    await ssh.execCommand('rm -f /etc/apt/sources.list.d/mongodb-org-7.0.list');
    
    console.log('📦 Updating packages again...');
    const updateResult = await ssh.execCommand('apt-get update');
    console.log(updateResult.stdout || updateResult.stderr);

    console.log('📦 Installing Nginx...');
    const installResult = await ssh.execCommand('apt-get install -y nginx');
    console.log(installResult.stdout || installResult.stderr);

    console.log('🚀 Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    ssh.dispose();
}

fixApt().catch(console.error);
