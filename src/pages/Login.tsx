
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"

//funcion para logear user y guardar token en el contexto
export default function Login() {

    const [email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");

    const { login } = useAuth()!;
    const navigate = useNavigate();

    return (
    <div>
        <div>
            <input type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>

        <div>
            <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>

        <Button onClick={() => { login("dummyToken"); navigate("/dashboard"); }}>
            Login
        </Button>
    </div>
)


}