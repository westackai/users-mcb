"use client";
  

import React from 'react'
import { Provider } from 'react-redux'
import LayoutWraper from './LayoutWraper'
import Store from '@/lib/Redux/store/store'


interface LayoutProviderProps {
    children: React.ReactNode
}

const LayoutProvider = ({ children }: LayoutProviderProps) => {
  return (
    <div>
        <Provider store={Store}>
            <LayoutWraper>
                {children}
            </LayoutWraper>
        </Provider>
    </div>
  )
}

export default LayoutProvider