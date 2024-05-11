import { spawn } from "child_process";

export const recommendations = async (req, res) => {
    console.log('\nYou are in the recommendation api\n');
    const terms = req.body.Terms;
    var result; // data from script

    // Define the Python script you want to execute
    const pythonPath = 'D:\\Plus-Experience\\Plus-Experience\\ML\\model.py';
    // Arguments to be passed to the Python script (if any)
    const args = [terms];

    // Spawn a new Python process
    const python = await spawn('py', [pythonPath, terms]);

    // Listen for stdout data from the Python process
    python.stdout.on('data', async function (data) {
        result = await data.toString();
    });

    // Listen for stderr data from the Python process
    python.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    // Listen for Python process exit event
    python.on('close', (code) => {
        console.log(`Code: ${code}`);
        console.log("\n\n########The Result", result)
        res.send(result);
    });
}