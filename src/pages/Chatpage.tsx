import React, { useState } from 'react';
import { FlexLayout } from '../components/atoms/layouts';
import { Tab } from '../components/atoms/navigation';
import { Button } from '../components/atoms/form';
import { Input } from '../components/atoms/form';
import { ChevronLeft } from 'lucide-react';

const ChatPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('chat');

    const tabItems = [
        {
            id: 'chat',
            label: 'Chat',
            content: (
                <FlexLayout direction="col" className="h-full">
                    <div className="flex-1 p-4 bg-gray-50 h-full">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-gray-800">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                    <div className="border-t bg-white w-full">
                        <Input
                            placeholder="What changes you want to make"
                            className="w-full"
                            variant="default"
                            onChange={() => {console.log('Input changed')}}
                        />
                    </div>
                </FlexLayout>
            )
        },
        {
            id: 'smart-ai',
            label: 'Smart AI',
            content: (
                <div className="p-4">
                    <p>Smart AI content would go here...</p>
                </div>
            )
        }
    ];

    return (
        <FlexLayout direction="col" className="h-full bg-white">
            {/* Header */}
            <FlexLayout 
                direction="row" 
                justify="between" 
                align="center" 
                padding="md" 
                className="border-b bg-white w-full"
            >
                <FlexLayout direction="row" align="center" gap="sm">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-medium text-gray-900">Medirian EXIM</span>
                </FlexLayout>
                <Button variant="ghost" size="sm">
                    Edit
                </Button>
            </FlexLayout>

            {/* Tabs */}
            <Tab
                items={tabItems}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
                size="md"
                className="flex-1 flex flex-col"
            />
        </FlexLayout>
    );
};

export default ChatPage;