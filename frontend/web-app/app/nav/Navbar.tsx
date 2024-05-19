import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { FaGithub } from "react-icons/fa";
import { getCurrentUser } from "../actions/authActions";
import UserActions from "./UserActions";
import LoginActions from "./LoginActions";


const Navbar =  async() => {
  const user = await getCurrentUser() //{username:"Jame",id:"12345"}


  return (
    <header className="sticky top-0 z-50 lg:flex justify-between bg-white p-5 text-gray-800 shadow-md items-center">
      <div className="flex justify-between w-full">
          <Logo />
          <Search vizbility="hidden md:flex  w-[60%]  "/>
          {user ? <UserActions user={user}/> : <LoginActions />}
      </div>
      <Search vizbility="md:hidden mt-2 w-full"/>
    </header>
  )
}

export default Navbar
