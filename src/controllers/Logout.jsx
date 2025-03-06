import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
            console.log("Logout succesful!")
            navigate("/item/:id/login"); // Redirect user to login page
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;