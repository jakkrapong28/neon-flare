const { exec } = require('child_process');

console.log('🧹 Starting Antigravity Cleanup...');

const commands = [
    // Kill processes matching "Antigravity Helper"
    'pkill -f "Antigravity Helper"',
    // Kill any stray node processes that might be hanging (Be careful with this one)
    // 'pkill -f "node"', // Commented out to be safe, user can uncomment if needed
    // Clear typical temp directories
    'rm -rf /tmp/antigravity*',
    'rm -rf ~/Library/Caches/Antigravity', // User requested cleanup
    'echo "✅ Cleanup commands executed."'
];

commands.forEach(cmd => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            // It's okay if pkill fails (means no process found)
            if (error.code !== 1) {
                console.error(`⚠️ Error executing: ${cmd}`, error.message);
            }
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});
