export const waitForVisible = (selector: string | Element) =>
  new Promise((resolve) => {
    if (typeof selector !== 'string') {
      return resolve(true);
    }

    if (document.querySelector(selector)) {
      return resolve(true);
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(true);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
