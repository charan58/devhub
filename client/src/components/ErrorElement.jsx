import { useRouteError } from "react-router-dom";

function ErrorElement() {
    const routeError = useRouteError();
    return (
        <div className="text-error">{routeError.message}</div>
    )
}

export default ErrorElement;