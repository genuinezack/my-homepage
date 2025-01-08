import { useRouter } from "next/dist/client/router";
import { useCallback } from "react";
import { ConversationDestination } from "./ConversationPrompt";
import { ConversationStop } from "./ConversationStop";

const resumePrompts: ConversationDestination[] = [
  {
    id: "resume-0",
    prompt: "Show me your credentials.",
    response: "Coming right up!"
  },
  {
    id: "resume-1",
    prompt: "Are you legit?",
    response: "Too legit to quit! What do you want to know more about?"
  },
  {
    id: "resume-2",
    prompt: "What have you done?",
    response: "A few things. What do you want to know more about?"
  },
  {
    id: "resume-3",
    prompt: "Lemme see your resume.",
    response: "Sure thing. What do you want to know about?"
  },
  {
    id: "resume-4",
    prompt: "What's on your CV?",
    response: "What can I tell you more about?"
  }
];

const workCTA: ConversationDestination = {
  id: "work-cta",
  prompt: "I want to work with you.",
  response: "Ok - drop me a line!"
};

const cancelPrompts: ConversationDestination[] = [
  {
    id: "cancel-0",
    prompt: "Ok. Take me back to the start.",
    href: "/"
  },
  {
    id: "cancel-1",
    prompt: "Done here - take me back home.",
    href: "/"
  },
  {
    id: "cancel-2",
    prompt: "Alright, enough of this, let me restart.",
    href: "/"
  },
  {
    id: "cancel-3",
    prompt: "Cool, thanks. Take me back to the start.",
    href: "/"
  }
];

const contactPrompts: ConversationDestination[] = [
  {
    id: "contact-1",
    prompt: "Can I drop you a question?",
    response: "I love questions! Just pick a channel:"
  },
  {
    id: "contact-2",
    prompt: "Can we get in touch?",
    response: "Sure thing - just pick where:"
  },
  {
    id: "contact-3",
    prompt: "How do I reach you?",
    response: "You have so many options!"
  },
  {
    id: "contact-4",
    prompt: "Want to grab a coffee?",
    response: "Ok - send me a message!"
  }
];

const contactOptions: ConversationDestination[] = [
  {
    id: "chat-mediums-0",
    prompt: "I'll email you",
    href: "mailto:contact@zacksheppard.com"
  },
  {
    id: "chat-mediums-1",
    prompt: "Take me to your Github",
    href: "https://www.github.com/zackdotcomputer"
  },
  {
    id: "chat-mediums-2",
    prompt: "Let's connect on LinkedIn",
    href: "https://www.linkedin.com/in/zacksheppard/"
  },
  {
    id: "chat-mediums-3",
    prompt: "I'll slide into your Twitter DMs",
    href: "https://www.twitter.com/zackdotcomputer"
  }
];

const resumeSections: ConversationDestination[] = [
  {
    id: "experience-0",
    prompt: "Tell me more about your skills.",
    href: "/resume/skills"
  },
  {
    id: "experience-1",
    prompt: "Tell me more about your freelance work.",
    href: "/resume/freelance"
  },
  {
    id: "experience-2",
    prompt: "Tell me more about your experience before that.",
    href: "/resume/past"
  }
];

const normcorePrompts: ConversationDestination[] = [
  {
    id: "normcore-0",
    prompt: "This is weird. Show me a normal homepage.",
    href: "/normcore"
  },
  {
    id: "normcore-1",
    prompt: "I don't get this. Show me a normal homepage.",
    href: "/normcore"
  },
  {
    id: "normcore-2",
    prompt: "Less conversation. More static html.",
    href: "/normcore"
  },
  {
    id: "normcore-3",
    prompt: "Give me the normcore site instead.",
    href: "/normcore"
  }
];

export default function usePromptCalculator(
  pastChoices: Record<string, boolean>,
  stack: ConversationStop[]
): ConversationDestination[] {
  const { pathname } = useRouter();

  const pickOneFrom = useCallback(
    (options: ConversationDestination[]): ConversationDestination => {
      const seed = Math.floor(Math.random() * 25);
      const filtered = options.filter((p) => !pastChoices[p.id]);
      if (filtered.length === 0) {
        return options[seed % options.length];
      } else {
        return filtered[seed % filtered.length];
      }
    },
    [pastChoices]
  );

  // First we calculate the center prompts:
  let lastChoice: ConversationDestination | undefined;

  for (let i = stack.length - 1; i >= 0; i -= 1) {
    if (stack[i].choice) {
      lastChoice = stack[i].choice;
      break;
    }
  }

  const lastChoiceWasContact =
    lastChoice?.id === "work-cta" ||
    lastChoice?.id.startsWith("contact-") ||
    pathname.endsWith("contact");

  const lastChoiceWasResume =
    lastChoice?.id.startsWith("resume-") ||
    lastChoice?.id.startsWith("experience-") ||
    pathname.startsWith("/resume");

  const lastChoiceWasHomepage =
    (lastChoice === undefined || lastChoice.href === "/") &&
    !lastChoiceWasContact &&
    !lastChoiceWasResume;

  let centerPrompts: ConversationDestination[];

  if (lastChoiceWasContact) {
    centerPrompts = contactOptions;
  } else if (lastChoiceWasResume) {
    centerPrompts = [...resumeSections, workCTA];
  } else {
    const resumePrompt = lastChoice?.id.startsWith("resume-") ? [] : [pickOneFrom(resumePrompts)];

    centerPrompts = [workCTA, ...resumePrompt, pickOneFrom(contactPrompts)];
  }

  let exitPrompt: ConversationDestination;
  if (lastChoiceWasHomepage) {
    exitPrompt = pickOneFrom(normcorePrompts);
  } else {
    exitPrompt = pickOneFrom(cancelPrompts);
  }

  return [...centerPrompts, exitPrompt];
}
