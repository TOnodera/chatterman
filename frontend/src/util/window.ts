import message from '../Domain/Message/Message';
const onScroll = (room_id: string) => {
  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop == 0) {
    message.requireMoreMessages(room_id);
  }
};

const toBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    left: 0
  });
};

export {
  onScroll,
  toBottom
};
