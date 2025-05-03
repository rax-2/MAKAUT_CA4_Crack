document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("contextmenu", (event) => event.stopPropagation(), true);
  document.addEventListener("mousedown", (event) => event.stopPropagation(), true);
  document.addEventListener("mouseup", (event) => event.stopPropagation(), true);
  document.addEventListener("selectstart", (event) => event.stopPropagation(), true);
});
console.log('updated');

// Remove inline event handlers
document.querySelectorAll("*").forEach((el) => {
  el.oncontextmenu = null;
  el.onselectstart = null;
  el.onmousedown = null;
});
window.oncontextmenu = function () {
  // Allow the default right-click context menu
  return true;
};

document.onkeydown = function (e) {
  // Allow all key combinations (e.g. ctrl, shift, etc.)
  return true;
};
document.onkeydown = function (e) {
  if (e.ctrlKey) {
    // showMsgModel("Error",'Right Click and Input Facilities are disabled for security reason.');
    console.log('trgg');

    return true;
  };
};

// enable page
(function () {
  // --- Override Page Visibility API Properties ---
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: function () { return false; }
  });

  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: function () { return 'visible'; }
  });

  // Override document.hasFocus() to always return true
  document.hasFocus = function () { return true; };

  // --- Intercept and Block Visibility Change Events ---
  const originalDocAddEventListener = Document.prototype.addEventListener;
  Document.prototype.addEventListener = function (type, listener, options) {
    // Block adding any 'visibilitychange' listeners
    if (type === 'visibilitychange') {
      // Optionally, log or ignore silently
      // console.log('Blocked visibilitychange event listener.');
      return;
    }
    return originalDocAddEventListener.call(this, type, listener, options);
  };

  // --- Block Window Blur/FocusOut Events ---
  const originalWinAddEventListener = window.addEventListener;
  window.addEventListener = function (type, listener, options) {
    if (type === 'blur' || type === 'focusout') {
      // Block these events from being registered.
      // console.log('Blocked window event listener for:', type);
      return;
    }
    return originalWinAddEventListener.call(this, type, listener, options);
  };

  // Also, remove any existing blur or focusout events by stopping propagation.
  window.addEventListener('blur', function (e) {
    e.stopImmediatePropagation();
  }, true);
  window.addEventListener('focusout', function (e) {
    e.stopImmediatePropagation();
  }, true);

  // --- Override onblur and onfocus properties ---
  Object.defineProperty(window, 'onblur', {
    configurable: true,
    set: function () { },
    get: function () { return null; }
  });
  Object.defineProperty(window, 'onfocus', {
    configurable: true,
    set: function () { },
    get: function () { return null; }
  });

  // Optionally, override document.onvisibilitychange if it exists
  document.onvisibilitychange = null;

  // console.log("Bypass active tab checks loaded: Page will appear always active.");
})();

