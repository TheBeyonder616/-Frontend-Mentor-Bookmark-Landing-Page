"use strict";
//#region start================={Constant}
const header = document.getElementById("header");
const main = document.getElementById("main");
// Navigation
const menuOverlay = document.querySelector("[data-nav-overlay]");
const menu = document.querySelector("[data-menu]");
const menuContent = document.querySelector("[data-menu-content]");
const menuMedia = document.querySelector("[data-menu-media]");
const btnMoveUp = document.querySelector("[data-move-up]");
// Contact us
const emailError = document.querySelector("[data-email]");
// Slider
const controler = document.querySelectorAll("[data-slide-control]");
const imgSlider = document.querySelectorAll("[data-slider-tab]");
const imgSLiderCaption = document.querySelectorAll("[data-slider-caption]");
// #region end

//#region start========================================{Helpers}
const cList = {
  add: (el, cl) => el.classList.add(cl),
  rem: (el, cl) => el.classList.remove(cl),
  tog: (el, cl) => el.classList.toggle(cl),
  con: (el, cl) => el.classList.contains(cl),
};

const setTime = (func, time) => setTimeout(() => func(), time);

let wait = 600;
const isClosed = () => {
  cList.rem(menu, "translateX");
  cList.rem(menuContent, "show");
  cList.rem(menuMedia, "show");
  setTime(() => cList.add(menuOverlay, "hide"), wait);
};

const isOpen = () => {
  cList.rem(menuOverlay, "hide");
  setTime(() => {
    cList.add(menuContent, "show");
    cList.add(menuMedia, "show");
    cList.add(menu, "translateX");
  }, wait);
};

const handleHeaderEvent = function (e) {
  const openMenu = e.target.closest("[data-open-menu]");
  const closenMenu = e.target.closest("[data-close-menu]");
  const links = e.target.closest("[data-nav-list]");
  if (openMenu) isOpen();
  if (closenMenu) isClosed();
  if (links) isClosed();
};

let cOpenFaq = null;

const handleFaqPopUp = function (e) {
  const clickedFaq = e.target.closest("[data-faq]");

  if (clickedFaq) {
    const parent = clickedFaq.parentNode;
    const answer = parent.querySelector("[data-faq-answer]");
    const icon = clickedFaq.querySelector("[data-faq-icon]");

    if (cOpenFaq && cOpenFaq !== clickedFaq) {
      const prevParent = cOpenFaq.parentNode;
      const prevAnswer = prevParent.querySelector("[data-faq-answer]");
      const prevIcon = cOpenFaq.querySelector("[data-faq-icon]");
      cList.rem(prevIcon, "faq--active");
      cList.rem(prevAnswer, "faq--answer");
    }

    cList.tog(icon, "faq--active")
      ? cList.add(answer, "faq--answer")
      : cList.rem(answer, "faq--answer");

    //Update the current opend faq
    cOpenFaq = cList.con(icon, "faq--active") ? clickedFaq : null;
  }
};

let isValid = false;

const isValidEmail = (email) => {
  const trimEmail = email.trim();
  const emailRege = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRege.test(trimEmail);
};

const isValidTrue = () => {
  cList.rem(emailError, "label--error");
  isValid = true;
};
const isValidFalse = () => {
  cList.add(emailError, "label--error");
  isValid = false;
};
const handleValidationCheck = function (email) {
  const emailElemnt = document.getElementById(email);
  const input = emailElemnt.value;
  isValidEmail(input) ? isValidTrue() : isValidFalse();
};

const handleInputEvent = function (e) {
  const email = e.target.id === "email";
  if (email) handleValidationCheck("email");
};

const isSubmit = () => {
  document.getElementById("email").value = "";
  setTime(() => (isValid = false), 500);
  alert("Your email has been recived we will get in tocuh :)");
};

const handleSubmit = (e, target) => {
  const submitButton = e.target.closest(target);
  if (submitButton) isValid ? isSubmit() : isValidFalse();
};

const handleMainEvent = (e) => {
  e.preventDefault();
  handleFaqPopUp(e);
  handleSubmit(e, "[data-submit]");
};

const handleDOM = () => {
  handleObserver.observe(header);
  header.addEventListener("click", handleHeaderEvent);
  main.addEventListener("click", handleMainEvent);
  main.addEventListener("input", handleInputEvent);
  initDot(controler, imgSlider);
  initDot(controler, imgSLiderCaption);
  handleUpdateSlide(imgSLiderCaption);
  handleUpdateSlide(imgSlider);
};
//#region end

// #region start =========================================={Intersection O}
const handleIntersectionObsever = function (entries) {
  entries.forEach((entry) => {
    entry.isIntersecting
      ? cList.rem(btnMoveUp, "show")
      : cList.add(btnMoveUp, "show");
  });
};

const options = {
  root: null,
  threshold: 0.6,
};

const handleObserver = new IntersectionObserver(
  handleIntersectionObsever,
  options
);
//#region end
// #region start =============================================={Slider}
let current = 0;

const handleUpdateSlide = function (slider) {
  slider.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - current) * 100}%)`;
  });
};

const handleUpdateDot = function (dots) {
  dots.forEach((dot, index) => {
    dot.classList.toggle("control--tr", index === current);
  });
};

const changeSlide = function (slider, direction) {
  if (direction === "prev") {
    current = current > 0 ? current - 1 : slider.length - 1;
  } else if (direction === "next") {
    current = current < slider.length - 1 ? current + 1 : 0;
  }
  handleUpdateSlide(slider);
};

const initDot = function (dots, slider) {
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-slide-control"), 10);
      current = index;
      handleUpdateSlide(slider);
      handleUpdateDot(dots);
    });
  });
};

//#region end

//#region start============================================{Events}
document.addEventListener("DOMContentLoaded", handleDOM);
//#region end
