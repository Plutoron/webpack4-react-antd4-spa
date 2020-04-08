import ioContext from '@common/io-context'

ioContext.create('home', {
  getHomeData: {
    url: 'getHomeData',
  }
})

export default ioContext.api.home
