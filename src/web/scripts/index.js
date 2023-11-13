document.addEventListener('DOMContentLoaded', function () {
    var getStartedButton = document.getElementById('getStartedButton');
  
    getStartedButton.addEventListener('mouseover', function () {
      getStartedButton.classList.add('hoverEffect');
    });
  
    getStartedButton.addEventListener('mouseout', function () {
      getStartedButton.classList.remove('hoverEffect');
    });
  
    getStartedButton.addEventListener('mousedown', function () {
      getStartedButton.classList.add('clickEffect');
    });
  
    getStartedButton.addEventListener('mouseup', function () {
      getStartedButton.classList.remove('clickEffect');
    });


  });

document.addEventListener('DOMContentLoaded', function () {
  var getStartedButtonOutline = document.getElementById('getStartedButtonOutline');

  getStartedButtonOutline.addEventListener('mouseover', function () {
    getStartedButtonOutline.classList.add('hoverEffect');
  });

  getStartedButtonOutline.addEventListener('mouseout', function () {
    getStartedButtonOutline.classList.remove('hoverEffect');
  });

  getStartedButtonOutline.addEventListener('mousedown', function () {
    getStartedButtonOutline.classList.add('clickEffect');
  });

  getStartedButtonOutline.addEventListener('mouseup', function () {
    getStartedButtonOutline.classList.remove('clickEffect');
  });


});

const imageCarousel = document.getElementById('image-carousel');
const imageDescriptions = document.querySelectorAll('.image-description');

let currentIndex = 0;

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
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imageDescriptions.length) % imageDescriptions.length;
  showImage(currentIndex);
}

showImage(currentIndex);

  