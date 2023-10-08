(() => {
  const carousel = document.querySelector(".carousel");
  const slider = carousel.querySelector(".carousel__slider");
  const carouselItems = carousel.querySelectorAll(".carousel__item");

  const carouselWidth = carousel.clientWidth;
  const itemsSize = carouselItems.length;
  const actualItemsSize = itemsSize - 2; // 2 are cloned
  const transition = "transform 0.5s ease-in-out";

  let activeIndex = 1;

  function showSlide() {
    slider.style.transform = `translateX(-${activeIndex * carouselWidth}px)`;
  }

  function setTransition() {
    slider.style.transition = transition;
  }

  function prevSlide() {
    if (actualItemsSize === 1) return;
    // Easier way to handle race condition, to do normal scroll instead of cyclic for that instance
    if (activeIndex === 0) activeIndex = actualItemsSize - 1;
    else activeIndex--;

    setTransition();
    showSlide();
  }

  function nextSlide() {
    if (actualItemsSize === 1) return;
    if (activeIndex === itemsSize - 1) activeIndex = 2;
    else activeIndex++;

    setTransition();
    showSlide();
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        prevSlide();
        break;
      case "ArrowRight":
        nextSlide();
        break;
      default:
        break;
    }
  });

  document.addEventListener("transitionend", () => {
    console.log("transition end: ", activeIndex);
    switch (activeIndex) {
      case 0:
        slider.style.transition = "none";
        activeIndex = itemsSize - 2; // go to last 2nd index
        showSlide();
        break;
      case itemsSize - 1:
        slider.style.transition = "none";
        activeIndex = 1;
        showSlide();
        break;
      default:
        break;
    }
  });
  showSlide();
})();
