import React, { use, useState } from 'react';
import { FlexLayout } from '../components/atoms/layouts';
import { Tab } from '../components/atoms/navigation';
import { Button } from '../components/atoms/form';
import { Input } from '../components/atoms/form';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');

    const tabItems = [
        {
            id: 'chat',
            label: 'Chat',
            content: (
                <FlexLayout direction="col" className="h-full" gap="none" padding="none">
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
                            className="w-full rounded-none"
                            variant="default"
                            disabled
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
        <FlexLayout direction="col" className="h-full bg-white p-0 gap-0">
            {/* Header */}
            <FlexLayout 
                direction="row" 
                justify="between" 
                align="center" 
                padding="sm" 
                className="border-b pb-[13px] bg-white w-full rounded-none"
            >
                <FlexLayout direction="row" align="center" gap="sm">
                    <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => navigate("/prompt")}/>
                    <span className="text-lg font-medium text-gray-900">Medirian EXIM</span>
                </FlexLayout>
                {/* <Button variant="ghost" size="sm">
                    Edit
                </Button> */}
            </FlexLayout>

            {/* Tabs */}
            <Tab
                items={tabItems}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="simple"
                size="md"
                fullWidth={true}
                centered={true}
                className="flex-1 flex flex-col"
            />
        </FlexLayout>
    );
};

export default ChatPage;