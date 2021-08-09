# UI Playground

## Script tag browser behaviour
- script tags order does matter, although the download of script resource is parallel, browser will ensure the script execution is in order
```
<script>console.log("start @" + new Date()); window.recorder.push("start @" + new Date()) ;</script>
<script src="http://localhost:8888/api/verboser.js?v=1&delay=3000"></script>
<script src="http://localhost:8888/api/verboser.js?v=2&delay=2000"></script>
<script src="http://localhost:8888/api/verboser.js?v=3&delay=1000"></script>
<script>console.log("intermediate @" + new Date()); window.recorder.push("intermediate @" + new Date()) ;</script>
<script src="http://localhost:8888/api/verboser.js?v=4&delay=5000"></script>
```
### Results
```
start @Sun Aug 08 2021 22:28:50
verbose-1 @ Sun Aug 08 2021 22:28:52     >>> after 3 seconds
verbose-2 @ Sun Aug 08 2021 22:28:52     >>> after 3 seconds, got delay by script above  
verbose-3 @ Sun Aug 08 2021 22:28:52
intermediate @Sun Aug 08 2021 22:28:52
verbose-4 @ Sun Aug 08 2021 22:28:54
Document Ready @ Sun Aug 08 2021 22:28:54
```

## Good Readings
- [Async|Defer](https://flaviocopes.com/javascript-async-defer/#no-defer-or-async-in-the-head)

## Important DOM Events
- `readystatechange` aka domInteractive event, when DOM is ready to serve
- `DOMContentLoaded` event is ~= `${document}.ready`, it represents the html content are fully loaded into the dom tree, it might or might no inclusive of the dependent link resources
- `Load` on the other hand indicating all resources are fully download and executed

### Take Aways
- script tag order will affect how the browser is loading the page
- the page might look unresponsive (blank screen) if we place the large or slow network script
- if the scripts are not important for page load, we should delay the script processing by putting a `defer` ( as recommneded by the page), `defer` works better than `async` as it will gurantee the `defer` script only start executing after `domInteractive | readystatechange`. `defer` scripts should be placed under header tag
- if the scripts are essential for page load, we have to manage it explicitly
   - progress bar rendering on body
   - script should be place under body tag
   - Progress bar be removed on `DOMContentLoaded` or `Load` event.