// ================== API KEY ==================
const API_KEY = "da01d7158a60be461c607c6d31470b4e";
// ============================================

let allMatches = [];

async function loadMatches() {
    document.querySelectorAll('.section').forEach(sec => {
        sec.innerHTML = `<div class="loading">🔄 Loading live matches... Please wait</div>`;
    });

    try {
        const res = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
            headers: { "x-apisports-key": API_KEY }
        });

        if (!res.ok) throw new Error("API Error " + res.status);

        const data = await res.json();
        allMatches = data.response || [];

        console.log("Total Live Matches:", allMatches.length);

        if (allMatches.length === 0) {
            showNoMatches();
        } else {
            renderMatches(allMatches);
        }
    } catch (e) {
        console.error(e);
        document.getElementById("europe").innerHTML = `
            <div class="loading">
                ❌ Cannot connect to API<br>
                <small>Check your internet connection</small>
            </div>`;
    }
}

function renderMatches(matches) {
    let eu = "", af = "", as = "", au = "";

    matches.forEach(m => {
        const elapsed = m.fixture.status.elapsed || 0;
        const html = `
            <div class="match">
                <div class="league">${m.league.name} • ${m.league.country}</div>
                <div class="teams">
                    <span>${m.teams.home.name}</span>
                    <span class="score">${m.goals.home ?? 0} - ${m.goals.away ?? 0}</span>
                    <span>${m.teams.away.name}</span>
                </div>
                <div class="info">
                    <span>⏱ ${elapsed}' • LIVE</span>
                    <span>${m.fixture.status.short}</span>
                </div>
            </div>
        `;

        const country = (m.league.country || "").toLowerCase();
        const league = (m.league.name || "").toLowerCase();

        if (["england","spain","italy","france","germany","portugal","netherlands"].some(c => country.includes(c))) {
            eu += html;
        } else if (["nigeria","egypt","morocco","ghana","south africa","algeria","tunisia","senegal"].some(c => country.includes(c)) || league.includes("africa")) {
            af += html;
        } else if (["japan","china","saudi","korea","india","iran","uae"].some(c => country.includes(c))) {
            as += html;
        } else {
            au += html;
        }
    });

    document.getElementById("europe").innerHTML = eu || `<div class="loading">No live European matches right now</div>`;
    document.getElementById("africa").innerHTML = af || `<div class="loading">No live African matches right now</div>`;
    document.getElementById("asia").innerHTML = as || `<div class="loading">No live Asian matches right now</div>`;
    document.getElementById("aus").innerHTML = au || `<div class="loading">No other live matches right now</div>`;
}

function showNoMatches() {
    const msg = `<div class="loading">No live matches at the moment.<br>Come back later!</div>`;
    document.querySelectorAll('.section').forEach(sec => sec.innerHTML = msg);
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.nav button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${id}'`));
    });
}

// Start the app
loadMatches();
setInterval(loadMatches, 60000);   // Refresh every 60 seconds
