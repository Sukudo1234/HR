import React, { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import { fmtTime } from '../../utils/helpers';

const ChatModal = ({
  onClose,
  conversations,
  messages,
  employees,
  currentUser,
  onSend,
  openNewChat,
  selectConv,
  selectedConvId,
  draft
}) => {
  const myConvs = conversations.filter(c => c.memberIds.includes(currentUser.id));
  const selected = myConvs.find(c => c.id === selectedConvId) || myConvs[0];
  const convMsgs = messages.filter(m => m.conversationId === (selected?.id));

  const convTitle = (c) => {
    if (!c) return "Chat";
    if (c.type === "group") return c.name;
    const others = c.memberIds.filter(id => id !== currentUser.id);
    const user = employees.find(u => u.id === others[0]);
    return user ? user.name : "Direct Chat";
  };

  const [text, setText] = useState(draft || "");

  const send = () => {
    const t = text.trim();
    if (!t || !selected) return;
    onSend(selected.id, t);
    setText("");
  };

  return (
    <Modal title="Chat" onClose={onClose} maxWidth="max-w-5xl">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 border border-[var(--clr-border)] rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Conversations</div>
            <button className="btn btn-primary px-3 py-1.5" onClick={openNewChat}>
              New
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {myConvs.length === 0 && (
              <div className="text-[var(--clr-muted)] text-sm">No chats yet.</div>
            )}
            {myConvs.map(c => (
              <button
                key={c.id}
                className={`w-full text-left border rounded-lg p-2 ${
                  selected?.id === c.id
                    ? "bg-[var(--clr-hover)] border-[var(--ring)]"
                    : "border-[var(--clr-border)]"
                }`}
                onClick={() => selectConv(c.id)}
              >
                <div className="font-semibold">{convTitle(c)}</div>
                <div className="text-xs text-[var(--clr-muted)]">
                  {c.type === "group" ? "Group" : "Direct"} - {c.memberIds.length} members
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 border border-[var(--clr-border)] rounded-xl flex flex-col h-[60vh]">
          <div className="px-4 py-3 border-b border-[var(--clr-border)] font-semibold">
            {convTitle(selected)}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(!selected || convMsgs.length === 0) && (
              <div className="text-[var(--clr-muted)]">No messages yet.</div>
            )}
            {convMsgs.map(m => {
              const mine = m.senderId === currentUser.id;
              const sender = employees.find(u => u.id === m.senderId);
              return (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-xl p-3 ${
                    mine
                      ? "ml-auto bg-[var(--clr-hover)]"
                      : "bg-white border border-[var(--clr-border)]"
                  }`}
                >
                  <div className="text-xs text-[var(--clr-muted)] mb-1">
                    {sender?.name} - {fmtTime(m.date)}
                  </div>
                  <div className="text-sm">{m.body}</div>
                </div>
              );
            })}
          </div>
          <div className="p-3 border-t border-[var(--clr-border)] flex items-center gap-2">
            <input
              className="input"
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") send();
              }}
            />
            <button className="btn btn-primary px-4 py-2" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ChatModal.displayName = 'ChatModal';

export default ChatModal;

