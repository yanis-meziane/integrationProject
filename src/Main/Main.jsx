import { Link } from "react-router-dom"

export default function Main(){
    return(
        <div>
            <h1>Bienvenue sur BoxLetter</h1>

            <p> Si vous avez un compte, <Link to="/login">connectez-vous</Link>.</p>
            <p> Si vous n'avez pas de compte, <Link to="/register">inscrivez-vous</Link></p>
        </div>
    )
}