interface ButtonComponent1 {
    leftSide?: any;
    middleSide: any;
    rightSide?: any;
    customSectionCSS?: string;
    customButtonCSS?: string;
    onClick?: () => void;
}

const ButtonComponent1: React.FC<ButtonComponent1> = ({ leftSide, middleSide, rightSide, customSectionCSS, customButtonCSS, onClick }) => {
    return (
        <>
            <section onClick={onClick} className={`button-component-1 ${customSectionCSS}`}>
                <div className={`${customButtonCSS} flex items-center text-center uppercase text-base text-white bg-[#9F885E] mx-auto w-fit px-4 py-2 rounded-lg drop-shadow-lg gap-2`}>
                    <div className={`${!leftSide ? "hidden" : ""} left-side`}>{leftSide}</div>
                    <div className={`${!middleSide ? "hidden" : ""} middle-side`}>{middleSide}</div>
                    <div className={`${!rightSide ? "hidden" : ""} right-side`}>{rightSide}</div>
                </div>
            </section>
        </>
    )
}

export default ButtonComponent1;