import { lazy } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import RouteList from "./routes"

const Routes = () => {
    return RouteList.map((route) => {
        const Com = lazy(() => route.component)

        if (route.redirect) {
            return <Redirect to={route.path} />
        }

        return <Route exact path={route.path} component={Com} />
    })
}

export default Routes
