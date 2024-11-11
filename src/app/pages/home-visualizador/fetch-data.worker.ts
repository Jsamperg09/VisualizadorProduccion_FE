/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data === 'start') {
    setInterval(() => {
      postMessage('fetchData');
    }, 30000);
  }
});
