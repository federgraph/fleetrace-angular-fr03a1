# FR03A1

FR03A1 is the full Angular fat client application for the FR (fleetrace) family of projects.

Much of the code here is the same as in the `fleetrace` repo which is structured to use libraries and allows for several apps to reuse the code in the libs. By using libraries the imports look cleaner and this is probably the way to go.

But I found that it is easier to upgrade a normal single project setup to a new version of Angular and Material.

And, in the single project layout which includes all the lib code directly, I can Ctrl-Click to go to the source of everything. This is not possible in the lib project layout.

So `FR03A1` is the project setup that I am actually using to develop the project, and I have decided to publish this as is.

Will do the same for `FR03E1`, which is the `event-only` version, which does not do race-timing at intermediate time points, just the finish positions at the finish time point.

FR03A and FR03E would be the base versions without any dynamic api calls. I have deployed these to my static web site for preview purposes, so that you can see how the base applications look and feel.

FR03A1 and FR03E1 are actual development versions, which use an Api to call into the Delphi application, a node/express proxy server, or an Asp.Net application. Just the api was added on top of the base version, the api which is about to change as needed.

The specific `/fr/` base-href value is used with `FR03A` or `FR03A1`.

The base-href value of `/freo/` would be used for `FR03E` or `FR03E1`.

A base-href value of `/frac/` will be used for FR05*, e.g `FR05J`.

So these are the `base-href` values I will be using with the Delphi app.
From the Delphi app I can serve three different Angular clients in parallel, via the `/fr`, `/freo`, and `/frac` path.

I think that three repos will do. Any permanent variations of these can be done in permanent branches.

Keep in mind that there are variations:
- live or historic (data)
- race-timing included or not (the race-part)
- series-scoring included or not (the event part)
- trivial or perfect (scoring-engine complexity)
- thin or fat (fat does computation)
- server or client (both can be fat or thin)
- typescript or c# (or java, swift)
- tcp or http
- Delphi or Asp.Net (as a server)
- proxy or direct (node server can be a proxy)
- web-sockets or not (node server does web-sockets)
- json or xml (data on the server)
- authentication included or not
- secure transport or not
- demo data included or not
- tablet or phone
- athlete names included or just bib numbers (bib numbers = bow numbers)
- input client or output client (input client = timing provider)
- reports or actual data (fat client uses data, unchanged)
- broadcast or not (singe line timing messages)
- small or big event (both!)
- sponsor logo supported (no)
- printed reports supported or not (never, this is paperless)
- official or unofficial (this is unofficial, but officials are free to use it)
- Windows or Mac (this should do both)

The purpose is to build a client app that will be great on the devices too.

The idea is still that *everyone* should use the same application, the actual data should be shared, not the reports. Applications that share the data format and message format are considered the same, or at least belonging to the same family of applications. A port of this application to a new platform, read programming language, should be considered the same, a family member. The timing team at the venue should use the same application as *everyone* who is consuming result data, live or after the fact.

The basis for this app is the common data file format and the single line message format.
The project started out as a Delphi application in 2004.
Parts of the original project have since been ported to the java and C# environments.
Typescript is the latest addition.

## Build for Delphi
Run `npm run build-fr` to build the project for use with Delphi app. 
The build artifacts will be stored in the `dist/` directory.
The point is that a specific base-href is used.

## Build for Asp.Net
Run `ng build` to build the project for use with Asp.Net web applications. 
The build artifacts will be stored in the `dist/` directory.
No specific base-href should be used!

## Build for Node proxy server
Same as for the Delphi app.
Run `npm run build-fr` to build the project for use with a Node proxy server. 
The build artifacts will be stored in the `dist/` directory.
A specific base-href is needed.

## Running from Delphi app

The Delphi application, e.g. FR69, can serve this Angular client application.
You need to configure the path to the dist folder in the ini file, e.g in FR69.ini.
Then point your browser (Chrome) at the home page and find the link.

The Delphi app will tell you where the ini file is located and what the Url of the home page is.

## Running from Asp.Net web application

When testing locally you can configure the path to the dist folder in the Startup.cs of the Asp.Net Core web application.

Inside the ConfigureServices method your code will look similar to this:
```
    // In production, the Angular files will be served from this directory
    services.AddSpaStaticFiles(configuration =>
    {
        configuration.RootPath = "D:/Angular/FR03A1/dist/FR03A1";
        //configuration.RootPath = "ClientApp";
    });

```

Then add a link to localhost:port/index.html somewhere, which will load the Angular app.

## Running from a local Node/Express server

When testing locally you can serve the Angular app like so.
```
app.use('/fr', express.static(path.join(__dirname, '..', '..', 'FR03A1', 'dist', 'FR03A1')));
```

This assumes that the Angular app and the Node/Express app are in sibling directories,
and you build with a base-href of `/fr/`as defined in build-fr, see package.json.

## Testing against a Node proxy
Run `npm run start-proxy` to test this app against a node/express server on the same machine. 

Note that the node server can have a tcp connection to the Delphi result server app.

The node server can also help to relay timing messages between Angular clients via web sockets.

## Running in the Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

The app will automatically reload if you change any of the source files.

## Running lint

Run `ng lint` to execute the linter on the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Status

FR03A1 should be usable in Chrome on the desktop while you are connected to a test server application located within the same local area network as the browser. Everything else needs to be done.

## BOM, line endings, updating Angular and warnings

### BOM
Make sure that `package.json` is encoded in UTF-8 without BOM! If it has a BOM (Byte Order Marker) you will get a build error.

In Visual Studio Code, if it shows the Encoding as **UTF-8 with BOM** in the status bar
- you can click on that label
- select **Save with Encoding**
- and then select UTF-8.
- without the BOM
- that is all.

I have set default encoding of my Merge tool to UTF-8 with BOM, because I need that for Delphi projects.
I guess that is why it will sometimes have a BOM.

### Line endings
On Windows, I usually ensure CRLF as a line break.
But this also gets somehow reset to LF.
I guess this happens when I update the Angular version.
Sometimes I convert line endings to CRLF because that will confuse my Merge tool the least,
when I compare projects.

### Updating Angular
This project is supposed to use the latest Angular version.
When upgrading Angular I do it like so:
- First I run `ng update` to see if something new is available.
- Then I do `ng update @angular/cli`.
- Then I run `ng update @angular/core`.
- Then I run `ng update @angular/material`.

The last one will automatically take care of `@angular/cdk`.
And I think core will take care of rxjs.
I don't have to do these extra.

### Warnings
Build will output a warning:
```
WARNING in Circular dependency detected:
src\col\race\race-bo.ts -> src\fr\fr-bo.ts -> src\col\race\race-bo.ts

WARNING in Circular dependency detected:
src\fr\fr-bo.ts -> src\col\race\race-bo.ts -> src\fr\fr-bo.ts
```
I know how to make the warning disappear, by combining two files,
but I do not want to do that. these classes should be in their own file.
If you see only two warnings, all should be good.
