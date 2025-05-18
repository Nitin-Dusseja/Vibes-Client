import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

const transformImage = (url = "", width = 100) => {
  const searchString = "upload/";
  const replacementString = `upload/dpr_auto/w_${width}/`;
  let index = url.indexOf(searchString);

  if (index !== -1) {
    // Construct the new URL piece by piece
    const newUrl =
      url.substring(0, index) + // Part before "upload/"
      replacementString + // The replacement string
      url.substring(index + searchString.length); // Part after "upload/"
    return newUrl;
  } else {
    // If "upload/" is not found, return the original URL
    return url;
  }
};

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7Days.unshift(dayName);
  }
  return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
