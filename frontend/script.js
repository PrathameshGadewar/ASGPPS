

// Global variables for charts
let salaryChart, radarChart, marketChart;
let lastPrediction = {};

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Main prediction function
async function predict() {
    const cgpa = document.getElementById('cgpa').value || 8.2;
    const skills = document.getElementById('skills').value || 8;
    const experience = document.getElementById('experience').value || 1.5;

    showLoading();

    try {
        const url = `http://127.0.0.1:8000/predict?cgpa=${cgpa}&skills=${skills}&has_ml=1&has_dsa=1&has_projects=1&experience=${experience}&certs=1&internships=1&comm=75&aptitude=80`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        lastPrediction = data;

        // Update UI with extended data
        updateDashboard(data, { cgpa, skills, experience });
    } catch (error) {
        console.error(error);
        alert('Prediction failed. Check console.');
    } finally {
        hideLoading();
    }
}

// Resume upload
async function uploadResume() {
    const fileInput = document.getElementById('resumeFile');
    if (!fileInput.files[0]) {
        alert('Please select a file');
        return;
    }
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    showLoading();
    try {
        const response = await fetch('http://127.0.0.1:8000/upload_resume', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        lastPrediction = data;
        // We don't have input fields values, use defaults
        updateDashboard(data, { cgpa: 8.2, skills: 8, experience: 1.5 });
    } catch (error) {
        console.error(error);
        alert('Upload failed.');
    } finally {
        hideLoading();
    }
}

// Main UI update
function updateDashboard(pred, inputs) {
    const { sector, salary, product_probability, cluster } = pred;

    // ---- Top metrics ----
    // Placement probability
    let placementProb = Math.min(95, 70 + cluster * 5 + product_probability / 5);
    document.getElementById('placementProb').innerText = Math.round(placementProb) + '%';
    document.getElementById('probTrend').innerText = cluster === 2 ? '↑ 8% from last month' : '↑ 5% from last month';

    // Estimated package
    document.getElementById('estimatedPackage').innerText = salary + ' LPA';
    let low = (salary * 0.9).toFixed(1);
    let high = (salary * 1.1).toFixed(1);
    document.getElementById('packageRange').innerText = `Range: ${low} - ${high} LPA`;

    // Skill match
    let skillMatchBase = [65, 80, 92];
    let skillMatch = skillMatchBase[cluster] + Math.floor(Math.random() * 5);
    document.getElementById('skillMatch').innerText = skillMatch + '/100';
    let levelNames = ['Beginner', 'Intermediate', 'Advanced'];
    document.getElementById('skillLevel').innerText = `Level: ${levelNames[cluster]} Cluster`;

    // Target role & sector
    let roleMap = {
        'Product': 'ML Engineer',
        'Service': 'System Engineer',
        'Government': 'Scientist B',
        'Startup': 'Full Stack Developer'
    };
    document.getElementById('targetRole').innerText = roleMap[sector] || 'Engineer';
    document.getElementById('targetSector').innerText = `Sector: ${sector} Based`;

    // ---- Sector Eligibility Bars ----
    // Generate probabilities for all sectors based on prediction
    let sectorProbs = generateSectorProbs(sector, cluster, product_probability);
    renderSectorBars(sectorProbs);

    // ---- Salary Benchmark Chart ----
    renderSalaryChart(salary);

    // ---- Radar Chart ----
    renderRadarChart(cluster);

    // ---- Company Cards & Skill Gaps ----
    let companies = generateCompanyData(sector, cluster);
    renderCompanyCards(companies);
    if (sector === 'Government' || companies.find(c => c.name === 'ISRO / DRDO')) {
        document.getElementById('skillGaps').style.display = 'block';
        document.getElementById('gapsList').innerHTML = `
            <li>🔬 Advanced Mathematics</li>
            <li>📘 GATE Qualification</li>
        `;
    } else {
        document.getElementById('skillGaps').style.display = 'none';
    }

    // ---- Roadmap ----
    renderRoadmap(cluster);

    // ---- Government Exams ----
    renderGovExams(sector);

    // ---- Market Projection ----
    renderMarketChart(sector);
}

// Helper: generate sector probabilities
function generateSectorProbs(predSector, cluster, productProb) {
    let probs = {
        'Product': 0,
        'Service': 0,
        'Startup': 0,
        'Government': 0
    };
    // Base values depending on predicted sector
    if (predSector === 'Product') {
        probs.Product = Math.min(95, productProb + 10);
        probs.Service = 50 + cluster * 8;
        probs.Startup = 40 + cluster * 7;
        probs.Government = 30 + cluster * 5;
    } else if (predSector === 'Service') {
        probs.Product = 60 + cluster * 3;
        probs.Service = Math.min(95, 80 + cluster * 5);
        probs.Startup = 50 + cluster * 5;
        probs.Government = 40 + cluster * 3;
    } else if (predSector === 'Government') {
        probs.Product = 40 + cluster * 3;
        probs.Service = 50 + cluster * 4;
        probs.Startup = 30 + cluster * 2;
        probs.Government = Math.min(95, 70 + cluster * 8);
    } else if (predSector === 'Startup') {
        probs.Product = 65 + cluster * 5;
        probs.Service = 55 + cluster * 4;
        probs.Startup = Math.min(95, 75 + cluster * 7);
        probs.Government = 25 + cluster * 3;
    }
    // Ensure within 0-100
    for (let k in probs) probs[k] = Math.min(100, Math.max(10, Math.round(probs[k])));
    return probs;
}

function renderSectorBars(probs) {
    const container = document.getElementById('sectorBars');
    let html = '';
    for (let [sector, percent] of Object.entries(probs)) {
        html += `
            <div class="sector-item">
                <div class="sector-info">
                    <span class="sector-name">${sector}</span>
                    <span class="sector-percent">${percent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function renderSalaryChart(salary) {
    const ctx = document.getElementById('salaryBenchmarkChart').getContext('2d');
    if (salaryChart) salaryChart.destroy();
    salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Avg Student', 'You', 'Industry Avg'],
            datasets: [{
                label: 'LPA',
                data: [6.8, salary, 8.2],
                backgroundColor: ['#4c566a', '#88c0d0', '#b48ead']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 15 } }
        }
    });
    // Insight
    let topPercent = salary > 9.5 ? 'top 15%' : salary > 7.5 ? 'top 35%' : 'average';
    document.getElementById('salaryInsight').innerText = `Your profile ranks in the ${topPercent} of applicants.`;
}

function renderRadarChart(cluster) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    // Skill values based on cluster
    let values = [
        5 + cluster * 1.5,  // AI/ML
        4 + cluster * 1.2,  // DSA
        3 + cluster * 1,    // Cloud
        4 + cluster * 1,    // Web
        3 + cluster * 1.3   // Database
    ];
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['AI/ML', 'DSA', 'Cloud', 'Web', 'Database'],
            datasets: [{
                label: 'Skill Strength',
                data: values,
                backgroundColor: 'rgba(136, 192, 208, 0.2)',
                borderColor: '#88c0d0',
                pointBackgroundColor: '#88c0d0',
                borderWidth: 2
            }]
        },
        options: {
            scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } }
        }
    });
}

function generateCompanyData(sector, cluster) {
    let companies = [];
    if (sector === 'Product') {
        companies = [
            { name: 'Amazon', type: 'Product Based', role: 'SDE I', prob: 82 + cluster * 3 },
            { name: 'Google', type: 'Product Based', role: 'Software Engineer', prob: 70 + cluster * 5 },
            { name: 'Microsoft', type: 'Product Based', role: 'ML Engineer', prob: 75 + cluster * 4 }
        ];
    } else if (sector === 'Service') {
        companies = [
            { name: 'TCS Digital', type: 'Service Based', role: 'System Engineer', prob: 90 + cluster * 3 },
            { name: 'Infosys', type: 'Service Based', role: 'Technology Analyst', prob: 85 + cluster * 4 },
            { name: 'Wipro', type: 'Service Based', role: 'Project Engineer', prob: 80 + cluster * 3 }
        ];
    } else if (sector === 'Government') {
        companies = [
            { name: 'ISRO / DRDO', type: 'Govt R&D', role: 'Scientist B', prob: 50 + cluster * 5 },
            { name: 'BARC', type: 'Govt R&D', role: 'Scientific Officer', prob: 45 + cluster * 4 },
            { name: 'NIC', type: 'Govt', role: 'Scientist', prob: 55 + cluster * 4 }
        ];
    } else {
        companies = [
            { name: 'Flipkart', type: 'Startup', role: 'SDE II', prob: 70 + cluster * 6 },
            { name: 'Ola', type: 'Startup', role: 'Backend Engineer', prob: 65 + cluster * 5 },
            { name: 'Paytm', type: 'Startup', role: 'Software Developer', prob: 68 + cluster * 5 }
        ];
    }
    return companies.map(c => ({ ...c, prob: Math.min(98, c.prob) }));
}

function renderCompanyCards(companies) {
    const container = document.getElementById('companyCards');
    let html = '';
    companies.forEach(c => {
        html += `
            <div class="company-card">
                <h3>${c.name}</h3>
                <div class="company-type">${c.type}</div>
                <div class="role">${c.role}</div>
                <div class="probability">
                    <div class="prob-bar"><div class="prob-fill" style="width: ${c.prob}%;"></div></div>
                    <span class="prob-text">${c.prob}%</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderRoadmap(cluster) {
    const roadmapDiv = document.getElementById('roadmap');
    let months = [];
    if (cluster === 0) { // Beginner
        months = [
            'DSA Foundations: Arrays, Strings, HashMaps',
            'Advanced DSA: Trees, Graphs, DP',
            'ML Basics: Regression, Scikit-learn',
            'Project Development: End-to-end ML',
            'System Design: HL/LD basics',
            'Mock Interviews & Resume Polish'
        ];
    } else if (cluster === 1) { // Intermediate
        months = [
            'Advanced DSA + LeetCode contests',
            'ML Algorithms & Kaggle',
            'Full-stack project with deployment',
            'System Design deep dive',
            'Scalability & Docker',
            'Mock system design & negotiations'
        ];
    } else { // Advanced
        months = [
            'System Design & Architecture',
            'Microservices & Cloud',
            'Leadership & Tech talks',
            'Mentoring & Open Source',
            'Interview prep for Staff/Lead',
            'Negotiation & Career strategy'
        ];
    }
    let html = '';
    months.forEach((desc, i) => {
        html += `
            <div class="roadmap-month">
                <div class="month">Month ${i+1}</div>
                <div class="desc">${desc}</div>
            </div>
        `;
    });
    roadmapDiv.innerHTML = html;
}

function renderGovExams(sector) {
    const container = document.getElementById('examCards');
    let exams = [];
    if (sector === 'Government' || sector === 'Product' || sector === 'Service') {
        exams = [
            { name: 'ISRO ICRB', dept: 'Scientist / Engineer SC', link: 'https://isro.gov.in' },
            { name: 'NIC Scientist-B', dept: 'National Informatics Centre', link: 'https://nic.in' },
            { name: 'GATE for PSUs', dept: 'Various PSUs', link: 'https://gate.iitk.ac.in' }
        ];
    } else {
        exams = [
            { name: 'GATE', dept: 'Higher Studies / PSU', link: 'https://gate.iitk.ac.in' },
            { name: 'DRDO', dept: 'Scientist Entry', link: 'https://drdo.gov.in' }
        ];
    }
    let html = '';
    exams.forEach(e => {
        html += `
            <div class="exam-card">
                <h4>${e.name}</h4>
                <p>${e.dept}</p>
                <a href="${e.link}" target="_blank">Official →</a>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderMarketChart(sector) {
    const ctx = document.getElementById('marketChart').getContext('2d');
    if (marketChart) marketChart.destroy();

    let growth = [12, 14, 18, 22, 25]; // default
    if (sector === 'Product') growth = [14, 18, 22, 26, 30];
    else if (sector === 'Service') growth = [8, 9, 11, 12, 13];
    else if (sector === 'Government') growth = [5, 5.5, 6, 6.5, 7];
    else if (sector === 'Startup') growth = [16, 20, 25, 30, 35];

    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2025', '2026', '2027', '2028', '2029'],
            datasets: [{
                label: 'Avg Package (LPA)',
                data: growth,
                borderColor: '#a3be8c',
                backgroundColor: 'rgba(163, 190, 140, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#e5e9f0' } } },
            scales: { y: { ticks: { color: '#e5e9f0' } }, x: { ticks: { color: '#e5e9f0' } } }
        }
    });

    let annualGrowth = ((growth[2] - growth[0]) / growth[0] * 100 / 2).toFixed(0);
    document.getElementById('growthBadge').innerHTML = `+${annualGrowth}% Predicted Annual Growth`;
}

// PDF download (simplified, includes only text and basic charts)
async function downloadPDF() {
    if (!lastPrediction.sector) {
        alert('Run a prediction first');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('ASGPPS Placement Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Sector: ${lastPrediction.sector}`, 20, 40);
    doc.text(`Salary: ${lastPrediction.salary} LPA`, 20, 50);
    doc.text(`Product Probability: ${lastPrediction.product_probability}%`, 20, 60);
    doc.text(`Cluster: ${lastPrediction.cluster}`, 20, 70);

    // Try to capture charts (simple version)
    const salaryCanvas = document.getElementById('salaryBenchmarkChart');
    try {
        const salaryImg = await html2canvas(salaryCanvas);
        doc.addImage(salaryImg.toDataURL('image/png'), 'PNG', 20, 80, 80, 60);
    } catch (e) { /* ignore */ }

    doc.save('ASGPPS_Report.pdf');
}

// Load default prediction on page load
window.onload = () => {
    predict();
};