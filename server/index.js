const express = require("express");
const app = express();

const PORT = 8092
app.get("/fruit", (req, res) => {
  res.status(200).json({
    data: {
      name: "apple",
      color: "red",
      price: 10
    },
    code: "200",
    message: "success"
  })
})

import("chalk").then((chalkModule) => {
  const chalk = chalkModule.default;
  app.listen(PORT, () => {
    console.log(
      [
        chalk.bold("  Express Server is start!"),
        chalk.green(`  -> ${chalk.bold("Local")}:   ${chalk.blue("http://localhost:" + PORT + "/")}`)
      ].join('\n'))
  });
})