//
(function () {
  function createPopup() {
    const popup = document.createElement("div");
    popup.id = "text-selection-popup";
    popup.style.position = "absolute";
    popup.style.display = "none";
    popup.style.zIndex = "9999";
    popup.style.padding = "6px";
    popup.style.background = "rgba(0, 0, 0, 0.8)";
    popup.style.borderRadius = "5px";
    popup.style.color = "#fff";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.fontSize = "14px";
    popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
    popup.style.transition = "opacity 0.2s ease";
    popup.style.display = "none";
    popup.style.position = "fixed";

    // Create "Copy" button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.style.marginRight = "5px";
    copyBtn.style.padding = "5px 10px";
    copyBtn.style.border = "none";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.borderRadius = "3px";
    copyBtn.style.background = "#4CAF50";
    copyBtn.style.color = "white";

    // Create "Search" button
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "Search";
    searchBtn.style.padding = "5px 10px";
    searchBtn.style.border = "none";
    searchBtn.style.cursor = "pointer";
    searchBtn.style.borderRadius = "3px";
    searchBtn.style.background = "#2196F3";
    searchBtn.style.color = "white";

    popup.appendChild(copyBtn);
    popup.appendChild(searchBtn);
    document.body.appendChild(popup);

    return { popup, copyBtn, searchBtn };
  }

  function showPopup(popup, selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Check if the selection is visible in the viewport
    if (rect.width === 0 || rect.height === 0) {
      popup.style.display = "none";
      return;
    }

    popup.style.top = `${window.scrollY + rect.bottom + 10}px`;
    popup.style.left = `${window.scrollX + rect.left}px`;
    popup.style.display = "block";
  }

  function setupEventListeners(popup, copyBtn, searchBtn) {
    document.addEventListener("mouseup", () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.toString().trim().length > 0) {
          showPopup(popup, selection);
        } else {
          popup.style.display = "none";
        }
      }, 50);
    });

    document.addEventListener("mousedown", (e) => {
      if (!popup.contains(e.target)) {
        popup.style.display = "none";
      }
    });

    copyBtn.addEventListener("click", () => {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        navigator.clipboard.writeText(selection)
          .then(() => console.log("Text copied!"))
          .catch(err => console.error("Failed to copy:", err));
      }
      popup.style.display = "none";
    });

    searchBtn.addEventListener("click", () => {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, "_blank");
      }
      popup.style.display = "none";
    });
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        const { popup, copyBtn, searchBtn } = createPopup();
        setupEventListeners(popup, copyBtn, searchBtn);
      });
    } else {
      const { popup, copyBtn, searchBtn } = createPopup();
      setupEventListeners(popup, copyBtn, searchBtn);
    }
  }

  init();
})();
////
(function () {
  // --- Remove any existing script tags that load users.js ---
  function removeExistingUsersJS() {
    const scripts = document.querySelectorAll('script[src*="users.js"]');
    scripts.forEach(script => {
      // Remove the script element to prevent execution
      script.parentNode && script.parentNode.removeChild(script);
      console.log("Removed existing script: ", script.src);
    });
  }

  // --- Override document.createElement to intercept script creation ---
  const originalCreateElement = document.createElement;
  document.createElement = function (tagName, options) {
    const element = originalCreateElement.call(document, tagName, options);
    if (tagName.toLowerCase() === 'script') {
      // Intercept setting the src property on any new script element
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function (attr, value) {
        if (attr === 'src' && typeof value === 'string' && value.includes('users.js')) {
          console.log("Blocked setting src on script: ", value);
          return;
        }
        return originalSetAttribute.call(this, attr, value);
      };
      // Also override the property descriptor for src
      Object.defineProperty(element, 'src', {
        set(value) {
          if (typeof value === 'string' && value.includes('users.js')) {
            console.log("Blocked assigning src property on script: ", value);
          } else {
            this.setAttribute('src', value);
          }
        },
        get() {
          return this.getAttribute('src');
        },
        configurable: true,
        enumerable: true
      });
    }
    return element;
  };

  // --- Override appendChild and insertBefore to block users.js scripts ---
  function overrideAppendMethods() {
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (child) {
      if (child.tagName === 'SCRIPT' && child.src && child.src.includes('users.js')) {
        console.log("Blocked appending script:", child.src);
        return child; // Skip appending
      }
      return originalAppendChild.call(this, child);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (newNode.tagName === 'SCRIPT' && newNode.src && newNode.src.includes('users.js')) {
        console.log("Blocked inserting script:", newNode.src);
        return newNode; // Skip inserting
      }
      return originalInsertBefore.call(this, newNode, referenceNode);
    };
  }

  // Run when document.body is available
  function init() {
    removeExistingUsersJS();
    overrideAppendMethods();
    console.log("users.js blocking script loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function () {
  let port;
  try {
    port = document.getElementById('lwys-ctv-port');
    port.remove();
  }
  catch (e) {
    port = document.createElement('span');
    port.id = 'lwys-ctv-port';
    document.documentElement.append(port);
  }

  const block = e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  /* visibility */
  Object.defineProperty(document, 'visibilityState', {
    get() {
      if (port.dataset.enabled === 'false') {
        return port.dataset.hidden === 'true' ? 'hidden' : 'visible';
      }
      return 'visible';
    }
  });
  Object.defineProperty(document, 'webkitVisibilityState', {
    get() {
      if (port.dataset.enabled === 'false') {
        return port.dataset.hidden === 'true' ? 'hidden' : 'visible';
      }
      return 'visible';
    }
  });

  const once = {
    focus: true,
    visibilitychange: true,
    webkitvisibilitychange: true
  };

  document.addEventListener('visibilitychange', e => {
    port.dispatchEvent(new Event('state'));
    if (port.dataset.enabled === 'true' && port.dataset.visibility !== 'false') {
      if (once.visibilitychange) {
        once.visibilitychange = false;
        return;
      }
      return block(e);
    }
  }, true);
  document.addEventListener('webkitvisibilitychange', e => {
    if (port.dataset.enabled === 'true' && port.dataset.visibility !== 'false') {
      if (once.webkitvisibilitychange) {
        once.webkitvisibilitychange = false;
        return;
      }
      return block(e);
    }
  }, true);
  window.addEventListener('pagehide', e => {
    if (port.dataset.enabled === 'true' && port.dataset.visibility !== 'false') {
      block(e);
    }
  }, true);

  /* pointercapture */
  window.addEventListener('lostpointercapture', e => {
    if (port.dataset.enabled === 'true' && port.dataset.pointercapture !== 'false') {
      block(e);
    }
  }, true);

  /* hidden */
  Object.defineProperty(document, 'hidden', {
    get() {
      if (port.dataset.enabled === 'false') {
        return port.dataset.hidden === 'true';
      }
      return false;
    }
  });
  Object.defineProperty(document, 'webkitHidden', {
    get() {
      if (port.dataset.enabled === 'false') {
        return port.dataset.hidden === 'true';
      }
      return false;
    }
  });

  /* focus */
  Document.prototype.hasFocus = new Proxy(Document.prototype.hasFocus, {
    apply(target, self, args) {
      if (port.dataset.enabled === 'true' && port.dataset.focus !== 'false') {
        return true;
      }
      return Reflect.apply(target, self, args);
    }
  });

  const onfocus = e => {
    if (port.dataset.enabled === 'true' && port.dataset.focus !== 'false') {
      if (e.target === document || e.target === window) {
        if (once.focus) {
          once.focus = false;
          return;
        }
        return block(e);
      }
    }
  };
  document.addEventListener('focus', onfocus, true);
  window.addEventListener('focus', onfocus, true);

  /* blur */
  const onblur = e => {
    if (port.dataset.enabled === 'true' && port.dataset.blur !== 'false') {
      if (e.target === document || e.target === window) {
        return block(e);
      }
    }
  };
  document.addEventListener('blur', onblur, true);
  window.addEventListener('blur', onblur, true);

  /* mouse */
  window.addEventListener('mouseleave', e => {
    if (port.dataset.enabled === 'true' && port.dataset.mouseleave !== 'false') {
      if (e.target === document || e.target === window) {
        return block(e);
      }
    }
  }, true);
  window.addEventListener('mouseout', e => {
    if (port.dataset.enabled === 'true' && port.dataset.mouseout !== 'false') {
      if (e.target === document.documentElement || e.target === document.body) {
        return block(e);
      }
    }
  }, true);

  /* requestAnimationFrame */
  let lastTime = 0;
  window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, self, args) {
      if (port.dataset.enabled === 'true' && port.dataset.hidden === 'true') {
        const currTime = Date.now();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = setTimeout(function () {
          args[0](performance.now());
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      }
      else {
        return Reflect.apply(target, self, args);
      }
    }
  });
  window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply(target, self, args) {
      if (port.dataset.enabled === 'true' && port.dataset.hidden === 'true') {
        clearTimeout(args[0]);
      }
      return Reflect.apply(target, self, args);
    }
  });
})



