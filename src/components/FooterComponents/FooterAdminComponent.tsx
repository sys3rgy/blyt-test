export function FooterAdminComponent() {
	const currentYear = new Date().getFullYear();

	return (
		<>
			<footer className="border-t border-gray-900/10 text-[#9F885E] capitalize bg-black py-10">
				<div className="text-center text-lightGold text-lg md:text-xl py-2">
					all rights reserved © <span className="uppercase">blyt</span> {currentYear}
				</div>
			</footer>
		</>
	);
}
