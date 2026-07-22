"use client";

import { useEffect, useMemo, useState } from "react";
import { Entry, SUB_MAP, TOPIC_LABELS, sourceLabel } from "@/lib/topics";

const TOPIC_OPTIONS = [
  { value: "all", label: "태그 전체" },
  { value: "uxui", label: "UXUI" },
  { value: "research", label: "리서치" },
  { value: "data", label: "데이터분석" },
  { value: "planning", label: "기획·PRD" },
  { value: "dev", label: "개발" },
  { value: "ai", label: "AI" },
  { value: "collab", label: "협업툴" },
  { value: "workflow", label: "워크플로우" },
  { value: "cli", label: "터미널·CLI" },
  { value: "vibe", label: "바이브코딩" },
  { value: "etc", label: "기타" },
];

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMain, setActiveMain] = useState("all");
  const [activeSub, setActiveSub] = useState("all");
  const [activeSort, setActiveSort] = useState<"desc" | "asc">("desc");
  const [activeTopic, setActiveTopic] = useState("all");
  const [openDd, setOpenDd] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const closeAll = () => setOpenDd(null);
    document.addEventListener("click", closeAll);
    return () => document.removeEventListener("click", closeAll);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries
      .filter((e) => {
        const mainMatch = activeMain === "all" || e.main === activeMain;
        const subMatch =
          activeMain === "all" || activeSub === "all" || e.sub === activeSub;
        const topicMatch = activeTopic === "all" || e.topic === activeTopic;
        const text = `${e.title} ${e.content}`.toLowerCase();
        const textMatch = q === "" || text.includes(q);
        return mainMatch && subMatch && topicMatch && textMatch;
      })
      .sort((a, b) => {
        const da = new Date(a.entry_date).getTime();
        const db = new Date(b.entry_date).getTime();
        return activeSort === "desc" ? db - da : da - db;
      });
  }, [entries, search, activeMain, activeSub, activeSort, activeTopic]);

  async function handleDelete(id: string) {
    const ok = window.confirm("이 북마크를 완전히 삭제할까요? 되돌릴 수 없습니다.");
    if (!ok) return;
    const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setToast("삭제했습니다");
    } else {
      setToast("삭제에 실패했습니다");
    }
  }

  async function handleCopy(entry: Entry) {
    await navigator.clipboard.writeText(entry.content);
    setCopiedId(entry.id);
    setToast("복사했습니다");
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleExport(format: "csv" | "md") {
    window.location.href = `/api/export?format=${format}`;
    setOpenDd(null);
  }

  const subOptions = activeMain === "all" ? [] : SUB_MAP[activeMain] ?? [];

  return (
    <>
      <header>
        <div className="title-row">
          <h1>AI 대화 아카이빙</h1>
          <div className="dd" onClick={(e) => e.stopPropagation()}>
            <span
              className="dd-trigger export-btn"
              role="button"
              tabIndex={0}
              onClick={() => setOpenDd(openDd === "export" ? null : "export")}
            >
              내보내기
              <svg
                className="dd-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
            <div className={`dd-menu ${openDd === "export" ? "open" : ""}`}>
              <div className="dd-item" onClick={() => handleExport("csv")}>
                CSV로 저장
              </div>
              <div className="dd-item" onClick={() => handleExport("md")}>
                Markdown으로 저장
              </div>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <input
            id="search"
            type="text"
            placeholder="제목/내용 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="row-with-dd">
            <div className="tag-row main-row">
              {["all", "claude", "chatgpt"].map((m) => (
                <button
                  key={m}
                  className={`tag-filter main-filter ${
                    activeMain === m ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveMain(m);
                    setActiveSub("all");
                  }}
                >
                  {m === "all" ? "전체" : m === "claude" ? "Claude" : "ChatGPT"}
                </button>
              ))}
            </div>

            <div className="dd-group" onClick={(e) => e.stopPropagation()}>
              <div className="dd">
                <span
                  className="dd-trigger"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenDd(openDd === "sort" ? null : "sort")}
                >
                  {activeSort === "desc" ? "최신순" : "오래된순"}
                  <svg
                    className="dd-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6l6 -6" />
                  </svg>
                </span>
                <div className={`dd-menu ${openDd === "sort" ? "open" : ""}`}>
                  <div
                    className={`dd-item ${activeSort === "desc" ? "active" : ""}`}
                    onClick={() => {
                      setActiveSort("desc");
                      setOpenDd(null);
                    }}
                  >
                    최신순
                  </div>
                  <div
                    className={`dd-item ${activeSort === "asc" ? "active" : ""}`}
                    onClick={() => {
                      setActiveSort("asc");
                      setOpenDd(null);
                    }}
                  >
                    오래된순
                  </div>
                </div>
              </div>

              <div className="dd">
                <span
                  className="dd-trigger"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenDd(openDd === "topic" ? null : "topic")}
                >
                  {TOPIC_OPTIONS.find((t) => t.value === activeTopic)?.label}
                  <svg
                    className="dd-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6l6 -6" />
                  </svg>
                </span>
                <div className={`dd-menu ${openDd === "topic" ? "open" : ""}`}>
                  {TOPIC_OPTIONS.map((t) => (
                    <div
                      key={t.value}
                      className={`dd-item ${
                        activeTopic === t.value ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveTopic(t.value);
                        setOpenDd(null);
                      }}
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {subOptions.length > 0 && (
            <div className="tag-row sub-row">
              <button
                className={`tag-filter sub-filter ${
                  activeSub === "all" ? "active" : ""
                }`}
                onClick={() => setActiveSub("all")}
              >
                전체
              </button>
              {subOptions.map((s) => (
                <button
                  key={s.key}
                  className={`tag-filter sub-filter ${
                    activeSub === s.key ? "active" : ""
                  }`}
                  onClick={() => setActiveSub(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main>
        {!loading && filtered.length === 0 && (
          <div id="empty-state">
            {entries.length === 0
              ? "아직 저장된 북마크가 없습니다."
              : "검색/필터 결과가 없습니다."}
          </div>
        )}

        {filtered.map((entry) => (
          <div className="entry" key={entry.id}>
            <div className="entry-meta">
              <div className="entry-meta-left">
                <span className="entry-date">
                  {entry.entry_date.replaceAll("-", ".")}
                </span>
                <span className="entry-source">
                  {sourceLabel(entry.main, entry.sub)}
                </span>
              </div>
              <div className="entry-actions">
                <button className="copy-btn" onClick={() => handleCopy(entry)}>
                  {copiedId === entry.id ? "복사됨" : "복사"}
                </button>
                <button
                  className="del-btn"
                  onClick={() => handleDelete(entry.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="entry-title">{entry.title}</div>
            <div className="entry-content">{entry.content}</div>
            <span className="entry-topic-badge">
              {TOPIC_LABELS[entry.topic] ?? entry.topic}
            </span>
          </div>
        ))}
      </main>

      <div id="toast" className={toast ? "show" : ""}>
        {toast}
      </div>
    </>
  );
}
