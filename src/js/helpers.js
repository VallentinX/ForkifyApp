import {async} from 'regenerator-runtime';
import {sTimeout} from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    /* prettier-ignore */
    const fetchData = uploadData ? fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json',},body: JSON.stringify(uploadData),}) : fetch(url);

    const response = await Promise.race([fetchData, timeout(sTimeout)]);

    const data = await response.json();

    /* prettier-ignore */
    if (!response.ok) throw new Error(`Fetch Status(${response.status}): ${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};
