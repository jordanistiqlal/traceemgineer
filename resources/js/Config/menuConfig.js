import HomeIcon from '@/Assets/icons/home-icon.png';
import ProjectIcon from '@/Assets/icons/project-icon.png';
import EngineerIcon from '@/Assets/icons/engineer-icon.png';
import DatabaseIcon from '@/Assets/icons/database-icon.png';
import LocationIcon from '@/Assets/icons/location-icon.png';

export const Menu = [
    { icon: LocationIcon, name: "Track Engineer", path: "/track", visible: false },
    { icon: HomeIcon, name: "Home", path: "/" },
    {
        icon: ProjectIcon,
        name: "Project",
        path: "/project",
        submenu: [
            { icon: "⦁", name: "Instalasi", path: "/project/instalasi" },
            { icon: "⦁", name: "Maintanance", path: "/project/maintanance" },
        ],
    },
    { icon: EngineerIcon, name: "Engineer", path: "/engineer" },
    {
        icon: DatabaseIcon,
        name: "Master Data",
        path: "/masterdata",
        submenu: [
            { icon: "⦁", name: "User", path: "/masterdata/user" },
            { icon: "⦁", name: "Project", path: "/masterdata/project" },
            { icon: "⦁", name: "Ticket", path: "/masterdata/ticket" },
            { icon: "⦁", name: "Task", path: "/masterdata/task" },
        ],
    },
];

export const getActiveMenu = (url, menuList = Menu) => {
    for (const menu of menuList) {
        if (menu.submenu) {
            const activeSubmenu = menu.submenu.find(sub => 
                url === sub.path || url.startsWith(sub.path + "/")
            );
            if (activeSubmenu) {
                return {
                    parentIcon: menu.icon,
                    parentName: menu.name,
                    name: activeSubmenu.name,
                    icon: menu.icon,
                    isSubmenu: true
                };
            }
        }
        
        if (url === menu.path || (url.startsWith(menu.path + "/") && menu.path !== "/")) {
            return {
                name: menu.name,
                icon: menu.icon,
                isSubmenu: false
            };
        }
    }
    
    return { name: "Home", icon: HomeIcon, isSubmenu: false };
};