// (function () {
//   // Remove the assigned onkeydown function
//   document.onkeydown = null;

//   // Block other keydown event listeners
//   document.addEventListener('keydown', function (e) {
//     // Allow all keys, including Ctrl combinations
//     e.stopImmediatePropagation(); // Stop any other handlers from being triggered
//   }, true);

//   console.log('Keydown blocking bypassed.');
// })();

setInterval(() => {
  if (document.onkeydown) {
    document.onkeydown = null;
    console.log('Blocked reassigned document.onkeydown');
  }
}, 1000);

// (function () {
//   const start = new Date("2025-05-03T11:00:00");
//   const end = new Date("2025-05-03T11:40:00");
//   let simulatedTime = new Date(start);

//   function spoofedClock() {
//     const hours = simulatedTime.getHours().toString().padStart(2, '0');
//     const minutes = simulatedTime.getMinutes().toString().padStart(2, '0');
//     const seconds = simulatedTime.getSeconds().toString().padStart(2, '0');
//     const timeString = hours + ":" + minutes + ":" + seconds;

//     const timeDisplay = document.getElementById("time");
//     if (timeDisplay) {
//       timeDisplay.textContent = timeString;
//     }

//     // Advance simulated time
//     simulatedTime.setSeconds(simulatedTime.getSeconds() + 1);

