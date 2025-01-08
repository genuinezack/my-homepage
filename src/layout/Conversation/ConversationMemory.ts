import { useCallback, useState } from "react";
import { ConversationDestination } from "./ConversationPrompt";
import { ConversationStop } from "./ConversationStop";

export interface ConversationMemory {
  stack: ConversationStop[];
  madeChoiceIds: Record<string, boolean>;
  addToStack: (nextStop: ConversationDestination) => any;
  handleNavigation: (newPage: React.ReactNode) => any;
}

const useConversationMemory = (firstStop?: ConversationStop): ConversationMemory => {
  const [pageStack, setPageStack] = useState<ConversationStop[]>(() =>
    firstStop ? [firstStop] : []
  );

  const [madeChoiceIds, setMadeChoiceIds] = useState<Record<string, boolean>>({});

  const handleNavigation = useCallback((newPage: React.ReactNode) => {
    setPageStack((stack) => stack.concat([{ page: newPage }]));
  }, []);

  const addToStack = useCallback((choice: ConversationDestination) => {
    if (choice.prompt) {
      setPageStack((stack) => [...stack, { choice, prompt: choice.prompt }]);
    }
    if (choice.response) {
      setPageStack((stack) => [...stack, { choice, response: choice.response }]);
    }

    setMadeChoiceIds((oldIds): Record<string, boolean> => {
      return {
        ...oldIds,
        [choice.id]: true
      };
    });
  }, []);

  return {
    stack: pageStack,
    madeChoiceIds,
    addToStack,
    handleNavigation
  };
};

export default useConversationMemory;
