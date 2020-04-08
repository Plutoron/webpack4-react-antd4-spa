import * as React from "react"
import { ConfigProvider } from "antd"

import zhCN from "antd/es/locale/zh_CN"

// 样式
import "@common/flexbox.css"
import "@common/common.styl"
import "@common/reset-css.styl"

const Content = ({ children }) => {
	return (
		<>
			<ConfigProvider locale={zhCN}>
				<div
					className="content pt16"
					style={{
						width: "80%",
						margin: "0 auto",
					}}
				>
					{children}
				</div>
			</ConfigProvider>
		</>
	)
}

export default Content
