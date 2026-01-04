const fs = require('fs');

// Funktion för att vänta, så vi inte stressar API-servern
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createMultiplePosts(count) {
    // 1. Skapa mappen 'blog' om den inte finns
    if (!fs.existsSync('blog')){
        fs.mkdirSync('blog');
    }

    for (let i = 0; i < count; i++) {
        try {
            // 2. Hämta slumpmässig karaktär
            const randomId = Math.floor(Math.random() * 826) + 1;
            const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
            
            if (!response.ok) throw new Error(`API-fel: ${response.status}`);
            
            const char = await response.json();
            const fileName = `blog/character-${char.id}.html`;
            const postTitle = `Allt om ${char.name}`;
            const date = new String(new Date().toLocaleDateString('sv-SE'));

            // 3. Skapa HTML-innehållet för blogginlägget
            const html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>${postTitle}</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <nav style="margin-bottom: 20px;">
            <a href="../index.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Hem</a>
            <a href="../about.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Om oss</a>
            <a href="../privacy.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Integritet</a>
        </nav>
        <h1>Rick & Morty Bloggen</h1>
    </header>
    <main style="max-width: 800px; margin: 20px auto; padding: 20px; background: #3c3e44; border-radius: 10px; color: white;">
        <p style="color: #97ce4c;">Publicerad: ${date}</p>
        <img src="${char.image}" style="width: 100%; border-radius: 10px; border: 3px solid #97ce4c;">
        <h2>Karaktärsanalys: ${char.name}</h2>
        <p>${char.name} är en ${char.species.toLowerCase()} med statusen ${char.status.toLowerCase()}.</p>
        <p>Denna karaktär kommer från ${char.origin.name} och har setts i ${char.location.name}.</p>
    </main>
</body>
</html>`;

            fs.writeFileSync(fileName, html);

            // 4. Uppdatera index.html (Arkivet)
            let indexHtml = fs.readFileSync('index.html', 'utf8');
            const linkTag = `<p>${date}: <a href="${fileName}" style="color: #97ce4c;">${char.name}</a></p>\n`;
            
            if (indexHtml.includes('')) {
                indexHtml = indexHtml.replace('', linkTag);
                fs.writeFileSync('index.html', indexHtml);
            }
            
            console.log(`Inlägg skapat för ${char.name}`);

            // Pausa 1 sekund
            await sleep(1000);

        } catch (err) {
            console.error(`Fel vid inlägg ${i + 1}:`, err.message);
        }
    }
}

// Kör funktionen för att skapa 3 inlägg
createMultiplePosts(3);
