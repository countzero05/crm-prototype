import cheerio from "cheerio";
import pjson from "./../package.json";
import fs from "fs";
import path from "path";
import favicons from "favicons";
// Allowing console calls below since this is a build file.
/*eslint-disable no-console */
/* eslint-disable no-unused-vars */
import colors from "colors";

console.log("Starting generating icons...".green);

const source = path.join(__dirname, "../src/static/images/favicon.png");           // Source image(s). `string`, `buffer` or array of `string`

const writeHead = (content) => {
  fs.readFile(path.join(__dirname, "../dist/index.html"), "utf8", (err, markup) => {
    if (err) {
      throw new Error(err.message);
    }

    const $ = cheerio.load(markup);

    // since a separate spreadsheet is only utilized for the production build, need to dynamically add this here.
    $("head").prepend(content);

    fs.writeFile(path.join(__dirname, "../dist/index.html"), $.html(), "utf8", (err) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log("index.html written to /dist".green);
    });
  });
};

const configuration = {
  appName: "Staff Control System",                  // Your application"s name. `string`
  appDescription: null,           // Your application"s description. `string`
  developerName: null,            // Your (or your developer"s) name. `string`
  developerURL: null,             // Your (or your developer"s) URL. `string`
  background: "#fff",             // Background colour for flattened icons. `string`
  path: "/icons/",                      // Path for overriding default icons path. `string`
  display: "standalone",          // Android display: "browser" or "standalone". `string`
  orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string`
  start_url: "/staff",    // Android start application"s URL. `string`
  version: pjson.version,                 // Your application"s version number. `number`
  logging: false,                 // Print logs to console? `boolean`
  online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
  preferOnline: false,            // Use offline generation, if online generation has failed. `boolean`
  icons: {
    android: true,              // Create Android homescreen icon. `boolean`
    appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
    appleStartup: true,         // Create Apple startup images. `boolean`
    coast: {offset: 25},      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
    favicons: true,             // Create regular favicons. `boolean`
    firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
    windows: true,              // Create Windows 8 tile icons. `boolean`
    yandex: true                // Create Yandex browser icon. `boolean`
  }
};
const callback = function (error, response) {
  if (error) {
    console.log(error.status);  // HTTP error code (e.g. `200`) or `null`
    console.log(error.name);    // Error name e.g. "API Error"
    console.log(error.message); // Error description e.g. "An unknown error has occurred"
  }

  response.images.forEach(({name, contents}) => fs.open(path.join(__dirname, `../dist/icons/${name}`), "w", (err, fd) => {
    if (err) {
      throw new Error(err.message);
    }

    fs.write(fd, contents, err => {
      if (err) {
        throw new Error(err.message);
        // console.log(`file ${name} created`);
      }
    });
  }));

  response.files.forEach(({name, contents}) => fs.open(path.join(__dirname, `../dist/icons/${name}`), "w", (err, fd) => {
    if (err) {
      throw new Error(err.message);
    }

    fs.write(fd, contents, err => {
      if (err) {
        throw new Error(err.message);
        // console.log(`file ${name} created`);
      }
    });
  }));

  // console.log(response.images);   // Array of { name: string, contents: <buffer> }
  // console.log(response.files);    // Array of { name: string, contents: <string> }
  // console.log(response.html);     // Array of strings (html elements)

  writeHead(response.html.join("\n"));
};

favicons(source, configuration, callback);