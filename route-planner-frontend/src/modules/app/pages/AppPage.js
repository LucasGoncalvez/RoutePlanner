import React from 'react'
import ScrollToTop from '../components/ScrollToTop';
import RootRoutes from 'src/root/rootRoutes';

function AppPage() {
    return (
        <div className="flex h-full">
            <div className="flex flex-col w-full overflow-auto">
                <ScrollToTop>
                    <div className="px-8">
                        <RootRoutes />
                    </div>
                </ScrollToTop>
            </div>
        </div>
    );
};

export default AppPage;