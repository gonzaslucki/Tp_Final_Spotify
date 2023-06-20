// var images = [
//   "./img/nico_cassetes.png",
//   "./img/gonza_cassetes.png",
//   "./img/flor_cassetes.png",
// ];
// var index = 0;

// document.getElementById("prevButton").addEventListener("click", function () {
//   index = (index + images.length - 1) % images.length; // go to previous image
//   document.getElementById("carouselImage").src = images[index];
// });

// document.getElementById("nextButton").addEventListener("click", function () {
//   index = (index + 1) % images.length; // go to next image
//   document.getElementById("carouselImage").src = images[index];
// });

let index = 0;
const totalImages = 3;

document.getElementById("prevButton").addEventListener("click", function () {
  index = (index - 1 + totalImages) % totalImages;
  document.querySelector(".carousel-images").style.transform = `translateX(${
    -index * 1200
  }px)`;
});

document.getElementById("nextButton").addEventListener("click", function () {
  index = (index + 1) % totalImages;
  document.querySelector(".carousel-images").style.transform = `translateX(${
    -index * 1200
  }px)`;
});
