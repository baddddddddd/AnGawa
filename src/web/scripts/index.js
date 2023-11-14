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