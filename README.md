# k-server

"k" as in:

```
me: wanna learn some web dev stuff
me (also): k
```

## What is this

I find that sometimes the best way to learn something is to identify a problem, form a limited understanding of it, and then proceed to tackle it poorly. Then, I find out how better people than me have already solved it in the past. While one might argue that I could just skip to the end, I believe that it helps me better understand the motivations behind why other people made the decisions that they made.

This project is an amalgamation of a bunch of things I'm trying to learn all at once, revolving mostly around web development, such as:

* UI Frameworks
* Keeping track of state
* CSS preprocessors
* Auth
* Transpilation
* Canvas libraries
* MVC
* Server-side rendering
* etc

Some of these things I'm learning by working on this library itself, while I believe others I can learn faster using this library as a tool.

More formally, it's my idea of what a full-fledged, opinionated framework for a web application would look like. The goal here is that I could easily create projects containing _only_ server- and client-side business logic, with as little boilerplate as possible. In addition, the developer experience should be as smooth as possible.

Node 7.5+ needed.

## "Features"

* Make a project
* Write "back-end" in a `server/` folder
  * This means: export from `server/index.js` the "API" surface, a collection of `async` functions
  * This API object is automatically re-created on the client
  * Don't worry about listening on a port or determining endpoints, it's done for you
* Write front-end in a `client/` folder
  * Anything goes, as long as root is `client/index.jsx`
  * Like React, for example
  * That means node modules, etc. as long as they can browserified
  * Earlier mentioned API object can be used anywhere, and exposes the same `async` functions
  * When called, they automatically make a request to the correct auto-generated endpoint and get the result
* Run `k-server` in the project root directory, it begins listening on a port
* It auto-generates API endpoints and transpiles client code
* It also hot-reloads client code
* Source maps are available for easy debugging
* All transpiled code is kept in memory only (I have an irrational fear of writing transpiled code to disk)

## API

*

## Future goals

* Too many to list
