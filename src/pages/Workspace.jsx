import React from 'react';
import ChatWindow from '../components/workspace/ChatWindow';
import ChatInput from '../components/workspace/ChatInput';
import NoticeBanner from '../components/workspace/NoticeBanner';

export const Workspace = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <NoticeBanner />
      {/* Central Chat View */}
      <ChatWindow />

      {/* Bottom Centered AI Command Bar */}
      <ChatInput />
    </div>
  );
};

export default Workspace;
