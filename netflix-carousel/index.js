((parent) => {
  const ITEMS_PER_PAGE = 4;
  const slider = parent.querySelector(".slider");

  const IMAGES = [
    "./images/vikings.webp",
    "./images/extraction2.jpg",
    "./images/vikings-valhalla.jpg",
    "./images/fallout.webp",
    "./images/peaky-blinders.jpg",
    "./images/friday-night.jpg",
    "./images/friends.webp",
    "./images/ginny.jpg",
    "./images/last-kingdom.jpg",
    "./images/1899.jpg",
    "./images/high-end.webp",
    "./images/rrr.webp",
    "./images/witcher.jpg",
    "./images/sex-education.jpg",
    "./images/too-hot.jpg",
    "./images/tu-jhoothi.webp",
  ];

  const NUM_OF_PAGES = IMAGES.length / ITEMS_PER_PAGE;

  let isBeginning = true;
  let isTransitionInProgress = false;
  let direction;

  const DIRECTION = {
    NEXT: "next",
    PREVIOUS: "previous",
  };

  let activePageIndex = 0;
  addListeners();

  function addListeners() {
    document.addEventListener("keydown", (e) => {
      if (isTransitionInProgress) return;
      switch (e.key) {
        case "ArrowLeft":
          // like Netflix, on beginning we cannot go previous
          if (isBeginning) return;
          if (activePageIndex === 0) activePageIndex = NUM_OF_PAGES - 1;
          else activePageIndex--;
          direction = DIRECTION.PREVIOUS;
          moveSlider();
          break;
        case "ArrowRight":
          if (activePageIndex === NUM_OF_PAGES - 1) activePageIndex = 0;
          else activePageIndex++;
          direction = DIRECTION.NEXT;
          moveSlider();
          break;
        default:
          break;
      }
    });

    slider.addEventListener("transitionstart", () => {
      isTransitionInProgress = true;
    });

    slider.addEventListener("transitionend", () => {
      addItemsAroundCurrentPage();
      isTransitionInProgress = false;
    });
  }

  function createItemsForPage(pageNumber) {
    const fragment = document.createDocumentFragment();
    Array.from({ length: ITEMS_PER_PAGE }, (_, idx) => idx).forEach(
      (it, idx) => {
        const itemIdx = pageNumber * ITEMS_PER_PAGE + idx;
        const oneBasedIdx = itemIdx + 1;

        const sliderItem = document.createElement("li");
        sliderItem.classList.add("slider__item");

        const img = document.createElement("img");
        img.src = IMAGES[itemIdx];
        img.alt = `Carousel item: ${oneBasedIdx}`;

        const indexIndicator = document.createElement("div");
        indexIndicator.classList.add("absolute__item");
        indexIndicator.innerHTML = `Item: ${oneBasedIdx}`;

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

  function addItemsAroundCurrentPage() {
    // when user move forward, remove first 4, and append next 4
    if (direction === DIRECTION.NEXT) {
      const nextPageIdx =
        activePageIndex === NUM_OF_PAGES - 1 ? 0 : activePageIndex + 1;

      const nextItems = createItemsForPage(nextPageIdx);
      if (!isBeginning) removeItemsBetweenIdx(0, ITEMS_PER_PAGE);
      slider.append(nextItems);
    }

    // and vice-versa logic
    if (direction === DIRECTION.PREVIOUS) {
      const previousPageIdx =
        activePageIndex === 0 ? NUM_OF_PAGES - 1 : activePageIndex - 1;
      const previousItems = createItemsForPage(previousPageIdx);

      removeItemsBetweenIdx(ITEMS_PER_PAGE * 2);
      slider.prepend(previousItems);
    }

    if (isBeginning) isBeginning = false;
    slider.style.transition = "none";
    slider.style.transform = `translateX(-100%)`;
  }

  function moveSlider() {
    slider.style.transition = "transform 0.3s ease-in-out";
    const translateVal = isBeginning
      ? -100
      : direction === DIRECTION.NEXT
      ? -200
      : 0;

    slider.style.transform = `translateX(${translateVal}%)`;
  }

  // create 2 pages initially
  const firstPage = createItemsForPage(0);
  const secondPage = createItemsForPage(1);
  slider.append(firstPage, secondPage);
})(document.body);
