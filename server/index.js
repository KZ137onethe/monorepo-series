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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});