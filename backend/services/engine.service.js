const { spawn } = require('child_process');

class EngineService {
    runEngine(transactions) {
        return new Promise((resolve, reject) => {
            const enginePath = process.env.ENGINE_PATH;
            const child = spawn(enginePath, [], { stdio: ['pipe', 'pipe', 'pipe'] });
            
            let output = '';
            let errOutput = '';
            
            child.stdout.on('data', (chunk) => { output += chunk; });
            child.stderr.on('data', (chunk) => { errOutput += chunk; });
            
            child.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Engine exited with code ${code}: ${errOutput} | Stdout: ${output}`));
                }
                try {
                    const parsed = JSON.parse(output);
                    if (parsed.error) {
                        return reject(new Error(parsed.error));
                    }
                    resolve(parsed);
                } catch (e) {
                    reject(new Error('Engine produced invalid JSON output: ' + output));
                }
            });
            
            child.stdin.write(JSON.stringify(transactions));
            child.stdin.end();
        });
    }
}

module.exports = new EngineService();
