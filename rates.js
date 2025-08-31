const bonosData = [
    { usd:10,bonoVes:200},
    { usd: 25,bonoVES: 500 },
    { usd: 50, bonoVES: 1000 },
    { usd: 100, bonoVES: 1500 },
    { usd: 150, bonoVES: 2000 },
    { usd: 200, bonoVES: 2500 },
    { usd: 250, bonoVES: 3000 },
    { usd: 300, bonoVES: 3500 },
    { usd: 450, bonoVES: 4000 },
    { usd: 500, bonoVES: 5000 }
];

async function fetchRates() {
    
    try {
        const res = await fetch("https://openexchangerates.org/api/latest.json?app_id=8a2620eb6e304a559a3656342ae3b77b&base=USD&symbols=COP,VES");
        const data = await res.json();
        return data.rates; // { VES: valor, COP: valor }
    } catch (error) {
        console.error("Error obteniendo tasas:", error);
        return null;
    }
}

async function renderTable() {
    const rates = await fetchRates();
    if (!rates) return;

    const tbody = document.querySelector("#bonosTable tbody");
    tbody.innerHTML = "";

    bonosData.forEach(item => {
        const equivCOP = (item.usd * rates.COP).toLocaleString("es-CO", { style: "currency", currency: "COP" });
        const row = `
            <tr>
                <td>${item.usd} USD</td>
                <td>${equivCOP}</td>
                <td>${item.bonoVES} Bs</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function shareScreenshot() {
    const tableElement = document.getElementById("tabla-container");

    html2canvas(tableElement).then(async canvas => {
        canvas.toBlob(async blob => {
            const file = new File([blob], "tabla_bonos.png", { type: "image/png" });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: "Bonos por Cambio de Divisas",
                        text: "Aquí tienes la tabla actualizada de bonos y equivalencias.",
                        files: [file]
                    });
                    console.log("Compartido exitosamente");
                } catch (error) {
                    console.error("Error al compartir:", error);
                }
            } else {
                // Si el navegador no soporta compartir, descargar la imagen
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "tabla_bonos.png";
                link.click();
                alert("Tu navegador no soporta compartir directo. La imagen se descargó.");
            }
        });
    });
}

document.getElementById("shareBtn").addEventListener("click", shareScreenshot);

renderTable();
