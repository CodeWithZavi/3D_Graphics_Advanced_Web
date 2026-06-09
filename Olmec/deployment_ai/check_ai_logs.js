const { NodeSSH } = require('../deployment/node_modules/node-ssh');
const { getSshConfig } = require('../deployment/loadConfig');
const ssh = new NodeSSH();

async function checkLogs() {
    await ssh.connect(getSshConfig());
    const result = await ssh.execCommand('pm2 logs olmec-train-loop --lines 50 --no-daemon & sleep 5 && kill $!');
    console.log(result.stdout || result.stderr);
    ssh.dispose();
}

checkLogs().catch(console.error);
