// src/utils/storage.js
export const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (e) {
    return fallback;
  }
};

export const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
