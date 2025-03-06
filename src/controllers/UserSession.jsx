import { useEffect, useState} from "react"
import axios from "axios"
import Logout from "./Logout"

const UserSession = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        axios.get("http://localhost:3000/auth/me", {withCredentials: true})
            .then(response => setUser(response.data))
            .catch(error => console.error("User fetch error:", error))

    }, [])

    return (
        <div>
            {user ? <h1>Welcome, {user.name}</h1> : <h1>Loading...</h1>}
            <Logout/>
        </div>
    )
}

export default UserSession