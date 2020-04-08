import React, {Component} from 'react'
export function asyncComponent(getComponent) {
  return class AsyncComponent extends Component {
    static Component = null

    state = { 
      Component: AsyncComponent.Component,
    }

    componentWillMount() {
      const {
        state: {
          Component,
        }
      } = this

      if (!Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component

          this.setState({ 
            Component,
          })
        })
      }
    }

    render() {
      const { 
        state: {
          Component,
        },
      } = this

      if (Component) {
        return <Component {...this.props} />
      }

      return null
    }
  }
}
