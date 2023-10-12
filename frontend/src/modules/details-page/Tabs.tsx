export type Tab = {
    label: string;
    key: string;
    isActive: boolean;
    onClick: (key: string) => void;
};

type TabsProps = {
    tabs: Tab[];
};

const Tabs: React.FC<TabsProps> = ({ tabs }) => (
    <nav className="space-x-8 font-bold text-[#8B8B8B]">
        {tabs.map((tab) => (
            <button
                key={tab.key}
                onClick={() => tab.onClick(tab.key)}
                className={`-mb-[1px] pb-2 ${
                    tab.isActive ? 'border-b border-[#4253F0] text-[#4253F0]' : ''
                }`}
            >
                {tab.label}
            </button>
        ))}
    </nav>
);

export default Tabs;
