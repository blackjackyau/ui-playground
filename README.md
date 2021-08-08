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
### Add async attribute
Straight forward, adding async will make the script execution asynchronously and without dependencies
```
start @Sun Aug 08 2021 23:19:26
intermediate @Sun Aug 08 2021 23:19:26
Document Ready @ Sun Aug 08 2021 23:19:26
verbose-3 @ Sun Aug 08 2021 23:19:27
verbose-2 @ Sun Aug 08 2021 23:19:28
verbose-1 @ Sun Aug 08 2021 23:19:29
verbose-4 @ Sun Aug 08 2021 23:19:31
```

### Take Aways
- script tag order will affect how the browser is loading the page
- the page might look unresponsive (blank screen) if we place the large or slow network script
- If were to introduce a loading spinner in between the load time, the loading script tags have to be placed after the progress bar dom tree (body tag)

## Extra Readings
- [Async|Defer](https://flaviocopes.com/javascript-async-defer/#no-defer-or-async-in-the-head)