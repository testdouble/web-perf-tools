# Web Perf Tools

> A simple wrapper around lighthouse to generate web perf profiles, using Desktop and No Network Throttling as defaults.

1. Edit `urls.js` to add / customize the list of urls you want

```javascript
// urls.js
module.exports = [
  {
    title,
    url,
    protocol
  }
]
```

Usage: `node profiler.js`
