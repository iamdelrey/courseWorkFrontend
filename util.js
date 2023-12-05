import $ from "jquery";

const TRANSITION_END = "transitionend";
const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;

function toType(obj) {
  if (obj === null || typeof obj === "undefined") {
    return `${obj}`;
  }

  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
}

function getSpecialTransitionEndEvent() {
  return {
    bindType: TRANSITION_END,
    delegateType: TRANSITION_END,
    handle(event) {
      if ($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments);
      }

      return undefined;
    },
  };
}

function transitionEndEmulator(duration) {
  let called = false;

  $(this).one(Util.TRANSITION_END, () => {
    called = true;
  });

  setTimeout(() => {
    if (!called) {
      Util.triggerTransitionEnd(this);
    }
  }, duration);

  return this;
}

function setTransitionEndSupport() {
  $.fn.emulateTransitionEnd = transitionEndEmulator;
  $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
}

const Util = {
  TRANSITION_END: "bsTransitionEnd",

  getUID(prefix) {
    do {
      prefix += ~~(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  },

  getSelectorFromElement(element) {
    let selector = element.getAttribute("data-target");

    if (!selector || selector === "#") {
      const hrefAttr = element.getAttribute("href");
      selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : "";
    }

    try {
      return document.querySelector(selector) ? selector : null;
    } catch (_) {
      return null;
    }
  },

  getTransitionDurationFromElement(element) {
    if (!element) {
      return 0;
    }

    let transitionDuration = $(element).css("transition-duration");
    let transitionDelay = $(element).css("transition-delay");

    const floatTransitionDuration = parseFloat(transitionDuration);
    const floatTransitionDelay = parseFloat(transitionDelay);

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    transitionDuration = transitionDuration.split(",")[0];
    transitionDelay = transitionDelay.split(",")[0];

    return (
      (parseFloat(transitionDuration) + parseFloat(transitionDelay)) *
      MILLISECONDS_MULTIPLIER
    );
  },

  reflow(element) {
    return element.offsetHeight;
  },

  triggerTransitionEnd(element) {
    $(element).trigger(TRANSITION_END);
  },

  supportsTransitionEnd() {
    return Boolean(TRANSITION_END);
  },

  isElement(obj) {
    return (obj[0] || obj).nodeType;
  },

  typeCheckConfig(componentName, config, configTypes) {
    for (const property in configTypes) {
      if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
        const expectedTypes = configTypes[property];
        const value = config[property];
        const valueType =
          value && Util.isElement(value) ? "element" : toType(value);

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new Error(
            `${componentName.toUpperCase()}: ` +
              `Option "${property}" provided type "${valueType}" ` +
              `but expected type "${expectedTypes}".`
          );
        }
      }
    }
  },

  findShadowRoot(element) {
    if (!document.documentElement.attachShadow) {
      return null;
    }

    if (typeof element.getRootNode === "function") {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    }

    if (!element.parentNode) {
      return null;
    }

    return Util.findShadowRoot(element.parentNode);
  },

  jQueryDetection() {
    if (typeof $ === "undefined") {
      throw new TypeError(
        "Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."
      );
    }

    const version = $.fn.jquery.split(" ")[0].split(".");
    const minMajor = 1;
    const ltMajor = 2;
    const minMinor = 9;
    const minPatch = 1;
    const maxMajor = 4;

    if (
      (version[0] < ltMajor && version[1] < minMinor) ||
      (version[0] === minMajor &&
        version[1] === minMinor &&
        version[2] < minPatch) ||
      version[0] >= maxMajor
    ) {
      throw new Error(
        "Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0"
      );
    }
  },
};

Util.jQueryDetection();
setTransitionEndSupport();

export default Util;
