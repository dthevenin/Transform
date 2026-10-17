import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Expose browser globals (window, DOMMatrix...) before any source module is
// loaded: transform.ts reads window.HTMLElement and vs_ui_utils extends
// DOMMatrix at import time.
GlobalRegistrator.register({
  settings: {
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
});
