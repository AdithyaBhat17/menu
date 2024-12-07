const BASE_URL = process.env.BASE_URL;

console.log(BASE_URL);
const options = [
  {
    id: "1",
    text: "Bold",
    cmd: "cmd + b",
  },
  {
    id: "2",
    text: "Italic",
    cmd: "cmd + i",
  },
  {
    id: "3",
    text: "Underline",
    cmd: "cmd + u",
    disabled: true,
  },
  {
    id: "4",
    text: "Strikethrough",
    cmd: "cmd + shift + x",
  },
  {
    id: "5",
    text: "Superscript",
    cmd: "cmd + shift + up",
  },
  {
    id: "6",
    text: "Subscript",
    cmd: "cmd + shift + down",
  },
  {
    id: "7",
    text: "Align",
    url: `${BASE_URL}/align`,
  },
  {
    id: "8",
    text: "Paragraph styles",
    children: [
      {
        id: "title",
        text: "Title",
        children: [
          {
            id: "heading-1",
            text: "Heading 1",
          },
          {
            id: "heading-2",
            text: "Heading 2",
          },
          {
            id: "heading-3",
            text: "Heading 3",
          },
        ],
      },
      {
        id: "body",
        text: "Body",
      },
    ],
  },
  {
    id: "9",
    text: "Font",
    url: `${BASE_URL}/fonts`,
  },
];

const fonts = [
  {
    id: "1",
    text: "Sans Serif",
    url: `${BASE_URL}/fonts/sans-serif`,
  },
  {
    id: "2",
    text: "Serif",
    url: `${BASE_URL}/fonts/serif`,
  },
  {
    id: "3",
    text: "Monospace",
    url: `${BASE_URL}/fonts/monospace`,
  },
];

const align = [
  {
    id: "1",
    text: "Left",
  },
  {
    id: "2",
    text: "Center",
  },
  {
    id: "3",
    text: "Right",
  },
];

const sansSerif = [
  {
    id: "1",
    text: "Arial",
  },
  {
    id: "2",
    text: "Helvetica",
    disabled: true,
  },
  {
    id: "3",
    text: "Verdana",
  },
];

const serif = [
  {
    id: "1",
    text: "Times New Roman",
  },
  {
    id: "2",
    text: "Georgia",
  },
  {
    id: "3",
    text: "Palatino",
  },
];

const monospace = [
  {
    id: "1",
    text: "Monaco",
  },
  {
    id: "2",
    text: "Consolas",
  },
  {
    id: "3",
    text: "Courier New",
  },
];

module.exports = { options, fonts, align, sansSerif, serif, monospace };
