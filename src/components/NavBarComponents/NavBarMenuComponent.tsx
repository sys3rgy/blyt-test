/* eslint-disable @next/next/no-img-element */
import { ServiceCategoriesList } from "@/interfaces/MerchantDashboardInterface";
import { FC, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { DataContext } from "@/context/DataContext";

interface NavBarMenuProps {
    closeMenu: () => void;
}

const NavBarMenuComponent: FC<NavBarMenuProps> = ({ closeMenu }) => {

    const { servicesCategoryList } = useContext(DataContext);

    const handleLinkClick = () => {
        // Close the menu when a link is clicked
        closeMenu();
    };

    const [servicesCategory, setservicesCategory] = useState<ServiceCategoriesList[]>([]);

    //! Storing service categories list in cache for 5 minutes
    async function fetchServicesCategoriesList() {
        const sortedCategories = servicesCategoryList.map((category: { category: string; }) => ({
            ...category,
            sortByCategory: category.category.replace(/ /g, '_').replace(/&/g, '-')
        }));
        setservicesCategory(sortedCategories);
    }

    useEffect(() => {
        fetchServicesCategoriesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [servicesCategoryList])



    return (
        <>
            <div className="grid md:grid-cols-3 teeny:grid-cols-2 grid-cols-1 bg-white px-6 py-4 gap-x-16 gap-y-3 rounded-lg drop-shadow-lg z-[100] md:mt-2 mt-4">
                {servicesCategory.map((items) => {
                    return (
                        <Link onClick={handleLinkClick} href={`/services?category=${items.category.replace(/ /g, '_').replace(/&/g, '-')}`} key={items._id} className="text-[#4D4D4D] font-semibold hover:text-black flex items-center text-sm gap-1 cursor-pointer hover:underline hover:decoration-[#9F885E] decoration-2 underline-offset-4">
                            <img className="min-w-[20px] h-auto" width={20} height={20} src={items.link} alt="" />
                            {items.category}
                        </Link>
                    )
                })}
            </div>
        </>
    )
}

export default NavBarMenuComponent;