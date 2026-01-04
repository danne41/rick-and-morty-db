const fs = require('fs');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createMultiplePosts(count) {
    if (!fs.existsSync('blog')){
        fs.mkdirSync('blog');
    }

    for (let i = 0; i < count; i++) {
        try {
            const randomId = Math.floor(Math.random() * 826) + 1;
            const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
            if (!response.ok) throw new Error(`API-fel: ${response.status}`);
            
            const char = await response.json();
            const fileName = `blog/character-${char.id}.html`;
            const date = new String(new Date().toLocaleDateString('sv-SE'));

            const typeText = char.type ? ` Denna specifika varelse kategoriseras som en ${char.type.toLowerCase()}.` : "";
            const episodeCount = char.episode.length;
            const importance = episodeCount > 5 ? "en återkommande karaktär" : "en unik bekantskap";

            const html = `<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>Djupdykning: ${char.name}</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <nav style="margin-bottom: 20px;">
            <a href="../index.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Hem</a>
            <a href="../about.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Om oss</a>
            <a href="../privacy.html" style="color: #97ce4c; margin: 0 15px; text-decoration: none; font-weight: bold;">Integritet</a>
        </nav>
        <h1>Rick & Morty Database</h1>
    </header>
    <main style="max-width: 800px; margin: 20px auto; padding: 30px; background: #3c3e44; border-radius: 10px; color: white; line-height: 1.6;">
        <p style="color: #97ce4c; font-weight: bold;">Publicerad: ${date}</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <img src="${char.image}" style="width: 250px; border-radius: 50%; border: 5px solid #97ce4c;">
            <h2 style="font-size: 2.2rem; margin-top: 10px;">${char.name}</h2>
        </div>

        <section>
            <h3>Vem är ${char.name}?</h3>
            <p>${char.name} är en ${char.species.toLowerCase()} från ${char.origin.name}.${typeText} I det stora multiversumet är ${char.name} ${importance} som vi har haft nöjet att stifta bekantskap med i totalt ${episodeCount} avsnitt av serien.</p>
        </section>

        <section style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Observationsdata</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Status:</strong> ${char.status}</li>
                <li><strong>Art:</strong> ${char.species}</li>
                <li><strong>Senaste position:</strong> ${char.location.name}</li>
            </ul>
        </section>

        <section>
            <h3>Analys</h3>
            <p>Att kategorisera invånare i Rick och Mortys värld är aldrig enkelt. ${char.name} representerar den galenskap och variation som serien är känd för. Eftersom hen kommer från ${char.origin.name}, kan vi dra slutsatsen att hens roll i berättelsen är tätt sammankopplad med den specifika dimensionens lagar.</p>
        </section>

        <div style="margin-top: 40px; border-top: 1px solid #97ce4c; padding-top: 20px; text-align: center;">
            <a href="../index.html" style="color: #97ce4c; text-decoration: none;">← Tillbaka till huvuddatabasen</a>
        </div>
    </main>
</body>
</html>`;

            fs.writeFileSync(fileName, html);

            let indexHtml = fs.readFileSync('index.html', 'utf8');
            const linkTag = `<p>${date}: <a href="${fileName}" style="color: #97ce4c;">Analys: ${char.name}</a></p>\n`;
            
            if (indexHtml.includes('')) {
                indexHtml = indexHtml.replace('', linkTag);
                fs.writeFileSync('index.html', indexHtml);
            }
            
            console.log(`Inlägg skapat för ${char.name}`);
            await sleep(1000);

        } catch (err) {
            console.error(`Fel vid inlägg ${i + 1}:`, err.message);
        }
    }
}

createMultiplePosts(3);
