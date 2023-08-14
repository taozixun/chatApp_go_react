import { HashRouter , Routes,Route} from "react-router-dom"
import Login from "../component/login"
import Regist from "../component/registe"
import Chat from "../component/chat"
import FriendList from "../component/fiendList"
import OneOnOne from "../component/oneOnOne"
import AboutMe from "../component/aboutMe"
import AboutFriend from "../component/aboutFriend"
const IndexRouter=()=>{
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/regist" element={<Regist />} />
                <Route path="/friendList" element={<FriendList />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/oneOnOne" element={<OneOnOne />} />
                <Route path="/aboutMe" element={<AboutMe />} />
                <Route path="/aboutFriend" element={<AboutFriend />} />
            </Routes>
        </HashRouter>
    )
}
export default IndexRouter