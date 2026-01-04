const fs = require('fs');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createMultiplePosts(count) {
    if (!fs.existsSync('blog')) fs.mkdirSync('blog');

    for (let i = 0; i < count; i++) {
        try {
            const randomId = Math.floor(Math.random() * 826) + 1;
            const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
            const char = await response.json();
            
            const fileName = `blog/character-${char.id}.html`;
            const date = new Date().toLocaleDateString('sv-SE');

            // Skapa bloggfilen (samma som förut)
            const blogHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="../style.css"></head><body style="background:#202329;color:white;padding:50px;font-family:sans-serif;"><a href="../index.html" style="color:#97ce4c;">← Tillbaka</a><br><br><img src="${char.image}" style="border-radius:20px;border:4px solid #97ce4c;width:300px;"><h1>Analys: ${char.name}</h1><p>Art: ${char.species}</p><p>Status: ${char.status}</p><p>Ursprung: ${char.origin.name}</p></body></html>`;
            fs.writeFileSync(fileName, blogHtml);

            // UPPDATERA STARTSIDAN
            let indexHtml = fs.readFileSync('index.html', 'utf8');
            
            // Kontrollera att taggarna finns
            if (!indexHtml.includes('')) {
                console.error("FEL: Hittade inte i index.html!");
                return;
            }

            // Flytta gamla till arkiv vid första körningen för dagen
            if (i === 0) {
                const dailyContentMatch = indexHtml.match(/([\s\S]*?)/);
                if (dailyContentMatch && dailyContentMatch[1].trim() !== "") {
                    const oldContent = dailyContentMatch[1].trim();
                    indexHtml = indexHtml.replace('', `\n${oldContent}`);
                    indexHtml = indexHtml.replace(/[\s\S]*?/, '\n');
                }
            }

            // Lägg till den nya länken
            const newLink = `<p style="margin:10px 0;">${date}: <a href="${fileName}" style="color:#97ce4c;text-decoration:none;font-weight:bold;">› ${char.name}</a></p>`;
            indexHtml = indexHtml.replace('', `\n${newLink}`);

            fs.writeFileSync('index.html', indexHtml);
            console.log(`Klart: ${char.name}`);
            await sleep(1000);

        } catch (err) {
            console.error("Ett fel uppstod:", err);
        }
    }
}

createMultiplePosts(3);
