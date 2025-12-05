let analysisResult = null;

        const followersInput = document.getElementById('followers-file');
        const followingInput = document.getElementById('following-file');
        const analyzeBtn = document.getElementById('analyze-btn');
        const downloadBtn = document.getElementById('download-btn');
        const resetBtn = document.getElementById('reset-btn');
        const resultsDiv = document.getElementById('results');
        const errorContainer = document.getElementById('error-container');

        analyzeBtn.addEventListener('click', analyzeData);
        downloadBtn.addEventListener('click', downloadJSON);
        resetBtn.addEventListener('click', resetApp);

        function analyzeData() {
            errorContainer.innerHTML = '';

            const followersFile = followersInput.files[0];
            const followingFile = followingInput.files[0];

            if (!followersFile || !followingFile) {
                showError('Por favor carga ambos archivos JSON');
                return;
            }

            Promise.all([
                readFile(followersFile),
                readFile(followingFile)
            ]).then(([followersData, followingData]) => {
                try {
                    const followers = JSON.parse(followersData);
                    const following = JSON.parse(followingData).relationships_following;

                    // Extract followers usernames
                    const followersUsernames = [];
                    for (const item of followers) {
                        if (item.string_list_data && item.string_list_data.length > 0) {
                            followersUsernames.push(item.string_list_data[0].value);
                        }
                    }

                    // Extract following usernames
                    const followingUsernames = following.map(item => item.title);

                    // Find who doesn't follow back and classify them
                    const noMeSiguen = [];
                    const noEncontrados = [];

                    followingUsernames.forEach(user => {
                        // Verificar si el usuario tiene datos válidos en followers
                        const hasValidFollowerData = followersUsernames.some(follower => 
                            follower && follower.trim() !== '' && follower.toLowerCase() === user.toLowerCase()
                        );

                        if (!hasValidFollowerData) {
                            // Si no existe en followers, clasificar como "no encontrado" (amarillo)
                            noEncontrados.push(user);
                        } else {
                            // Si existe en followers, está en la lista de seguidos
                            noMeSiguen.push(user);
                        }
                    });

                    analysisResult = {
                        no_me_siguen: noMeSiguen,
                        no_encontrados: noEncontrados,
                        total: noMeSiguen.length,
                        total_no_encontrados: noEncontrados.length
                    };

                    displayResults(noMeSiguen, noEncontrados);
                    downloadBtn.disabled = false;

                    const message = noMeSiguen.length > 0 
                        ? `Análisis completado: ${noMeSiguen.length} personas no te siguen de vuelta${noEncontrados.length > 0 ? ` y ${noEncontrados.length} no encontrado(s)` : ''}`
                        : `Análisis completado: ${noEncontrados.length} usuario(s) no encontrado(s)`;
                    showSuccess(message);
                } catch (error) {
                    showError('Error al procesar los archivos: ' + error.message);
                }
            }).catch(error => {
                showError('Error al leer los archivos: ' + error.message);
            });
        }

        function readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(new Error('No se pudo leer el archivo'));
                reader.readAsText(file);
            });
        }

        function displayResults(noMeSiguen = [], noEncontrados = []) {
            const totalCount = noMeSiguen.length;
            document.getElementById('total-count').textContent = totalCount;

            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';

            // Mostrar usuarios que no te siguen (rojo)
            noMeSiguen.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'user-item';
                
                const userCell = document.createElement('td');
                userCell.textContent = user;
                userCell.style.padding = '12px 16px';
                
                const statusCell = document.createElement('td');
                statusCell.style.padding = '12px 16px';
                const badge = document.createElement('span');
                badge.className = 'status-badge status-not-following';
                badge.textContent = 'No te sigue';
                statusCell.appendChild(badge);
                
                row.appendChild(userCell);
                row.appendChild(statusCell);
                usersList.appendChild(row);
            });

            // Mostrar usuarios no encontrados (amarillo)
            noEncontrados.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'user-item';
                
                const userCell = document.createElement('td');
                userCell.textContent = user;
                userCell.style.padding = '12px 16px';
                
                const statusCell = document.createElement('td');
                statusCell.style.padding = '12px 16px';
                const badge = document.createElement('span');
                badge.className = 'status-badge status-not-found';
                badge.textContent = 'No encontrado';
                statusCell.appendChild(badge);
                
                row.appendChild(userCell);
                row.appendChild(statusCell);
                usersList.appendChild(row);
            });

            resultsDiv.classList.add('active');
        }

        function downloadJSON() {
            if (!analysisResult) return;

            const jsonString = JSON.stringify(analysisResult, null, 4);
            const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'no_me_siguen.json';
            link.click();
        }

        function resetApp() {
            followersInput.value = '';
            followingInput.value = '';
            resultsDiv.classList.remove('active');
            downloadBtn.disabled = true;
            errorContainer.innerHTML = '';
            analysisResult = null;
        }

        function showError(message) {
            errorContainer.innerHTML = `<div class="error">${message}</div>`;
        }

        function showSuccess(message) {
            errorContainer.innerHTML = `<div class="success">${message}</div>`;
        }