//     // Stop updating if time passes 11:40 AM
//     if (simulatedTime <= end) {
//       setTimeout(spoofedClock, 1000);
//     }
//   }

//   // Override the original clock function if it exists
//   window.clock = spoofedClock;

//   // Start the spoofed clock
//   spoofedClock();
// })();


document.addEventListener("copy", function (e) {
  e.stopImmediatePropagation();

  // Optional: manually set clipboard data
  const selection = window.getSelection().toString();
  if (e.clipboardData) {
    e.clipboardData.setData("text/plain", selection);
    e.preventDefault(); // Required when using setData
  }

  console.log("Copied:", selection);
}, true);
(function () {
  document.addEventListener("keydown", function (e) {
    // Stop other keydown handlers from being triggered
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      e.stopImmediatePropagation(); // Bypass other listeners
    }
  }, true); // 'true' = capture phase

  console.log("Ctrl+C block bypassed.");
})();

// content.js

(function () {
  const block = e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  // Fake visibility APIs
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
  Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible' });
  Object.defineProperty(document, 'hidden', { get: () => false });
  Object.defineProperty(document, 'webkitHidden', { get: () => false });

  // hasFocus always true
  Document.prototype.hasFocus = new Proxy(Document.prototype.hasFocus, {
    apply: () => true
  });

  // Prevent blur/focus events
  const onfocus = e => {
    if (e.target === document || e.target === window) block(e);
  };
  const onblur = e => {
    if (e.target === document || e.target === window) block(e);
  };
  document.addEventListener('focus', onfocus, true);
  window.addEventListener('focus', onfocus, true);
  document.addEventListener('blur', onblur, true);
  window.addEventListener('blur', onblur, true);

  // Block visibility change events
  const onvis = e => block(e);
  document.addEventListener('visibilitychange', onvis, true);
  document.addEventListener('webkitvisibilitychange', onvis, true);
  window.addEventListener('pagehide', onvis, true);

  // Block pointer capture loss
  window.addEventListener('lostpointercapture', block, true);

  // Prevent mouse leave/out behavior
  window.addEventListener('mouseleave', e => {
    if (e.target === document || e.target === window) block(e);
  }, true);
  window.addEventListener('mouseout', e => {
    if (e.target === document.documentElement || e.target === document.body) block(e);
  }, true);

  // Force requestAnimationFrame to run in background
  let lastTime = 0;
  window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, self, args) {
      const currTime = Date.now();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = setTimeout(() => args[0](performance.now()), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    }
  });
  window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply(target, self, args) {
      clearTimeout(args[0]);
    }
  });
})();


// List of events to bypass
const bypassedEvents = ['focusin', 'focusout', 'blur', 'mouseenter', 'visibilitychange'];

// Function to prevent default behavior and stop propagation for the given events
function preventEvent(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
}

// Attach event listeners to block the events
bypassedEvents.forEach(event => {
  // `blur` needs to be applied to the document to catch it from all elements
  if (event === 'blur') {
    document.addEventListener(event, preventEvent, true); // true for capture phase
  } else {
    window.addEventListener(event, preventEvent, true); // For other events
  }
});

(function() {
  // Disable blur event by overriding addEventListener globally
  const originalAddEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type, listener, options) {
    if (type === 'blur') {
      // Override the blur event handler to do nothing
      return; // Don't allow the blur event to be registered
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Disable blur event triggered by the onblur attribute
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    if (name === 'onblur') {
      // Prevent inline blur event handler
      return;
    }
    return originalSetAttribute.call(this, name, value);
  };

  // Disable the blur event listener using `blur()` method
  const originalBlur = HTMLElement.prototype.blur;
  HTMLElement.prototype.blur = function() {
    // Do nothing when blur is triggered programmatically
  };

  // Override event handler for blur in case it's attached directly on window or document
  window.addEventListener('blur', function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    window.focus();
    
  }, true);

 
})();
