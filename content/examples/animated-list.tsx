"use client";

import { Button } from "@base-ui/react/button";

import { useRef, useState } from "react";
import { AnimatedList } from "../../registry/animations/content/animated-list";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [items, setItems] = useState([{ id: 1, title: "Review motion" }, { id: 2, title: "Share the preview" }]);
  const nextId = useRef(3);
  return <div><div style={{ display: "flex", gap: 12 }}><Button type="button" disabled={items.length >= 5} onClick={() => { const id = nextId.current++; setItems([...items, { id, title: "Task " + id }]); }}>Add task</Button><Button type="button" disabled={!items.length} onClick={() => setItems(items.slice(0, -1))}>Remove last</Button></div>
    <p aria-live="polite">{items.length} tasks</p><AnimatedList duration={.2 / speed} reducedMotion={reducedMotion} items={items} getKey={(item) => item.id} renderItem={(item) => <p style={{ padding: 12, marginBlock: 8, background: "white", borderRadius: 8 }}>{item.title}</p>} style={{ listStyle: "none", padding: 0, minHeight: 180 }} role="list" />
  </div>;
}
