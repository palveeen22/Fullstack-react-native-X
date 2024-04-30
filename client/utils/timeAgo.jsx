// utils/timeAgo.jsx

const timeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const differenceInSeconds = Math.floor((now - createdAt) / 1000);

  switch (true) {
    case differenceInSeconds < 60:
      return `${differenceInSeconds}s`;
    case differenceInSeconds < 3600:
      return `${Math.floor(differenceInSeconds / 60)}m`;
    case differenceInSeconds < 86400:
      return `${Math.floor(differenceInSeconds / 3600)}h`;
    case differenceInSeconds < 2592000:
      return `${Math.floor(differenceInSeconds / 86400)}d`;
    case differenceInSeconds < 31536000:
      return `${Math.floor(differenceInSeconds / 2592000)}mo`;
    default:
      return `${Math.floor(differenceInSeconds / 31536000)}y`;
  }
};

export default timeAgo;
