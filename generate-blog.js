const fs = require('fs');

async function createMultiplePosts(count) {
    for (let i = 0; i < count; i++) {
        // 1. Hämta slumpmässig karaktär
        const randomId = Math.floor(Math.random() * 826) + 1;
        const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
        const char = await response.json();

        const fileName = `blog/character-${char.id}.html`;
        const postTitle = `Allt om ${char.name}`;
        const date = new String(new Date().toLocaleDateString('sv-SE'));

        // 2. Skapa själva bloggfilen
        const html = `
<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <title>${postTitle}</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header>
        <h1>Rick & Morty Bloggen</h1>
        <nav><a href="../index.html" style="color: #97ce4c;">← Tillbaka till huvudportalen</a></nav>
    </header>
    <main style="max-width: 800px; margin: 20px auto; padding: 20px; background: #3c3e44; border-radius: 10px; color: white;">
        <p style="color: #97ce4c;">Publicerad: ${date}</p>
        <img src="${char.image}" style="width: 100%; border-radius: 10px; border: 3px solid #97ce4c;">
        <h2>Karaktärsanalys: ${char.name}</h2>
        <p>${char.name} är en ${char.species} med statusen ${char.status}.</p>
        <p>Denna karaktär kommer från ${char.origin.name} och har setts i ${char.location.name}.</p>
    </main>
</body>
</html>`;

        fs.writeFileSync(fileName, html);

        // 3. Uppdatera "Kalendern" / Arkivet i index.html
        // Vi letar efter en speciell kommentar i index.html och lägger till länken efter den
        let indexHtml = fs.readFileSync('index.html', 'utf8');
        const linkTag = `<p>${date}: <a href="${fileName}" style="color: #97ce4c;">${char.name}</a></p>\n`;
        
        // Detta gör att det nyaste inlägget hamnar högst upp i listan
        indexHtml = indexHtml.replace('', linkTag);
        fs.writeFileSync('index.html', indexHtml);
        
        console.log(`Inlägg skapat för ${char.name}`);
    }
}

createMultiplePosts(3);

// ... (efter att du skapat de 3 inläggen i loopen)

function updateRSSFeed(posts) {
    let rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
    <channel>
        <title>Rick &amp; Morty Daily Updates</title>
        <link>https://din-doman.com</link>
        <description>Dagliga analyser från multiversumet</description>`;

    posts.forEach(post => {
        rssContent += `
        <item>
            <title>Ny analys: ${post.name}</title>
            <link>https://din-doman.com/blog/character-${post.id}.html</link>
            <description>Lär känna ${post.name} från ${post.origin}.</description>
        </item>`;
    });

    rssContent += `</channel></rss>`;
    fs.writeFileSync('feed.xml', rssContent);
}