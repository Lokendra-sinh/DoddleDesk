import Toolbar from "../Toolbar/Toolbar"

const Navbar = () => {
  return (
    <div className="p-4 flex justify-between absolute w-full h-auto left-0 top-0 z-1000 bg-gray-200">
        <div className="">
            <h3 className="text-xl font-bold">DoddleDesk</h3>
        </div>

        <Toolbar />

        <button className="bg-purple-300 px-3 rounded-md">
            <p className="font-medium">sign in/up</p>
        </button>
    </div>
  )
}

export default Navbar