// InmoDescribe - AI Generator (Producción Segura)
const HISTORY_KEY = 'InmoDescribe_history';

// API Backend en Render
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://saas-backend-wc0y.onrender.com';

// Get generation history
function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

// Save to history
function saveToHistory(data) {
    const history = getHistory();
    history.unshift({
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
    });
    // Keep last 50 entries
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

// Render history
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: var(--neutral-500); text-align: center;">No tienes generaciones aún</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="showHistoryItem('${item.id}')">
            <div class="history-item-header">
                <span class="history-item-type">${item.propertyType} en ${item.location}</span>
                <span class="history-item-date">${new Date(item.createdAt).toLocaleDateString('es-CL')}</span>
            </div>
            <p class="history-item-preview">${item.description.substring(0, 100)}...</p>
        </div>
    `).join('');
}

function showHistoryItem(id) {
    const history = getHistory();
    const item = history.find(h => h.id === parseInt(id));
    if (item) {
        document.getElementById('resultDescription').innerHTML = `<p>${item.description}</p>`;
        document.querySelector('.sidebar-nav a[data-page="generator"]').click();
    }
}

// Generate description via Backend API (SEGURO)
async function generateDescription(propertyData) {
    const response = await fetch(`${API_URL}/api/InmoDescribe/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar la descripción');
    }

    const data = await response.json();
    return data.description;
}

// Demo generation (for landing page without API)
function generateDemoDescription(propertyData) {
    const { propertyType, rooms, bathrooms, location, features } = propertyData;

    const descriptions = [
        `🏡 ¡Espectacular ${propertyType} en ${location}! Esta propiedad cuenta con ${rooms || 'amplias'} habitaciones y ${bathrooms || 'modernos'} baños que te encantarán desde el primer momento.\n\n✨ Características destacadas: ${features || 'Excelente ubicación, luminosidad natural, espacios amplios'}.\n\nUbicada en una de las zonas más cotizadas, esta propiedad ofrece todo lo que necesitas para vivir cómodamente. ¡No dejes pasar esta oportunidad única!\n\n📞 Contáctanos hoy mismo para agendar tu visita.`,

        `✨ ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} de ensueño en ${location}\n\nEste increíble espacio de ${rooms || 'múltiples'} dormitorios y ${bathrooms || 'elegantes'} baños ha sido diseñado pensando en tu comodidad y bienestar.\n\n🌟 Lo que hace única esta propiedad:\n${features || '• Terminaciones de primera\n• Excelente conectividad\n• Áreas verdes cercanas'}\n\n¡Una inversión inteligente en una ubicación privilegiada! 📍`
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Initialize generator form
function initGenerator() {
    const form = document.getElementById('generatorForm');
    const generateBtn = document.getElementById('generateBtn');
    const resultDescription = document.getElementById('resultDescription');
    const copyBtn = document.getElementById('copyBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = getCurrentUser();
        if (user && user.credits <= 0) {
            showToast('No tienes créditos disponibles. Actualiza tu plan.', 'error');
            return;
        }

        const propertyData = {
            propertyType: document.getElementById('propertyType').value,
            rooms: document.getElementById('rooms').value,
            bathrooms: document.getElementById('bathrooms').value,
            size: document.getElementById('size').value,
            location: document.getElementById('location').value,
            features: document.getElementById('features').value,
            style: document.getElementById('style').value
        };

        // UI loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="spinner"></div> Generando con IA...';
        resultDescription.innerHTML = '<p class="placeholder-text">Generando descripción profesional...</p>';

        try {
            let description;

            // Try backend first, fallback to demo
            try {
                description = await generateDescription(propertyData);
            } catch (apiError) {
                console.warn('Backend no disponible, usando demo:', apiError.message);
                await new Promise(r => setTimeout(r, 1500));
                description = generateDemoDescription(propertyData);
            }

            // Display result
            resultDescription.innerHTML = `<p>${description.replace(/\n/g, '<br>')}</p>`;
            if (copyBtn) copyBtn.style.display = 'flex';

            // Update credits
            if (user) {
                updateCredits(user.credits - 1);
                document.getElementById('creditsCount').textContent = user.credits - 1;
                document.getElementById('creditsDisplay').textContent =
                    `${user.credits - 1} crédito${user.credits - 1 !== 1 ? 's' : ''} restante${user.credits - 1 !== 1 ? 's' : ''}`;

                const totalGen = document.getElementById('totalGenerations');
                if (totalGen) totalGen.textContent = parseInt(totalGen.textContent) + 1;
            }

            // Save to history
            saveToHistory({ ...propertyData, description });
            showToast('¡Descripción generada exitosamente!');

        } catch (error) {
            resultDescription.innerHTML = `<p style="color: var(--error);">Error: ${error.message}</p>`;
            showToast(error.message, 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span>Generar Descripción</span>
            `;
        }
    });

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = resultDescription.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast('¡Copiado al portapapeles!');
            });
        });
    }
}

// Demo on landing page
function initDemoSection() {
    const demoBtn = document.getElementById('demoGenerateBtn');
    const demoResult = document.getElementById('demoResult');

    if (!demoBtn) return;

    demoBtn.addEventListener('click', async () => {
        const propertyData = {
            propertyType: document.getElementById('demoPropertyType')?.value || 'departamento',
            rooms: document.getElementById('demoRooms')?.value || '3',
            location: document.getElementById('demoLocation')?.value || 'Providencia',
            features: 'Amplio living, cocina equipada, estacionamiento'
        };

        demoBtn.disabled = true;
        demoBtn.innerHTML = '<div class="spinner"></div> Generando...';
        demoResult.innerHTML = '<p class="placeholder-text">Generando descripción con IA...</p>';

        await new Promise(r => setTimeout(r, 2000));

        const description = generateDemoDescription(propertyData);
        demoResult.innerHTML = `<p>${description.replace(/\n/g, '<br>')}</p>`;

        demoBtn.disabled = false;
        demoBtn.innerHTML = `
            <span>Generar Descripción</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGenerator();
    initDemoSection();
});
