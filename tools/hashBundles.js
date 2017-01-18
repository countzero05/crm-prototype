import fs from "fs";
import md5file from "md5-file/promise";
import path from "path";

fs.readFile(path.join(__dirname, "../dist/index.html"), "utf8", (err,data) => {
  if (err) {
    return console.log(err);
  }

  Promise.all([md5file(path.join(__dirname, "../dist/bundle.css")), md5file(path.join(__dirname, "../dist/bundle.js"))]).then(([cssHash, jsHash]) => {
    let result = data.replace(/bundle\.css/g, `bundle.css?v=${cssHash}`).replace(/bundle\.js/g, `bundle.js?v=${jsHash}`);

    fs.writeFile(path.join(__dirname, "../dist/index.html"), result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });

});