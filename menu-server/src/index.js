require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const {
  options,
  fonts,
  align,
  sansSerif,
  serif,
  monospace,
} = require("./options");
const cors = require("cors");

app.use(cors());

app.get("/options", (req, res) => {
  const search = req.query.search || "";
  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(search.toLowerCase())
  );

  res.status(200).json(filteredOptions);
});

app.get("/fonts", (req, res) => {
  const search = req.query.search || "";
  const filteredFonts = fonts.filter((font) =>
    font.text.toLowerCase().includes(search.toLowerCase())
  );
  res.status(200).json(filteredFonts);
});

app.get("/align", (req, res) => {
  const search = req.query.search || "";
  const filteredAlign = align.filter((align) =>
    align.text.toLowerCase().includes(search.toLowerCase())
  );
  res.status(200).json(filteredAlign);
});

app.get("/fonts/:font", (req, res) => {
  const search = req.query.search || "";
  const { font } = req.params;
  if (font === "sans-serif") {
    const filteredSansSerif = sansSerif.filter((sansSerif) =>
      sansSerif.text.toLowerCase().includes(search.toLowerCase())
    );
    res.status(200).json(filteredSansSerif);
  } else if (font === "serif") {
    const filteredSerif = serif.filter((serif) =>
      serif.text.toLowerCase().includes(search.toLowerCase())
    );
    res.status(200).json(filteredSerif);
  } else if (font === "monospace") {
    const filteredMonospace = monospace.filter((monospace) =>
      monospace.text.toLowerCase().includes(search.toLowerCase())
    );
    res.status(200).json(filteredMonospace);
  } else {
    res.status(404).json({ error: "Font not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
