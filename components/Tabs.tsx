'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tab, TabList, TabPanel, Tabs as AriaTabs } from 'react-aria-components';

type TabsProps = {
  tabs: { id: string; label: string }[];
  children: React.ReactNode;
  defaultTab?: string;
};

export function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [selectedKey, setSelectedKey] = useState<any>(defaultTab || tabs[0].id);

  return (
    <AriaTabs
      selectedKey={selectedKey}
      onSelectionChange={setSelectedKey}
      className="w-full"
    >
      <TabList className="flex gap-1.5 mb-5 border-b border-gray-100 pb-px">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            className={({ isSelected }) =>
              cn(
                'px-4 py-2 text-sm font-medium transition-all relative outline-none cursor-pointer',
                isSelected
                  ? 'text-[#7a1f32] font-semibold border-b-2 border-[#7a1f32]'
                  : 'text-gray-500 hover:text-gray-800'
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {children}
    </AriaTabs>
  );
}

type TabPanelProps = {
  id: string;
  children: React.ReactNode;
};

export function TabPanelComponent({ id, children }: TabPanelProps) {
  return <TabPanel id={id} className="outline-none">{children}</TabPanel>;
}
