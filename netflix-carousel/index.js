((parent) => {
  const ITEMS_PER_PAGE = 4;
  const NUM_OF_PAGES = 4;
  let isBeginning = true;
  let slider = parent.querySelector(".slider");
  const DIRECTION = {
    NEXT: "next",
    PREVIOUS: "previous",
  };

  // although for perfect carousel, every page should be full
  let activePageIndex = 0;
  addListeners();

  function addListeners() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          // like Netflix, on beginning we cannot go previous
          if (isBeginning) return;
          if (activePageIndex === 0) activePageIndex = NUM_OF_PAGES - 1;
          else activePageIndex--;
          moveSlider(DIRECTION.PREVIOUS);
          break;
        case "ArrowRight":
          if (activePageIndex === NUM_OF_PAGES - 1) activePageIndex = 0;
          else activePageIndex++;
          moveSlider(DIRECTION.NEXT);
          break;
        default:
          break;
      }
    });
  }

  function createItemsForPage(pageNumber) {
    const fragment = document.createDocumentFragment();
    Array.from({ length: ITEMS_PER_PAGE }, (_, idx) => idx).forEach(
      (it, idx) => {
        const itemIdx = pageNumber * ITEMS_PER_PAGE + idx + 1;
        const sliderItem = document.createElement("li");
        sliderItem.classList.add("slider__item");

        const img = document.createElement("img");
        img.src = "https://placehold.co/400x300";
        img.alt = `Carousel item: ${itemIdx}`;

        const indexIndicator = document.createElement("div");
        indexIndicator.classList.add("absolute__item");
        indexIndicator.textContent = `Item ${itemIdx}`;

        sliderItem.append(img, indexIndicator);
        fragment.append(sliderItem);
      }
    );
    return fragment;
  }

  // TODO: find a better performed and batched replacing logic
  function removeItemsBetweenIdx(startIndex, endIndex) {
    [...slider.children]
      .slice(startIndex, endIndex)
      .forEach((element) => element.parentElement.removeChild(element));
  }

  function getTranslateXValue(element) {
    const style = getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    console.log("translateX: ", matrix.m41);
  }

  function moveSlider(direction) {
    slider.style.transition = "transform 0.3s ease-in-out";
    const translateVal = isBeginning
      ? -100
      : direction === DIRECTION.NEXT
      ? -200
      : 0;

    slider.style.transform = `translateX(${translateVal}%)`;
    getTranslateXValue(slider);

    const nextPageIdx =
      activePageIndex === NUM_OF_PAGES - 1 ? 0 : activePageIndex + 1; // 3
    const previousPageIdx =
      activePageIndex === 0 ? NUM_OF_PAGES - 1 : activePageIndex - 1; // 1

    // TODO: manage with transitionEnd event instead of setTimeout
    setTimeout(() => {
      const previousItems = createItemsForPage(previousPageIdx);
      const nextItems = createItemsForPage(nextPageIdx);

      // when user move forward, remove first 4, and append next 4
      if (direction === DIRECTION.NEXT) {
        if (!isBeginning) removeItemsBetweenIdx(0, ITEMS_PER_PAGE);
        slider.append(nextItems);
      }

      // and vice-versa logic
      if (direction === DIRECTION.PREVIOUS) {
        removeItemsBetweenIdx(ITEMS_PER_PAGE * 2);
        slider.prepend(previousItems);
      }

      if (isBeginning) isBeginning = false;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-100%)`;
    }, 300);
  }
})(document.body);
