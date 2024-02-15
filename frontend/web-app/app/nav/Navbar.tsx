import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { getCurrentUser } from "../actions/authActions";
import UserActions from "./UserActions";


const Navbar =  async() => {
  const user = await getCurrentUser()


  return (
    <header className="sticky top-0 z-50 lg:flex justify-between bg-white p-5 text-gray-800 shadow-md items-center">
      <div className="flex justify-between items-center w-full">
          <Logo />
          <Search vizbility="hidden md:flex  w-[50%]  "/>
          {user ? <UserActions user={user}/> :
          <LoginButton/>}
      </div>
      <Search vizbility="md:hidden mt-2  w-full"/>
    </header>
  )
}

export default Navbar