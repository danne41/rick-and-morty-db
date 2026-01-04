const container = document.getElementById('character-container');
const searchInput = document.getElementById('search');
let allCharacters = [];

// Vi definierar funktionen som en asynkron funktion
async function fetchAllCharacters() {
    let url = 'https://rickandmortyapi.com/api/character';
    
    try {
        // Vi tömmer containern och visar ett laddningsmeddelande
        container.innerHTML = '<p>Öppnar portalen till alla dimensioner...</p>';

        while (url) {
            const response = await fetch(url);
            const data = await response.json();
            
            // Lägg till de nya karaktärerna i vår stora lista
            allCharacters = [...allCharacters, ...data.results];
            
            // Uppdatera URL:en till nästa sida
            url = data.info.next;
            
            // Vi ritar ut dem vi har hittills
            displayCharacters(allCharacters);
        }
    } catch (error) {
        console.error("Det blev ett fel:", error);
        container.innerHTML = "<p>Något gick fel i multiversumet... Kontrollera din internetanslutning.</p>";
    }
}

function displayCharacters(characters) {
    // Skapa en lång sträng med HTML för att undvika att skriva till DOM för ofta (snabbare)
    const htmlString = characters.map(char => {
        const statusClass = char.status.toLowerCase();
        return `
            <div class="card">
                <img src="${char.image}" alt="${char.name}" loading="lazy">
                <div class="card-info">
                    <h3>${char.name}</h3>
                    <div class="status">
                        <span class="status-icon ${statusClass}"></span>
                        ${char.status} - ${char.species}
                    </div>
                    <p style="color: #9e9e9e; font-size: 0.8rem; margin-bottom: 4px;">Senast sedd i:</p>
                    <p style="margin-top: 0;">${char.location.name}</p>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = htmlString;
}

// Sökfunktion
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = allCharacters.filter(char => 
        char.name.toLowerCase().includes(value)
    );
    displayCharacters(filtered);
});

// Starta hämtningen - Detta anrop är säkert här
fetchAllCharacters();