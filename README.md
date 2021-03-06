Flot.adaptive
=============

Adaptive sampling plugin for [Flot](https://github.com/flot/flot)

Automatically samples a function in desired range

![Animation](http://simonschmidt.github.io/Flot-Adaptive/images/recursions.gif)

##Usage

To plot `someFunction` between 0 and 10:
```javascript
$.plot("#placeholder", 
  [{ 
    data: someFunction,
    adaptive: { range: [0, 10] }
  }]);
```

### Options

| Option          | Description| Default |
|-----------------|:-----------|---------|
| range           | `[xmin, xmax]` range to plot it in  | Required |
| initialPoints   | Number of (equidistant) points to start with| 25 |
| extraPoints     | [x0, x1, ...] extra points to include | null |
| maxRecursion    | | 5 |
| maxAngle        | Maximum angle between adjacent points (in radians ofc) | 0.1 |
| maxTime         | Maximum time in seconds spent refining, initialPoints and extraPoints are always calculated | |
| minStep         | Minimum step-size relative to x-axis width | 1/1000 |
| minStepAbsolute | Minimum absolute step-size, overides minStep | |
| debug           | | false |


