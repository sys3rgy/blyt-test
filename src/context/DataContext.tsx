"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { ServiceCategoriesList } from "@/interfaces/MerchantDashboardInterface";
import FetchServicesCategoriesList from "@/components/NavBarComponents/FetchServicesCategoriesList";

// First Context
interface DataContextProps {
	isSessionExist: boolean;
	servicesCategoryList: any;
	user: any;
}

const initialDataContext: DataContextProps = {
	isSessionExist: false,
	servicesCategoryList: null,
	user: null,
};

const DataContext = createContext<DataContextProps>(initialDataContext);

interface DataContextProviderProps {
	children: ReactNode;
}

const DataContextProvider = ({ children }: DataContextProviderProps) => {
	const [isSession, setIsSession] = useState(false);
	const [user, setUser] = useState(null);
	const [servicesCategoryList, setservicesCategoryList] = useState<ServiceCategoriesList[]>([]);

	async function fetchServicesCategoriesList() {
		const response = await FetchServicesCategoriesList();
		setservicesCategoryList(response.serviceCategoriesList);
	}

	async function localSessionCheck() {
		try {
			const response = await axios.get("/api/commonAPIs/localSessionCheck");
			const statusCode = response.data.statusCode;
			setUser(response.data);
			if (statusCode === 404) {
				setIsSession(false);
			} else if (statusCode === 302) {
				setIsSession(true);
			}
		} catch (error) {
			console.error("Error checking local session:", error);
		}
	}

	useEffect(() => {
		localSessionCheck();
		fetchServicesCategoriesList();
	}, []);

	return (
		<DataContext.Provider
			value={{ isSessionExist: isSession, servicesCategoryList: servicesCategoryList, user: user }}
		>
			{children}
		</DataContext.Provider>
	);
};

export { DataContext, DataContextProvider };
