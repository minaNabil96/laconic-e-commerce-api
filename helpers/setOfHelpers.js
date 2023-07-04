const slugify = require("slugify");

exports.arabicFullDate = () => {
  const date = new Date();
  const arabicDate = new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
  }).format(date);
  return arabicDate;
};

exports.slugHandler = (slug) => {
  const slugSentence =
    slug &&
    typeof slug === "string" &&
    slugify(slug, {
      lower: true,
    });
  return slugSentence;
};
