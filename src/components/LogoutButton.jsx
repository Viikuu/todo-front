
export function LogoutButton({ handleClick }) {

    return (
        <>
            <div className={"flex flex-row justify-end fixed right-5 top-5 text-white"}>
                <button onClick={handleClick}
                        className={"rounded-2xl border-none bg-teal-800 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"}>X
                </button>
            </div>
        </>
    );
}