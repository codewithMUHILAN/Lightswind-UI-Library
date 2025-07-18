let body = document.querySelector('body');

gsap.set(body, { autoAlpha: 0});

gsap.registerPlugin(SplitText);

window.addEventListener('load', (event) => {
  var tl = gsap.timeline();
  
  gsap.set(body, { autoAlpha: 1});

  var pageHeading = document.querySelector(".header h1");
  var pageBody = document.querySelector(".header p");
  var seperator = document.querySelector(".header hr");
  var imageCards = gsap.utils.toArray(".image-card");
  
  gsap.set(imageCards, { autoAlpha: 0 });

  var childLines = new SplitText(pageHeading, { type: "lines", linesClass: "heading-line" });

  var parentLines = new SplitText(pageHeading, { type: "lines", linesClass: "heading-line-wrapper" });

  tl.from(childLines.lines, {
    duration: 1,
    y: 200,
    stagger: 0.25,
    delay: 1,
    ease: 'power4.out'
  });

  tl.from(pageBody, {
    duration: 0.5,
    opacity: 0,
    x: -20,
  }, '-=0.5');

  tl.from(seperator, {
    duration: 2,
    scale: 0,
    ease: 'expo.inOut'
  }, '-=1.1');

  tl.to(imageCards, {
    duration: 0.75,
    autoAlpha: 1,
    y: -50,
    stagger: 0.5,
    ease: 'power4.out'
  }, '-=0.75');
  
  const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true
  });

  setTimeout(() => { scroll.update(); }, 1000);
});

