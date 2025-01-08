import { ReactNode } from "react";
import { ConversationDestination } from "../ConversationPrompt";

export default interface ConversationStop {
  choice?: ConversationDestination;

  prompt?: string;
  response?: string;
  page?: ReactNode;
}
