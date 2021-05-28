export const SET_SIZE = "app/SET_SIZE";
export const SET_LENGTH = "app/SET_LENGTH";
export const SET_SIZE_LENGTH = "app/SET_SIZE_LENGTH";

export const setSize = size => {
  return {
    type: SET_SIZE,
    size: size
  };
};

export const setLength = length => {
  return {
    type: SET_LENGTH,
    length: length
  };
};

export const setSizeLength = (size, length) => {
  return {
    type: SET_SIZE_LENGTH,
    length: length,
    size: size,
  };
};