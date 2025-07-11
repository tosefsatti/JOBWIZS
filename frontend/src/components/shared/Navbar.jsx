import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X, Bell } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const incoming = useSelector(state => state.requests.receivedRequests)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Logout failed')
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev)
    }

    const linkClass = ({ isActive }) =>
        `text-lg 
     font-medium 
     transition-transform duration-300 ease-in-out 
     hover:text-[#6A38C2] 
     hover:scale-110 
     hover:underline 
     hover:font-semibold 
     ${isActive ? 'text-[#6A38C2] font-semibold underline scale-110' : 'text-gray-800'}`

    return (
        <div className="bg-gradient-to-b from-[#3f87a6] to-[#fed6ab] sticky top-0 z-50 shadow-md">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                <h1 className="text-2xl font-bold">
                    Job<span className="text-[#F83002]">Wizs</span>
                </h1>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-5">
                        {user ? (
                            user.role === 'recruiter' ? (
                                <>
                                    <li><NavLink to="/admin/companies" className={linkClass}>Companies</NavLink></li>
                                    <li><NavLink to="/admin/jobs" className={linkClass}>Jobs</NavLink></li>
                                </>
                            ) : (
                                <>
                                    <li className="relative">
                                        <NavLink to="/notifications" className={linkClass}>
                                            <Bell size={24} />
                                            {incoming.length > 0 && (
                                                <span className="absolute -top-1 -right-5 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {incoming.length}
                                                </span>
                                            )}
                                        </NavLink>
                                    </li>
                                    <li><NavLink to="/" className={linkClass} >Home</NavLink></li>
                                    <li><NavLink to="/jobs" className={linkClass}>Jobs</NavLink></li>
                                    <li><NavLink to="/browse" className={linkClass}>Browse</NavLink></li>
                                    <li><NavLink to="/chatting" className={linkClass}>Chatting</NavLink></li>
                                    <li><NavLink to="/friends" className={linkClass}>Friends</NavLink></li>
                                </>
                            )
                        ) : (
                            <>
                                <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
                                <li><NavLink to="/jobs" className={linkClass}>Jobs</NavLink></li>
                                <li><NavLink to="/browse" className={linkClass}>Browse</NavLink></li>
                            </>
                        )}
                    </ul>

                    {user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div>
                                    <div className="flex gap-2">
                                        <Avatar>
                                            <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user.fullname}</h4>
                                            <p className="text-sm text-muted-foreground">{user.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col my-2 text-gray-600">
                                        {user.role === 'student' && (
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <User2 />
                                                <Button variant="link">
                                                    <NavLink to="/profile" className={linkClass}>View Profile</NavLink>
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink to="/login">
                                <Button variant="outline">Login</Button>
                            </NavLink>
                            <NavLink to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center">
                    {user && (
                        <>
                            <NavLink to="/notifications" className="relative">
                                <Bell size={24} />
                                {incoming.length > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {incoming.length}
                                    </span>
                                )}
                            </NavLink>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer mr-2">
                                        <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div>
                                        <div className="flex gap-2">
                                            <Avatar>
                                                <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">{user.fullname}</h4>
                                                <p className="text-sm text-muted-foreground">{user.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col my-2 text-gray-600">
                                            {user.role === 'student' && (
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <User2 />
                                                    <Button variant="link">
                                                        <NavLink to="/profile" className={linkClass}>View Profile</NavLink>
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    )}
                    {!user && (
                        <NavLink to="/login">
                            <Button variant="outline" size="sm">Login</Button>
                        </NavLink>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-white z-50 pt-16 px-4">
                        <ul className="flex flex-col font-medium gap-6 text-lg">
                            {user ? (
                                user.role === 'recruiter' ? (
                                    <>
                                        <li><NavLink to="/admin/companies" onClick={toggleMobileMenu} className={linkClass}>Companies</NavLink></li>
                                        <li><NavLink to="/admin/jobs" onClick={toggleMobileMenu} className={linkClass}>Jobs</NavLink></li>
                                        <li><NavLink to="/chatting" onClick={toggleMobileMenu} className={linkClass}>Chatting</NavLink></li>
                                    </>
                                ) : (
                                    <>
                                        <li><NavLink to="/" onClick={toggleMobileMenu} className={linkClass}>Home</NavLink></li>
                                        <li><NavLink to="/jobs" onClick={toggleMobileMenu} className={linkClass}>Jobs</NavLink></li>
                                        <li><NavLink to="/browse" onClick={toggleMobileMenu} className={linkClass}>Browse</NavLink></li>
                                        <li><NavLink to="/chatting" onClick={toggleMobileMenu} className={linkClass}>Chatting</NavLink></li>
                                        <li><NavLink to="/friends" onClick={toggleMobileMenu} className={linkClass}>Friends</NavLink></li>
                                    </>
                                )
                            ) : (
                                <>
                                    <li><NavLink to="/" onClick={toggleMobileMenu} className={linkClass}>Home</NavLink></li>
                                    <li><NavLink to="/jobs" onClick={toggleMobileMenu} className={linkClass}>Jobs</NavLink></li>
                                    <li><NavLink to="/browse" onClick={toggleMobileMenu} className={linkClass}>Browse</NavLink></li>
                                </>
                            )}
                        </ul>

                        {!user && (
                            <div className="mt-auto mb-8 pt-2">
                                <NavLink to="/signup" onClick={toggleMobileMenu}>
                                    <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] mb-4">Signup</Button>
                                </NavLink>
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    )
}

export default Navbar
