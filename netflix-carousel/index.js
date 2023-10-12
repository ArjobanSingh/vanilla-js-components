((parent) => {
  const ITEMS_PER_PAGE = 4;
  const sliderContainer = parent.querySelector(".container");
  const slider = parent.querySelector(".slider");
  const TRANSFORM = "transform 0.5s ease-in-out";

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
  let activePageIndex = 0;
  let direction;

  const DIRECTION = {
    NEXT: "next",
    PREVIOUS: "previous",
  };

  const BUTTON_TYPE = {
    NEXT: "next",
    PREVIOUS: "previous",
  };

  addListeners();

  function goToPreviousPage() {
    const lastPageIdx = NUM_OF_PAGES - 1;
    // like Netflix, on beginning we cannot go previous
    if (isBeginning) return;
    activePageIndex = activePageIndex === 0 ? lastPageIdx : activePageIndex - 1;
    direction = DIRECTION.PREVIOUS;
    moveSlider();
  }

  function goToNextPage() {
    const lastPageIdx = NUM_OF_PAGES - 1;
    activePageIndex = activePageIndex === lastPageIdx ? 0 : activePageIndex + 1;
    direction = DIRECTION.NEXT;
    moveSlider();
  }

  function addListeners() {
    document.addEventListener("keydown", (e) => {
      if (isTransitionInProgress) return;
      switch (e.key) {
        case "ArrowLeft":
          goToPreviousPage();
          break;
        case "ArrowRight":
          goToNextPage();
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

    sliderContainer.addEventListener("click", (e) => {
      const button = e.target.closest(".button-wrapper");
      if (!button) return;
      const buttonType = button.getAttribute("data-type");
      console.log("buttonType: ", buttonType, button);
      buttonType === BUTTON_TYPE.NEXT ? goToNextPage() : goToPreviousPage();
    });
  }

  function createItemsForPage(pageNumber) {
    const fragment = document.createDocumentFragment();
    Array.from({ length: ITEMS_PER_PAGE }, (_, idx) => idx).forEach(
      (_, idx) => {
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

    if (isBeginning) {
      // after first next scroll add previous button
      sliderContainer.prepend(createArrowButton(BUTTON_TYPE.PREVIOUS));
      isBeginning = false;
    }

    slider.style.transition = "none";
    slider.style.transform = `translateX(-100%)`;
  }

  function moveSlider() {
    slider.style.transition = TRANSFORM;
    const translatePercent = isBeginning
      ? -100
      : direction === DIRECTION.NEXT
      ? -200
      : 0;

    slider.style.transform = `translateX(${translatePercent}%)`;
  }

  const svgItems = {
    [BUTTON_TYPE.NEXT]: {
      path_d: "m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1",
    },
    [BUTTON_TYPE.PREVIOUS]: {
      path_d: "M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13",
    },
  };

  function createArrowButton(type) {
    const isNextButton = type === BUTTON_TYPE.NEXT;
    const wrapper = document.createElement("div");
    const svgNS = "http://www.w3.org/2000/svg";

    wrapper.setAttribute("tabindex", 0);
    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("data-type", type);

    wrapper.classList.add("button-wrapper");
    wrapper.classList.add(isNextButton ? "next-button" : "prev-button");

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 8 14");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", svgItems[type].path_d);
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.append(path);
    wrapper.append(svg);
    return wrapper;
  }

  // create 2 pages initially
  const firstPage = createItemsForPage(0);
  const secondPage = createItemsForPage(1);

  slider.append(firstPage, secondPage);
  sliderContainer.append(createArrowButton(BUTTON_TYPE.NEXT));
})(document.body);
