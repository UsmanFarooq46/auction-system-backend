let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized");
  }
  return ioInstance;
};

module.exports = {
  setIO,
  getIO,
};
