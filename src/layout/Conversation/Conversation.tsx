import React, { ReactElement, useCallback, useEffect, useState } from "react";
import ResponsiveLogo from "../../contents/ResponsiveLogo";
import WelcomeIntro from "../../contents/WelcomeIntro";
import ZackHeadTags from "../ZackHeadTags";
import useConversationMemory from "./ConversationMemory";
import ConversationStopContents from "./ConversationStop/ConversationStopContents";
import usePromptCalculator from "./PromptCalculator";
import RenderedConversation from "./RenderedConversation";

interface Props {
  path: string;
  contents: React.ReactElement;
}

const Conversation = ({ path, contents: baseContents }: Props) => {
  const [lastLoggedPath, setLastLoggedPath] = useState<string | undefined>(undefined);

  const [headTags, setHeadTags] = useState<React.ReactElement>(<ZackHeadTags />);

  let foundHeadTags: React.ReactElement | undefined;
  let contents: React.ReactElement = baseContents;

  if (baseContents.type === React.Fragment) {
    const { children } = baseContents.props as React.PropsWithChildren<unknown>;
    if (Array.isArray(children)) {
      const headTagResult: ReactElement = children.find(
        (n) => React.isValidElement(n) && n.type === ZackHeadTags
      ) as ReactElement;
      if (headTagResult) {
        foundHeadTags = headTagResult;
        setHeadTags(headTagResult);
        contents = <>{children.filter((n) => n !== headTagResult)}</>;
      }
    }
  }

  const contentsAreEmptyFragment =
    contents.type === React.Fragment &&
    !(contents.props as React.PropsWithChildren<unknown>).children;

  const convo = useConversationMemory(contentsAreEmptyFragment ? { page: contents } : undefined);
  const blockCount = convo.stack.length + 2; // 2 for logo and welcome

  const nextQuestions = usePromptCalculator(convo.madeChoiceIds, convo.stack);

  useEffect(() => {
    if (path !== lastLoggedPath && !contentsAreEmptyFragment) {
      setLastLoggedPath(path);
      convo.handleNavigation(contents);
    }
  }, [path, lastLoggedPath, contents, contentsAreEmptyFragment, convo]);

  const getBlock = useCallback(
    (ind: number): React.ReactNode => {
      const stackInd = ind - 2;

      if (ind === 0) {
        return <ResponsiveLogo />;
      } else if (ind === 1) {
        return <WelcomeIntro />;
      } else {
        return <ConversationStopContents stop={convo.stack[stackInd]} />;
      }
    },
    [convo]
  );

  const conversationClasses = [
    "conversation-flow",
    "min-h-full",
    "col-span-12",
    "md:col-span-8",
    "md:col-start-2",
    "lg:col-start-0",
    "lg:col-span-7",
    "flex",
    "flex-col",
    "justify-end",
    "content-start",
    "relative"
  ].join(" ");

  return (
    <>
      {foundHeadTags ?? headTags}
      <div className="container grid grid-cols-12 gap-4 min-h-screen mx-auto px-2 md:px-1">
        <RenderedConversation
          staticRenderUntilIndex={0}
          className={conversationClasses}
          blockCount={blockCount}
          getBlock={getBlock}
          choices={nextQuestions}
          onChoice={convo.addToStack}
        />
      </div>
    </>
  );
};

export default Conversation;
