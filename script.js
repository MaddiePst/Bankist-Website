'use strict';

///////////////////////////////////////
// Selecting Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const h1 = document.querySelector('h1');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click',function(e){
  // Get the coordinates of the element that we want to scroll to
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  // Get the coordinates of the clicked button (btnScrollTo)
  console.log(e.target.getBoundingClientRect());
    
  console.log('Current scroll position (X/Y)', window.pageXOffset,window.pageYOffset);
  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
  // Scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
    //  Old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //  Only works in modern browsers (new way)
  section1.scrollIntoView({behavior: 'smooth'})
});

const alertH1 = function(e){
  alert('addEventListener: Great! You are reading the heading');
  // h1.removeEventListener('mouseenter',alertH1);
};

h1.addEventListener('mouseenter',alertH1);
setTimeout(() => h1.removeEventListener('mouseenter',alertH1),3000);


///////////////////////////////////////
// Page Navigation
  // Not so clean solution
    // document.querySelector('.nav__link').forEach(function(el){
    //   el.addEventListener('click', function(e){
    //     e.preventDefault();
    //     const id = this.getAttribute('href');
    //     console.log(id);
    //     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    //   });
  // });

  //  Event Delegation
  //  1.Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function(e){
  // 2. Determine what element originated the event
  // console.log(e.target);
  e.preventDefault();
    // Matching strategy
    if(e.target.classList.contains('nav__link')){
      const id = e.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
})

///////////////////////////////////////
// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(t => t.addEventListener('click',()=> console.log("TAB")));
tabsContainer.addEventListener('click', function(e){
  const clicked =e.target.closest('.operations__tab');
  console.log(clicked);
  // Guard clause
  if(!clicked) return;
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Active tab
  clicked.classList.add('operations__tab--active');
  // Activate content area
  console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  .classList.add('operations__content--active'); 
});

///////////////////////////////////////
// Menu fade animation
const nav = document.querySelector('.nav');



const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
  
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
}
};

nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));

///////////////////////////////////////
// Sticky Navigation

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function(entries){
  const [entry] = entries;
  // console.log(entry);
  if(!entry.isIntersecting)
   nav.classList.add('sticky');
  else
   nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav,{
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reaveal Sections  --  Revieling Elements on Scroll 
const allSections = document.querySelectorAll('.section');

const revielSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revielSection, {
  root: null,
  threshold:0.15,
});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
});
///////////////////////////////////////
// Lazy Loading Images
// This is really great for performance
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function(entries,observer){
  const [entry] = entries;
  console.log(entry);
  if(!entry.isIntersecting) return;
  
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');  
  });
  
  observer.unobserve(entry.target);
};


const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  treshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function(){
const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

// Functions
const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class = "dots__dot" data-slide = "${i}"></button>`);
  });
};


const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide){
  slides.forEach((s,i) => s.style.transform = `translateX(${100*(i- slide)}%)`);
};

// Next slide
const nextSlide = function(){
  if(currentSlide === (maxSlide -1)){
    currentSlide = 0;
  } else{
currentSlide++;
};
goToSlide(currentSlide);
activateDot(currentSlide);
};

const previousSlide = function(){
  if(currentSlide === 0){
    currentSlide = maxSlide-1;
  } else {
  currentSlide--;
  };
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

// Event Handlers

btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',previousSlide);

document.addEventListener('keydown',function(e){
  console.log(e);
  if(e.key === 'ArrowLeft')
    previousSlide();
  else if(e.key === 'ArrowRight')
    nextSlide();
});


dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  };
});
};
slider();

