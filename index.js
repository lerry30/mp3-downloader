const ytdl = require('ytdl-core');
const fs = require('fs');
const os = require('os');
const { createInterface } = require('readline');

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
});

const run = async () => {
	try {
		const url = await urlPrompt();
		const mp3Name = await getMp3Name();
		const mp3DownloadPath = `${ os.homedir() }/Downloads/${ mp3Name }.mp3`;
		const res = await download(url, mp3DownloadPath);
		console.log(res);
	} catch (error) {
		console.log(error)
	}
}

run();

function download(url, output = 'audio.mp3', defFilter = { filter: 'audioonly' }) {
  const stream = ytdl(url, defFilter); 
  stream.pipe(fs.createWriteStream(output, { flags: 'w' }));

  stream.on('progress', (chunkLength, downloaded, total) => {
    const floatDownloaded = downloaded / 1_000_000;
    const floatTotal = total / 1_000_000;
    const percentage = (downloaded / total) * 100;

    console.log(`${floatDownloaded.toFixed(2)} MB of ${floatTotal.toFixed(2)} MB ${percentage.toFixed(2)}%`); 
  });

  
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve('done')
    });

    stream.on('error', (error) => {
      console.log(error);
      reject('error');
    });
  });
}


async function  prompt(question) {
	const readLineAsync = msg => {
		return new Promise(resolve => {
			readline.question(msg, userRes => resolve(userRes));
		});
	}

	const userRes = await readLineAsync(question);
	return userRes;
}

async function urlPrompt() {
	const mp3Url = await prompt('Paste the URL press Control + C to exit:');
	if(!mp3Url || !mp3Url.startsWith('https://www.youtube.com/watch?v=')) {
		return urlPrompt();
	}

	return mp3Url;
}

async function getMp3Name() {
	const mp3Name = await prompt('Type the mp3 file name or press Control + C to exit:');
	if(!mp3Name) {
		return getMp3Name();
	}

	return mp3Name;
}