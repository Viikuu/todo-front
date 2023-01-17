import { Link } from "react-router-dom";

export function Main() {
  return (
    <>
      <div className={"flex h-screen w-full items-center justify-center bg-gray-900 bg-cover"}>
        <Link to={'/login'} className={"pl-2 text-teal-800"}>Login</Link>
        <Link to={'/register'} className={"pl-2 text-teal-800"}>Register</Link>
        <Link to={'/todo'} className={"pl-2 text-teal-800"}>Todos</Link>
      </div>

    </>
  );
}