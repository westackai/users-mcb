'use client'

import React from 'react'

interface ChatBotLayoutProps {
    children: React.ReactNode
}

const ChatBotLayout: React.FC<ChatBotLayoutProps> = ({ children }) => {
    return (

            <div className="flex-1 w-full h-screen bg-white flex flex-col overflow-hidden">
                {children}
            </div>

    )
}

export default ChatBotLayout
