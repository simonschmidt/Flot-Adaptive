Flot.adaptive
=============

Adaptive sampling plugin for [Flot](https://github.com/flot/flot)

Automatically samples a function in desired range

##Usage

To plot `someFunction` between 0 and 10:
```javascript
$.plot("#placeholder", 
  [{ 
    adaptive: {f: someFunction, range: [0, 10]}
  }]);
```

### Options

| Option          | Description| Default |
|-----------------|:-----------|---------|
| f               | Function to plot |  Required |
| range           | `[xmin, xmax]` range to plot it in  | Required |
| initialPoints   | Number of (equidistant) points to start with| 25 |
| extraPoints     | [x0, x1, ...] extra points to include | null |
| maxRecursion    | | 6 |
| maxAngle        | Maximum angle between adjacent points (in radians ofc) | 0.1 |
| minStep         | Minimum step-size relative to x-axis width | 1/1000 |
| minStepAbsolute | Minimum absolute step-size, overides minStep | |
| debug           | | false |


