import { Suspense } from "react"

import {
	BrowserRouter as Router,
	Switch,
} from "react-router-dom"

import { Spin } from "antd"

// 公共头部
import Content from "@comps/content"

import Routes from "./routes"

const App = () => {
	return (
		<Suspense fallback={<div style={{marginTop: 120, textAlign: 'center'}}><Spin size="small" spinning tip="页面加载中" /></div>}>
			<Router>
				<Content>
					<Switch>
						<Routes />
					</Switch>
				</Content>
			</Router>
		</Suspense>
	)
}

export default App
