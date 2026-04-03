"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import PWAInstallButton from "../PWAButton";
import PWARegister from "../PWARegister";

import {NotificationProvider, useNotification} from "../NotificationComponent";
import { supabase } from "../../../lib/supabase";

interface Todo {
    id: number ;
    text: string;
    completed: boolean;
    createdAt: string;
}

function LayoutContent({ children}: { children: React.ReactNode}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { sendNotification }= useNotification();

    //setup supabase realtime
    useEffect(() => {
        const channel = supabase.channel('layout-notifications')
        .on (
            'postgres_changes',
            { event: '*', schema: 'public', table: 'todos'},
            async (payload) => {
                console.log('Change received in layout', payload);

                //kirim notifikasi
                if (payload.eventType === 'INSERT' && payload.new) {
                    const todo = payload.new as Todo;
                    await sendNotification({
                        title:'New Todo Addeed',
                        body: `${todo.text}`,
                        redirectUrl: '/realtime-db'
                    });
                } else if (payload.eventType === 'UPDATE' && payload.new) {
                    const todo = payload.new as Todo;
                    await sendNotification({
                        title: todo.completed ? 'Todo Completed' : 'Todo Update',
                        body: `${todo.text}`,
                        redirectUrl: '/realtime-db'
                    })
                } else if (payload.eventType === 'UPDATE' && payload.new) {
                    const todo = payload.old as Todo;
                    await sendNotification({
                        title: 'Todo Delected',
                        body: todo.text ?  `${todo.text}` : 'A todo item was deleted',
                        redirectUrl: '/realtime-db'
                    });
                }
            } 
        )
      .on('system', {}, (payload) => {
        if (payload.extension === 'postgres_changes' && payload.status === 'ok') { 
            sendNotification({
                title: 'Realtime DB Connected',
                body: 'Connected to Supabase Realtime successfully.',
                redirectUrl: '/realtime-db'
            });

            setTimeout(() => {

            }, 3000);
        }
      })
      .subscribe();

      return ()=> {
        supabase.removeChannel(channel);
      };
}, [sendNotification]);

const toggleSidebar = () => {
    setSidebarOpen (!sidebarOpen)
};

const closeSidebar = () => {
    setSidebarOpen (false);
}; 

return (
    <div className="flex min-h-screen">
        <PWARegister />
        <PWAInstallButton />
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
        <div className="flex flex-col flex-1">
            <Header brandName="MyApp" onBrandClick={toggleSidebar}/>
            <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
            <Footer />
        </div>
    </div>
  )
}
export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <LayoutContent>{children}</LayoutContent>
        </NotificationProvider>
    )
}