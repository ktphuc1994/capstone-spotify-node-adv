type ConversationUser = {
  id: number;
  socketId: string;
};
type ActiveUser = ConversationUser & {
  isActive: boolean;
};

export { ActiveUser, ConversationUser };
