import React,{useState, useEffect} from 'react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import authService from "../../services/authService"
import toast from "react-hot-toast"
import {User, Mail,Lock, Eye, EyeOff, KeyRound, Trash2} from "lucide-react"

const ProfilePage = () => {
  
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const[username, setUsername] = useState("");
  const [email, setEmail]= useState("");
 const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
   const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [groqApiKey, setGroqApiKey] = useState(() => sessionStorage.getItem("groqApiKey") || "");
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);



   useEffect(()=>{
    const fetchProfile = async ()=>{
      try{
        const{data} = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email)
      }catch(error){
        toast.error("failed to fetch profile data")
        console.error(error)
      }finally{
          setLoading(false)
      }
    }
    fetchProfile();
   },[])

   const handleChangePassword = async(e)=>{
    e.preventDefault();
    if(newPassword !== confirmNewPassword){
      toast.error("New passwords do not match")
      return 
    }
    if(newPassword.length<6){
      toast.error("NewPassword must be at least 6 characters long")
      return
    }
    setPasswordLoading(true);
    try{
      await authService.changePassword({currentPassword, newPassword});
      toast.success("password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")

    }catch(error){
      toast.error(error.message || "failed to change password")
    }finally{
      setPasswordLoading(false);
    }
   }

   const handleSaveGroqKey = (e) => {
    e.preventDefault();
    const value = groqApiKey.trim();
    if (value) sessionStorage.setItem("groqApiKey", value);
    else sessionStorage.removeItem("groqApiKey");
    toast.success(value ? "Groq API key saved for this browser session" : "Groq API key removed");
   };

   if(loading){
    return <Spinner/>
   }

  return (
   <>
    <div>
      <PageHeader title="Profile Settings"/>
      <div className="space-y-8">
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            User Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className='h-4 w-4 text-neutral-400'/>

                </div>
                <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">{username}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className='h-4 w-4 text-neutral-400'/>
                  </div>
                  <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900">{email}</p>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Groq AI</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Paste a key from GroqCloud to enable quizzes, flashcards, summaries, and chat.
            It is kept only in this browser session and sent over your configured API connection.
          </p>
          <form onSubmit={handleSaveGroqKey} className="space-y-3">
            <label className="block text-xs font-medium text-neutral-700" htmlFor="groq-api-key">
              Groq API key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-neutral-400" aria-hidden="true" />
              <input
              id="groq-api-key"
              type={showGroqApiKey ? "text" : "password"}
                autoComplete="off"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
                className="w-full h-10 pl-9 pr-11 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowGroqApiKey((visible) => !visible)}
                className="absolute right-2 top-2 p-1 text-neutral-500 hover:text-neutral-900"
                aria-label={showGroqApiKey ? "Hide Groq API key" : "Show Groq API key"}
              >
                {showGroqApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setGroqApiKey("");
                  sessionStorage.removeItem("groqApiKey");
                  toast.success("Groq API key removed");
                }}
              >
                <Trash2 className="h-4 w-4 mr-1.5" /> Clear
              </Button>
              <Button type="submit">Save Groq key</Button>
            </div>
          </form>
        </div>
        {/* change password form */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className='h-4 w-4 text-neutral-400'/>
                  </div>
                <input type="password" value={currentPassword} 
                onChange={(e)=>setCurrentPassword(e.target.value)} required className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none  focus:ring-2 focus:ring-[#00d49] focus:border-transparent"/>
              </div>
            </div>

             <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className='h-4 w-4 text-neutral-400'/>
                  </div>
                <input type="password" value={newPassword} 
                onChange={(e)=>setNewPassword(e.target.value)} required className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none  focus:ring-2 focus:ring-[#00d49] focus:border-transparent"/>
              </div>
            </div>

             <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className='h-4 w-4 text-neutral-400'/>
                  </div>
                <input type="password" value={confirmNewPassword} 
                onChange={(e)=>setConfirmNewPassword(e.target.value)} required className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none  focus:ring-2 focus:ring-[#00d49] focus:border-transparent"/>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type='submit' disabled={passwordLoading}>
                {passwordLoading ? "Changeing..." :"Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

   </>
  )
}

export default ProfilePage

