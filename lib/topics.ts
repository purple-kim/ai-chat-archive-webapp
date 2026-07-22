export const TOPIC_LABELS: Record<string, string> = {
  uxui: "UXUI",
  research: "리서치",
  data: "데이터분석",
  planning: "기획·PRD",
  dev: "개발",
  ai: "AI",
  collab: "협업툴",
  workflow: "워크플로우",
  cli: "터미널·CLI",
  vibe: "바이브코딩",
  etc: "기타",
};

export const SUB_LABELS: Record<string, Record<string, string>> = {
  claude: { chat: "Chat", cowork: "Cowork", "claude-code": "Claude Code" },
  chatgpt: { chat: "Chat", codex: "Codex" },
};

export const SUB_MAP: Record<string, { key: string; label: string }[]> = {
  claude: [
    { key: "chat", label: "Chat" },
    { key: "cowork", label: "Cowork" },
    { key: "claude-code", label: "Claude Code" },
  ],
  chatgpt: [
    { key: "chat", label: "Chat" },
    { key: "codex", label: "Codex" },
  ],
};

export const MAIN_LABELS: Record<string, string> = {
  claude: "Claude",
  chatgpt: "ChatGPT",
};

export function sourceLabel(main: string, sub: string): string {
  const mainLabel = MAIN_LABELS[main] ?? main;
  const subLabel = SUB_LABELS[main]?.[sub] ?? sub;
  return `${mainLabel} · ${subLabel}`;
}

export type Entry = {
  id: string;
  main: string;
  sub: string;
  topic: string;
  title: string;
  content: string;
  entry_date: string;
  created_at: string;
};
