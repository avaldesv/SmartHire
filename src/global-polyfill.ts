/**
 * sockjs-client expects a Node-like `global`.
 * Must load via angular.json polyfills (before app modules).
 */
(window as unknown as { global: typeof window }).global = window;
