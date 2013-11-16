Flot.adaptive
=============

Adaptive sampling plugin for [Flot](https://github.com/flot/flot)

Automatically samples a function in desired range

##Usage

To plot `someFunction` between 0 and 10:
```javascript
$.plot("#placeholder", 
  { 
    data: [], 
    adaptive: {f: someFunction, range: [0, 10]}
  }]);
```

`data: []` has to be included for now, it is ignored.

### Options

| Option          | Description|
|-----------------|:---------|
| f               | function |
| range           | `[xmin, xmax]` |
| initialPoints   | Number of (equidistant) points to start with, default `25` |
| extraPoints     | [x0, x1, ...] extra points to include |
| maxRecursion    | Default `3` |
| maxAngle        | Maximum angle between adjacent points, default `0.01` |
| minStep         | Minimum step-size relative to x-axis width, default `1/1000` |
| minStepAbsolute | Minimum absolute step-size, overides minStep |
| debug           | Default `false` |


