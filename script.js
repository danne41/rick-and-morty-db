const container = document.getElementById('character-container');
const searchInput = document.getElementById('search');
let allCharacters = [];

// 1. Hämta alla karaktärer från API:et
async function fetchAllCharacters() {
    let url = 'https://rickandmortyapi.com/api/character';
    try {
        container.innerHTML = '<p class="loader-text">Öppnar portalen till alla dimensioner...</p>';
        while (url) {
            const response = await fetch(url);
            const data = await response.json();
            allCharacters = [...allCharacters, ...data.results];
            url = data.info.next;
            displayCharacters(allCharacters);
        }
    } catch (error) {
        console.error("Fel vid hämtning:", error);
        container.innerHTML = "<p>Något gick fel i multiversumet...</p>";
    }
}

// 2. Visa karaktärerna och skapa den personliga beskrivningen
function displayCharacters(characters) {
    const htmlString = characters.map(char => {
        const statusClass = char.status.toLowerCase();
        
        // --- PERSONLIG BESKRIVNINGS-LOGIK ---
        let bio = "";
        const name = char.name;
        const species = char.species === 'unknown' ? 'okänd art' : char.species.toLowerCase();
        const origin = char.origin.name === 'unknown' ? 'en okänd plats' : char.origin.name;

        if (char.status === 'Alive') {
            bio = `Möt ${name}, en ${species} som lyckats överleva multiversumets alla faror! Just nu befinner sig ${name} på ${char.location.name}. Ursprungligen kommer detta ansikte från ${origin}.`;
        } else if (char.status === 'Dead') {
            bio = `Frid över ${name}. Denna ${species} har tyvärr mött sitt öde i en av de många dimensionerna. Innan det tragiska slutet kunde man hitta ${name} på ${origin}.`;
        } else {
            bio = `${name} är ett mysterium! Ingen vet säkert om denna ${species} lever eller är död. Senast siktad vid ${char.location.name}, men ursprunget spåras till ${origin}.`;
        }

        return `
            <div class="card">
                <img src="${char.image}" alt="${char.name}" loading="lazy">
                <div class="card-info">
                    <h3>${char.name}</h3>
                    <div class="status">
                        <span class="status-icon ${statusClass}"></span>
                        ${char.status} - ${char.species}
                    </div>
                    
                    <button class="details-btn" onclick="toggleDetails(this)">Vem är detta?</button>
                    
                    <div class="extra-info">
                        <p>${bio}</p>
                        <hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">
                        <p style="font-size: 0.75rem; color: #97ce4c;">
                            <strong>Dimensionell data:</strong><br>
                            Medverkar i ${char.episode.length} avsnitt.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = htmlString;
}

// 3. Funktion för att öppna/stänga beskrivningen (Viktig!)
function toggleDetails(btn) {
    const infoDiv = btn.nextElementSibling;
    const isShowing = infoDiv.classList.contains('show');
    
    // Stäng alla andra öppna boxar för en snyggare upplevelse
    document.querySelectorAll('.extra-info').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.details-btn').forEach(b => b.innerText = 'Vem är detta?');

    if (!isShowing) {
        infoDiv.classList.add('show');
        btn.innerText = 'Dölj info';
    }
}

// 4. Sökfunktion
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = allCharacters.filter(char => 
        char.name.toLowerCase().includes(value)
    );
    displayCharacters(filtered);
});
// 4. Uppdatera index.html med flytt-logik
            let indexHtml = fs.readFileSync('index.html', 'utf8');
            
            // Hämta ut det som ligger i "Dagens" just nu
            const dailyRegex = /([\s\S]*?)/;
            const currentDaily = indexHtml.match(dailyRegex)[1].trim();

            if (i === 0) { // Bara vid första inlägget för dagen: Flytta gamla till arkivet
                if (currentDaily !== "") {
                    indexHtml = indexHtml.replace('', `\n${currentDaily}`);
                }
                // Rensa dagens-sektionen
                indexHtml = indexHtml.replace(dailyRegex, '\n');
            }

            // Lägg till det nya inlägget i dagens-sektionen
            const newLink = `<p>${date}: <a href="${fileName}" style="color: #97ce4c; text-decoration: none; font-weight: bold;">› Analys: ${char.name}</a></p>`;
            indexHtml = indexHtml.replace('', `\n${newLink}`);

            fs.writeFileSync('index.html', indexHtml);

// Starta programmet
fetchAllCharacters();
