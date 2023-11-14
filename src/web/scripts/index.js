const toggleButton = document.getElementById('toggleButton');
const dropdown = document.querySelector('.dropdown'); // Changed to select by class

toggleButton.addEventListener('click', () => {
  toggleButton.innerHTML = toggleButton.innerHTML === '<i class="fas fa-bars"></i>' ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  updateDropdownDisplay();
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 600) {
    hideDropdown();
  }
});

function updateDropdownDisplay() {
  if (window.innerWidth < 600) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }
}

function hideDropdown() {
  dropdown.style.display = 'none';
  toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
}

const imageCarousel = document.getElementById('image-carousel');
const imageDescriptions = document.querySelectorAll('.image-description');

let currentIndex = 0;
let slideshowTimeout;

function showImage(index) {
  const images = imageCarousel.querySelectorAll('img');
  const descriptions = Array.from(imageDescriptions);

  images.forEach(img => img.style.display = 'none');
  descriptions.forEach(desc => desc.style.display = 'none');

  images[index].style.display = 'block';
  descriptions[index].style.display = 'block';
}

function nextImage() {
  currentIndex = (currentIndex + 1) % imageDescriptions.length;
  showImage(currentIndex);
  startSlideshowTimer();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imageDescriptions.length) % imageDescriptions.length;
  showImage(currentIndex);
  startSlideshowTimer();
}

function startSlideshowTimer() {
  clearTimeout(slideshowTimeout);
  slideshowTimeout = setTimeout(nextImage, 3000);
}

showImage(currentIndex);
startSlideshowTimer();
