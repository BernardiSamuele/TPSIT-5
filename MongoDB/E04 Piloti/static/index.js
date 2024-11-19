'use strict';

const optContainers = document.querySelectorAll('.optContainer');
const detailsContainer = document.querySelector('.detailsContainer');
detailsContainer.style.display = 'none';

const request = await inviaRichiesta('GET', '/api/piloti');
try {
	
} catch (data) {
	
}