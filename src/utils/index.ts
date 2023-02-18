export const formatDate = (date: string | Date, time?: "time") => {
  let returnDateString = "";

  // let today = new Date();

  let formatDate = new Intl.DateTimeFormat("en-in").format(new Date(date));

  returnDateString += formatDate;

  let getDay = new Intl.DateTimeFormat("en-in", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
  if (time === "time") {
    returnDateString += " " + getDay;
  }

  return returnDateString.toUpperCase();
};
