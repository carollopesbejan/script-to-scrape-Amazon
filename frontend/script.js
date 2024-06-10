document.getElementById('scrapeButton').addEventListener('click', function() {
    const keyword = document.getElementById('searchKeyword').value;
    
    if (!keyword) {
        alert('Please enter a search term');
        return;
    }

    // Configuração da requisição AJAX
    fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('results').innerText = 'Erro ao buscar dados. Tente novamente mais tarde.';
        });
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerText = 'Nenhum resultado encontrado.';
        return;
    }

    results.forEach(result => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const title = document.createElement('h2');
        title.innerText = result.title;

        const rating = document.createElement('p');
        rating.innerText = `Rating: ${result.rating} estrelas`;

        const reviews = document.createElement('p');
        reviews.innerText = `Número de reviews: ${result.reviews}`;

        const img = document.createElement('img');
        img.src = result.imageUrl;

        productDiv.appendChild(title);
        productDiv.appendChild(rating);
        productDiv.appendChild(reviews);
        productDiv.appendChild(img);

        resultsDiv.appendChild(productDiv);
    });
}
