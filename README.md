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

| Option          | Description| Default |
|-----------------|:-----------|---------|
| f               | Function to plot |  Required |
| range           | `[xmin, xmax]` range to plot it in  | Required |
| initialPoints   | Number of (equidistant) points to start with| 25 |
| extraPoints     | [x0, x1, ...] extra points to include | null |
| maxRecursion    | | 3 |
| maxAngle        | Maximum angle between adjacent points | 0.01 |
| minStep         | Minimum step-size relative to x-axis width | 1/1000 |
| minStepAbsolute | Minimum absolute step-size, overides minStep | |
| debug           | | false |


